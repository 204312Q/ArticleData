import type Stripe from "stripe"
import type { NextRequest } from "next/server"
import type { CheckoutDraft } from "@/lib/checkout/complete-order"

import { sendMail } from "@/lib/email/graphMailer"
import { orderBackend } from "@/lib/order-backend"
import { decodeDraftMetadata } from "@/lib/checkout/draft-metadata"
import { completeCheckoutOrder } from "@/lib/checkout/complete-order"
import { buildOrderConfirmationEmail } from "@/lib/email/order-confirmation"
import { loadVerifiedPayment, storeVerifiedPayment } from "@/lib/payment-gateway/store-verified-payment"
import { decodeGiftboxDraftMetadata, adaptGiftboxDraftToCheckoutDraft } from "@/lib/checkout/adapt-giftbox-draft"
import { hasStripeEventBeenProcessed, markStripeEventProcessedOnce } from "@/lib/payment-gateway/stripe-webhook-dedupe"
import {
  getStripeClient,
  toUpdatePaymentResponse,
  retrieveCheckoutSession,
} from "@/lib/payment-gateway/stripe-client"

export const runtime = "nodejs"

function decodeCheckoutDraft(sessionStub: Stripe.Checkout.Session): CheckoutDraft | null {
  const metadata = sessionStub.metadata ?? {}

  if (metadata.draftKind === "giftbox") {
    const giftboxDraft = decodeGiftboxDraftMetadata(metadata)
    return giftboxDraft ? adaptGiftboxDraftToCheckoutDraft(giftboxDraft) : null
  }

  // Sessions created before draftKind existed default to the product path.
  return decodeDraftMetadata(metadata)
}

// Backstop: create the order the same way /api/checkout/complete (or its
// giftbox equivalent) would, using the draft stashed in the Checkout
// Session's own metadata (the browser's sessionStorage copy is unreachable
// from here). Only proceeds if the payment re-reads as genuinely paid, and
// skips the confirmation email if the order creation reports duplicate — the
// browser-return path may have already created (and emailed) the same order
// moments earlier, or vice versa.
async function createBackstopOrder(orderReference: string, sessionStub: Stripe.Checkout.Session): Promise<void> {
  if (orderBackend() === "bc") {
    // BC mode is dormant/off-wired in this app — this backstop is scoped to
    // CT Backend, the active default.
    return
  }

  const draft = decodeCheckoutDraft(sessionStub)
  if (!draft) {
    // Thrown, not swallowed: the caller's catch turns this into a non-2xx so
    // Stripe marks the delivery failed (visible + retried) instead of a
    // false "received: true" hiding a backstop that silently did nothing.
    throw new Error(`[payments/webhook] No draft metadata found for ${orderReference}`)
  }

  const verifiedPayment = await loadVerifiedPayment(orderReference)
  if (!verifiedPayment || verifiedPayment.paymentStatus !== "PAID") {
    throw new Error(`[payments/webhook] Payment not confirmed PAID, skipping order creation for ${orderReference}`)
  }

  const completedOrder = await completeCheckoutOrder({ draft, payment: verifiedPayment })

  if (!completedOrder.duplicate) {
    try {
      const email = buildOrderConfirmationEmail({ completedOrder, draft })
      await sendMail({ to: draft.delivery.email, subject: email.subject, html: email.html })
    } catch (error) {
      console.error("[payments/webhook] Order confirmation email failed to send", error)
    }
  }
}

// Stripe's own signature verification (below) is this route's authentication —
// it intentionally does not go through assertRequestGuards(), since that guard
// stack expects our own HMAC/API-key headers, which Stripe's requests never send.
export async function POST(request: NextRequest): Promise<Response> {
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

  if (!signature || !webhookSecret) {
    console.error("[payments/webhook] Missing stripe-signature header or STRIPE_WEBHOOK_SECRET")
    return Response.json({ error: "Webhook not configured" }, { status: 400 })
  }

  // Stripe signature verification requires the raw, unparsed request body.
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = getStripeClient().webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    console.error("[payments/webhook] Signature verification failed", error)
    return Response.json({ error: "Invalid signature" }, { status: 400 })
  }

  const alreadyProcessed = await hasStripeEventBeenProcessed(event.id)
  if (alreadyProcessed) {
    // Stripe redelivered an event we've already processed — acknowledge without
    // repeating any side effects.
    return Response.json({ received: true, duplicate: true })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const sessionStub = event.data.object as Stripe.Checkout.Session
        const orderReference = sessionStub.metadata?.orderReference

        if (!orderReference) {
          console.error("[payments/webhook] Checkout Session missing orderReference metadata", sessionStub.id)
          break
        }

        // The webhook payload's payment_intent is just an id, not expanded —
        // re-fetch so toUpdatePaymentResponse gets the full PaymentIntent object.
        const session = await retrieveCheckoutSession(sessionStub.id)
        const intent = session.payment_intent

        if (!intent || typeof intent === "string") {
          console.error("[payments/webhook] Checkout Session is missing its payment intent", sessionStub.id)
          break
        }

        if (session.payment_status !== "paid") {
          break
        }

        const payment = toUpdatePaymentResponse(intent, orderReference)
        await storeVerifiedPayment(payment)
        await createBackstopOrder(orderReference, sessionStub)
        break
      }
      default:
        // Event type we don't act on — acknowledged and ignored.
        break
    }

    // Only mark the event processed once everything above actually succeeded —
    // marking it any earlier would let a thrown error silently swallow a
    // genuine Stripe retry (see hasStripeEventBeenProcessed above).
    await markStripeEventProcessedOnce(event.id)
    return Response.json({ received: true })
  } catch (error) {
    console.error("[payments/webhook] Failed to process event", event.id, event.type, error)
    // Non-2xx tells Stripe to retry this event later.
    return Response.json({ error: "Failed to process webhook event" }, { status: 500 })
  }
}

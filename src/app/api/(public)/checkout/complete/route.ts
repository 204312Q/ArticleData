import type { NextRequest } from "next/server"

import { sendMail } from "@/lib/email/graphMailer"
import { orderBackend } from "@/lib/order-backend"
import { assertRequestGuards } from "@/lib/guard/assert"
import { completeCheckoutOrder } from "@/lib/checkout/complete-order"
import { verifyOrderPricing } from "@/lib/checkout/verify-order-pricing"
import { failure, success, firstZodErrorMessage } from "@/lib/api-response"
import { buildOrderConfirmationEmail } from "@/lib/email/order-confirmation"
import { loadVerifiedPayment } from "@/lib/payment-gateway/store-verified-payment"

import { completeCheckoutSchema } from "./schema"

export const runtime = "nodejs"

export async function POST(request: NextRequest): Promise<Response> {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  try {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      return failure("Request Param Invalid", 400)
    }

    const parsed = completeCheckoutSchema.safeParse(body)
    if (!parsed.success) {
      return failure(firstZodErrorMessage(parsed.error), 400)
    }

    console.log("[checkout] Frontend payload:", JSON.stringify(parsed.data, null, 2))

    if (parsed.data.orderReference !== parsed.data.draft.draftId) {
      return failure("orderReference must match draft.draftId", 400)
    }

    // The card was already charged and recorded by /api/payments/confirm.
    // Reuse that verified payment here instead of charging again (single source
    // of truth = payment_transactions). This keeps order creation retryable
    // without re-running the payment. The read comes from whichever backend
    // recorded it: CT Backend (dev_ctbackend, status PAID) by default, or the
    // local mirror (dev_confinement, status AUTHORIZED) in BC mode — so the
    // browser can never submit an order whose payment didn't really succeed.
    const payment = await loadVerifiedPayment(parsed.data.orderReference)
    if (!payment) {
      return failure("No payment found for this order. Please complete payment first.", 409)
    }

    const paidStatus = orderBackend() === "bc" ? "AUTHORIZED" : "PAID"
    if (payment.paymentStatus !== paidStatus) {
      return failure(`Payment is not authorized. Current status: ${payment.paymentStatus}`, 409)
    }

    // The Stripe webhook backstop (payments/webhook/route.ts) can race ahead
    // of this browser-driven completion call and create the order first —
    // it reads straight from the Checkout Session's own metadata, so it
    // doesn't need to re-verify pricing the way this route does. If that
    // already happened, there's nothing left to verify or create: re-running
    // verifyOrderPricing here would recompute promo eligibility against a
    // redemption/usage count the webhook's own order has already changed
    // (e.g. a single-use code now looking "already used"), producing a false
    // rejection for an order that in fact already succeeded.
    if (payment.orderNo) {
      return success({ orderNo: payment.orderNo }, "Checkout completed successfully", 201)
    }

    // The draft's prices, subtotal, promo discount, and total are all
    // client-submitted — verify them against the live catalog/promo rules and
    // the amount actually charged before creating the order. See
    // verify-order-pricing.ts for why this can't just compare two
    // client-supplied numbers.
    const pricingCheck = await verifyOrderPricing(parsed.data.draft, payment.amount)
    if (!pricingCheck.ok) {
      console.error("[checkout/complete] Pricing verification failed", {
        orderReference: parsed.data.orderReference,
        reason: pricingCheck.reason,
      })
      return failure(pricingCheck.reason, 409)
    }

    const completedOrder = await completeCheckoutOrder({
      draft: parsed.data.draft,
      payment,
    })

    // Skip if the webhook backstop already created this order (and already
    // emailed the customer) moments earlier — avoids a duplicate email.
    if (!completedOrder.duplicate) {
      try {
        const email = buildOrderConfirmationEmail({ completedOrder, draft: parsed.data.draft })
        await sendMail({
          to: parsed.data.draft.delivery.email,
          subject: email.subject,
          html: email.html,
        })
      } catch (error) {
        // The order and payment already succeeded — a failed confirmation email
        // must not fail the checkout response or block the customer.
        console.error("[checkout/complete] Order confirmation email failed to send", error)
      }
    }

    return success(completedOrder, "Checkout completed successfully", 201)
  } catch (error) {
    console.error("[checkout/complete] Unexpected error", error)

    return failure(error instanceof Error ? error.message : "Failed to complete checkout", 500)
  }
}

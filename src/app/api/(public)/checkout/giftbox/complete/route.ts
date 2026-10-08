import type { NextRequest } from "next/server"

import { sendMail } from "@/lib/email/graphMailer"
import { orderBackend } from "@/lib/order-backend"
import { assertRequestGuards } from "@/lib/guard/assert"
import { completeCheckoutOrder } from "@/lib/checkout/complete-order"
import { verifyOrderPricing } from "@/lib/checkout/verify-order-pricing"
import { failure, success, firstZodErrorMessage } from "@/lib/api-response"
import { buildOrderConfirmationEmail } from "@/lib/email/order-confirmation"
import { loadVerifiedPayment } from "@/lib/payment-gateway/store-verified-payment"
import { adaptGiftboxDraftToCheckoutDraft } from "@/lib/checkout/adapt-giftbox-draft"

import { completeGiftboxCheckoutSchema } from "./schema"

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

    const parsed = completeGiftboxCheckoutSchema.safeParse(body)
    if (!parsed.success) {
      return failure(firstZodErrorMessage(parsed.error), 400)
    }

    if (parsed.data.orderReference !== parsed.data.draft.draftId) {
      return failure("orderReference must match draft.draftId", 400)
    }

    // Giftbox order creation is scoped to CT Backend — BC has its own,
    // structurally different giftbox order entity, not wired up here.
    if (orderBackend() === "bc") {
      return failure("Giftbox checkout is not available while ORDER_BACKEND=bc.", 501)
    }

    // The card was already charged and recorded by /api/payments/confirm.
    // Reuse that verified payment here instead of charging again — same
    // pattern as /api/checkout/complete.
    const payment = await loadVerifiedPayment(parsed.data.orderReference)
    if (!payment) {
      return failure("No payment found for this order. Please complete payment first.", 409)
    }

    if (payment.paymentStatus !== "PAID") {
      return failure(`Payment is not authorized. Current status: ${payment.paymentStatus}`, 409)
    }

    // See checkout/complete/route.ts — the webhook backstop can race ahead
    // and already have created this order from the Checkout Session's own
    // metadata. If so, skip re-deriving pricing against promo/redemption
    // state that order may have already changed, and just report it.
    if (payment.orderNo) {
      return success({ orderNo: payment.orderNo }, "Checkout completed successfully", 201)
    }

    const draft = adaptGiftboxDraftToCheckoutDraft(parsed.data.draft)

    // See verify-order-pricing.ts — the draft's item prices/subtotal/promo
    // discount/total are all client-submitted and must be checked against the
    // live catalog/promo rules and the amount actually charged before an
    // order is created.
    const pricingCheck = await verifyOrderPricing(draft, payment.amount)
    if (!pricingCheck.ok) {
      console.error("[checkout/giftbox/complete] Pricing verification failed", {
        orderReference: parsed.data.orderReference,
        reason: pricingCheck.reason,
      })
      return failure(pricingCheck.reason, 409)
    }

    const completedOrder = await completeCheckoutOrder({ draft, payment })

    // Skip if the webhook backstop already created this order (and already
    // emailed the customer) moments earlier — avoids a duplicate email.
    if (!completedOrder.duplicate) {
      try {
        const email = buildOrderConfirmationEmail({ completedOrder, draft })
        await sendMail({
          to: draft.delivery.email,
          subject: email.subject,
          html: email.html,
        })
      } catch (error) {
        // The order and payment already succeeded — a failed confirmation email
        // must not fail the checkout response or block the customer.
        console.error("[checkout/giftbox/complete] Order confirmation email failed to send", error)
      }
    }

    return success(completedOrder, "Checkout completed successfully", 201)
  } catch (error) {
    console.error("[checkout/giftbox/complete] Unexpected error", error)

    return failure(error instanceof Error ? error.message : "Failed to complete checkout", 500)
  }
}

import type { NextRequest } from "next/server"

import { assertRequestGuards } from "@/lib/guard/assert"
import { paymentGateway } from "@/lib/payment-gateway-mode"
import { encodeDraftMetadata } from "@/lib/checkout/draft-metadata"
import { failure, success, firstZodErrorMessage } from "@/lib/api-response"
import { createCheckoutSession } from "@/lib/payment-gateway/stripe-client"
import { verifyRequestedChargeAmount } from "@/lib/checkout/verify-order-pricing"
import { buildCaptureContextPayload } from "@/lib/payment-gateway/capture-context"
import { PaymentGatewayError, generateCaptureContext } from "@/lib/payment-gateway/client"

import { createPaymentSessionSchema } from "./schema"

export const runtime = "nodejs"

function resolvePaymentTargetOrigin(request: NextRequest): string {
  const configuredOrigin = process.env.PG_TARGET_ORIGIN?.trim()
  if (configuredOrigin) {
    return configuredOrigin
  }

  return request.nextUrl.origin
}

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

    const parsed = createPaymentSessionSchema.safeParse(body)
    if (!parsed.success) {
      return failure(firstZodErrorMessage(parsed.error), 400)
    }

    // The card is charged for exactly `parsed.data.amount` below — verify it
    // against the draft's own catalog-recomputed total BEFORE either gateway
    // is called, not after. verifyOrderPricing (checkout/complete) only
    // catches a mismatch once the charge has already happened; this is what
    // stops the wrong amount from ever reaching the gateway in the first place.
    const pricingCheck = await verifyRequestedChargeAmount(parsed.data.draft, parsed.data.amount)
    if (!pricingCheck.ok) {
      console.error("[payments/session] Requested amount does not match draft pricing", {
        orderReference: parsed.data.orderReference,
        reason: pricingCheck.reason,
      })
      return failure(pricingCheck.reason, 400)
    }

    if (paymentGateway() === "stripe") {
      const origin = resolvePaymentTargetOrigin(request)
      const orderRefParam = encodeURIComponent(parsed.data.orderReference)

      const { sessionId, url } = await createCheckoutSession({
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        email: parsed.data.customer.email,
        metadata: { draftKind: "product", ...encodeDraftMetadata(parsed.data.draft) },
        orderReference: parsed.data.orderReference,
        successUrl: `${origin}/order-success?stripeSessionId={CHECKOUT_SESSION_ID}&orderRef=${orderRefParam}&draftKind=product`,
        cancelUrl: `${origin}/product?stripeCancelled=true&orderRef=${orderRefParam}`,
      })

      return success(
        {
          gateway: "stripe" as const,
          sessionId,
          url,
          orderReference: parsed.data.orderReference,
        },
        "Payment session created successfully",
        200
      )
    }

    const pgResponse = await generateCaptureContext(
      buildCaptureContextPayload({
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        email: parsed.data.customer.email,
        orderReference: parsed.data.orderReference,
        origin: resolvePaymentTargetOrigin(request),
        phoneNumber: parsed.data.customer.phoneNumber,
      })
    )

    const captureContext = pgResponse.data?.captureContext
    if (!captureContext) {
      return failure("Payment gateway returned empty capture context", 502)
    }

    return success(
      {
        gateway: "cybersource" as const,
        captureContext,
        orderReference: parsed.data.orderReference,
      },
      "Payment session created successfully",
      200
    )
  } catch (error) {
    if (error instanceof PaymentGatewayError) {
      console.error("[payments/session] Payment gateway error", {
        correlationId: error.correlationId,
        details: error.details,
        envelope: error.envelope,
        message: error.message,
        status: error.status,
      })

      return failure(error.message || "Payment gateway error", error.status)
    }

    console.error("[payments/session] Unexpected error", error)

    return failure(error instanceof Error ? error.message : "Failed to create payment session", 500)
  }
}

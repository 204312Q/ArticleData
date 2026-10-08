import type { NextRequest } from "next/server"

import { isPayLabEnabled } from "@/lib/paylab/enabled"
import { failure, success, firstZodErrorMessage } from "@/lib/api-response"
import { updatePayment, PaymentGatewayError } from "@/lib/payment-gateway/client"

import { payLabConfirmSchema } from "./schema"

export const runtime = "nodejs"

/**
 * Exchanges the Unified Checkout result for a real authorization, then STOPS.
 *
 * Unlike `/api/payments/confirm` this deliberately does not call
 * `storeVerifiedPayment()` and the caller does not go on to
 * `/api/checkout/complete` — nothing is written to CTBackend or Business
 * Central. The full gateway envelope is returned instead, so a failure can be
 * read directly rather than inferred from a friendly error string.
 */
export async function POST(request: NextRequest): Promise<Response> {
  if (!isPayLabEnabled()) {
    return failure("Not Found", 404)
  }

  try {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      return failure("Request Param Invalid", 400)
    }

    const parsed = payLabConfirmSchema.safeParse(body)
    if (!parsed.success) {
      return failure(firstZodErrorMessage(parsed.error), 400)
    }

    const pgResponse = await updatePayment({
      expectedOrderReference: parsed.data.orderReference,
      resultJwt: parsed.data.resultJwt,
      transientToken: parsed.data.transientToken,
    })

    if (!pgResponse.data) {
      return failure("Payment gateway returned empty payment update", 502)
    }

    const payment = pgResponse.data

    return success(
      {
        amount: payment.amount ?? null,
        card: payment.card ?? null,
        correlationId: pgResponse.meta?.correlationId ?? null,
        errorReason: payment.errorReason ?? null,
        orderReference: payment.orderReference,
        paymentStatus: payment.status,
        processorInformation: payment.processorInformation ?? null,
        reconciliationId: payment.reconciliationId ?? null,
        submitTimeUtc: payment.submitTimeUtc ?? null,
        transactionId: payment.transactionId,
      },
      payment.status === "AUTHORIZED"
        ? "Payment authorized"
        : `Payment ${payment.status.toLowerCase()}`,
      200
    )
  } catch (error) {
    if (error instanceof PaymentGatewayError) {
      console.error("[paylab/confirm] Payment gateway error", {
        correlationId: error.correlationId,
        details: error.details,
        message: error.message,
        status: error.status,
      })

      // A decline arrives as a 402 with the processor's own detail attached —
      // surface it as data rather than an error so the lab can display it.
      if (error.status === 402 && error.details) {
        return success(error.details, error.message || "Payment not approved", 402)
      }

      return failure(error.message || "Payment gateway error", error.status)
    }

    console.error("[paylab/confirm] Unexpected error", error)

    return failure(error instanceof Error ? error.message : "Failed to confirm payment", 500)
  }
}

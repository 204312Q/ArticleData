import type { NextRequest } from "next/server"

import { randomUUID } from "node:crypto"
import { isPayLabEnabled } from "@/lib/paylab/enabled"
import { failure, success, firstZodErrorMessage } from "@/lib/api-response"
import { buildCaptureContextPayload } from "@/lib/payment-gateway/capture-context"
import { PaymentGatewayError, generateCaptureContext } from "@/lib/payment-gateway/client"

import { payLabSessionSchema } from "./schema"

export const runtime = "nodejs"

/**
 * The origin CyberSource will accept Unified Checkout from. Must match the
 * browser's origin byte for byte — scheme, host, no trailing slash. On the
 * paylab deployment `PG_TARGET_ORIGIN` pins it to the custom subdomain.
 */
function resolvePaymentTargetOrigin(request: NextRequest): string {
  const configuredOrigin = process.env.PG_TARGET_ORIGIN?.trim()
  if (configuredOrigin) {
    return configuredOrigin
  }

  return request.nextUrl.origin
}

function createLabOrderReference(): string {
  return `PAYLAB-${randomUUID().slice(0, 8).toUpperCase()}`
}

export async function POST(request: NextRequest): Promise<Response> {
  // Gate 1. Entra ID (gate 2) is enforced ahead of this by middleware.ts, which
  // covers every /api/ path outside its public-prefix list.
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

    const parsed = payLabSessionSchema.safeParse(body)
    if (!parsed.success) {
      return failure(firstZodErrorMessage(parsed.error), 400)
    }

    const origin = resolvePaymentTargetOrigin(request)
    const orderReference = createLabOrderReference()

    const pgResponse = await generateCaptureContext(
      buildCaptureContextPayload({
        allowedPaymentTypes: [...parsed.data.allowedPaymentTypes],
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        email: parsed.data.email,
        orderReference,
        origin,
        phoneNumber: parsed.data.phoneNumber,
      })
    )

    const captureContext = pgResponse.data?.captureContext
    if (!captureContext) {
      return failure("Payment gateway returned empty capture context", 502)
    }

    return success(
      {
        captureContext,
        // Echoed back so the lab UI can show what was actually sent — a mismatch
        // here against window.location.origin is the usual cause of a blank iframe.
        correlationId: pgResponse.meta?.correlationId ?? null,
        orderReference,
        targetOrigin: origin,
      },
      "Payment lab session created",
      200
    )
  } catch (error) {
    if (error instanceof PaymentGatewayError) {
      console.error("[paylab/session] Payment gateway error", {
        correlationId: error.correlationId,
        details: error.details,
        envelope: error.envelope,
        message: error.message,
        status: error.status,
      })

      return failure(error.message || "Payment gateway error", error.status)
    }

    console.error("[paylab/session] Unexpected error", error)

    return failure(error instanceof Error ? error.message : "Failed to create session", 500)
  }
}

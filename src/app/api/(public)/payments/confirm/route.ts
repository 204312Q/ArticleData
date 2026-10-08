import type Stripe from "stripe"
import type { NextRequest } from "next/server"
import type { UpdatePaymentResponse } from "@/lib/payment-gateway/client"

import { assertRequestGuards } from "@/lib/guard/assert"
import { paymentGateway } from "@/lib/payment-gateway-mode"
import { failure, success, firstZodErrorMessage } from "@/lib/api-response"
import { updatePayment, PaymentGatewayError } from "@/lib/payment-gateway/client"
import { storeVerifiedPayment } from "@/lib/payment-gateway/store-verified-payment"
import { retrieveCheckoutSession, toUpdatePaymentResponse } from "@/lib/payment-gateway/stripe-client"

import { confirmPaymentSchema } from "./schema"

export const runtime = "nodejs"

type ConfirmPaymentResponse = {
  amount: string | null
  billingAddress: {
    address1: string | null
    address2: string | null
    administrativeArea: string | null
    country: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    locality: string | null
    phoneNumber: string | null
    postalCode: string | null
  } | null
  card: {
    expirationMonth: string | null
    expirationYear: string | null
    number: string | null
    type: string | null
  } | null
  currency: string | null
  errorReason: string | null
  orderReference: string
  paymentStatus: string
  processorInformation: {
    approvalCode: string | null
    networkTransactionId: string | null
    responseCode: string | null
  } | null
  reconciliationId: string | null
  shippingAddress: {
    address1: string | null
    address2: string | null
    administrativeArea: string | null
    country: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    locality: string | null
    phoneNumber: string | null
    postalCode: string | null
  } | null
  submitTimeUtc: string | null
  paymentTransactionId: string
  transactionId: string
}

function normalizeAddress(
  address:
    | {
        address1?: string
        address2?: string
        administrativeArea?: string
        country?: string
        email?: string
        firstName?: string
        lastName?: string
        locality?: string
        phoneNumber?: string
        postalCode?: string
      }
    | undefined
): ConfirmPaymentResponse["billingAddress"] {
  if (!address) {
    return null
  }

  return {
    address1: address.address1 ?? null,
    address2: address.address2 ?? null,
    administrativeArea: address.administrativeArea ?? null,
    country: address.country ?? null,
    email: address.email ?? null,
    firstName: address.firstName ?? null,
    lastName: address.lastName ?? null,
    locality: address.locality ?? null,
    phoneNumber: address.phoneNumber ?? null,
    postalCode: address.postalCode ?? null,
  }
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

    const parsed = confirmPaymentSchema.safeParse(body)
    if (!parsed.success) {
      return failure(firstZodErrorMessage(parsed.error), 400)
    }

    let payment: UpdatePaymentResponse

    // Both branches end up with the same normalized `UpdatePaymentResponse`
    // shape (see toUpdatePaymentResponse()/PaymentGatewayError below), so
    // everything after this if/else — storing the payment, building the
    // response — is gateway-agnostic and never needs to branch again.
    if (paymentGateway() === "stripe") {
      // Stripe: the charge already happened on Stripe's own hosted Checkout
      // page before the browser ever reached this route. There's nothing to
      // "submit" here — this branch only re-reads the Checkout Session by id
      // and verifies it, it never sends card data or authorizes a charge.
      if (!parsed.data.stripeSessionId) {
        return failure("stripeSessionId is required", 400)
      }

      const session = await retrieveCheckoutSession(parsed.data.stripeSessionId)

      // The Checkout Session's own metadata.orderReference (set when the
      // session was created) is the only authoritative link between a paid
      // session and the order it's for — without this check, any of the
      // caller's own paid sessions could be confirmed under an arbitrary,
      // self-chosen orderReference paired with a mismatched (e.g. costlier)
      // draft submitted afterward to /api/checkout/complete.
      if (session.metadata?.orderReference !== parsed.data.orderReference) {
        return failure("Stripe checkout session does not match the given orderReference", 400)
      }

      if (session.payment_status !== "paid") {
        return failure(`Payment not completed. Current status: ${session.payment_status}`, 402)
      }

      const intent = session.payment_intent
      if (!intent || typeof intent === "string") {
        return failure("Stripe checkout session is missing its payment intent", 502)
      }

      // Normalizes Stripe's PaymentIntent into the exact shape CyberSource's
      // updatePayment() already returns below, so storeVerifiedPayment() and
      // the response-building code never need to know which gateway ran.
      payment = toUpdatePaymentResponse(intent as Stripe.PaymentIntent, parsed.data.orderReference)
    } else {
      // CyberSource: this IS the authorization step. The browser already ran
      // CyberSource's in-page card capture (Unified Checkout / Flex
      // Microform) and got back a resultJwt + transientToken, which this
      // call exchanges with CyberSource for the actual authorization —
      // unlike the Stripe branch, the charge is decided by this very call.
      const pgResponse = await updatePayment({
        expectedOrderReference: parsed.data.orderReference,
        resultJwt: parsed.data.resultJwt ?? "",
        transientToken: parsed.data.transientToken ?? "",
      })

      if (!pgResponse.data) {
        return failure("Payment gateway returned empty payment update", 502)
      }

      payment = pgResponse.data
    }

    const paymentTransactionId = await storeVerifiedPayment(payment)

    const result: ConfirmPaymentResponse = {
      amount: payment.amount?.total ?? payment.amount?.authorized ?? null,
      billingAddress: normalizeAddress(payment.billingAddress),
      card: payment.card
        ? {
            expirationMonth: payment.card.expirationMonth ?? null,
            expirationYear: payment.card.expirationYear ?? null,
            number: payment.card.number ?? null,
            type: payment.card.type ?? null,
          }
        : null,
      currency: payment.amount?.currency ?? null,
      errorReason: payment.errorReason ?? null,
      orderReference: payment.orderReference,
      paymentStatus: payment.status,
      processorInformation: payment.processorInformation
        ? {
            approvalCode: payment.processorInformation.approvalCode ?? null,
            networkTransactionId: payment.processorInformation.networkTransactionId ?? null,
            responseCode: payment.processorInformation.responseCode ?? null,
          }
        : null,
      reconciliationId: payment.reconciliationId ?? null,
      shippingAddress: normalizeAddress(payment.shippingAddress),
      submitTimeUtc: payment.submitTimeUtc ?? null,
      paymentTransactionId,
      transactionId: payment.transactionId,
    }

    return success(
      result,
      payment.status === "AUTHORIZED" ? "Payment verified successfully" : `Payment ${payment.status.toLowerCase()}`,
      200
    )
  } catch (error) {
    if (error instanceof PaymentGatewayError) {
      console.error("[payments/confirm] Payment gateway error", {
        correlationId: error.correlationId,
        details: error.details,
        message: error.message,
        status: error.status,
      })

      if (error.status === 402 && error.details) {
        return success(error.details, error.message || "Payment not approved", 402)
      }

      return failure(error.message || "Payment gateway error", error.status)
    }

    console.error("[payments/confirm] Unexpected error", error)

    return failure(error instanceof Error ? error.message : "Failed to confirm payment", 500)
  }
}



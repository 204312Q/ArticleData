import type { StoredPaymentTransaction } from "@/lib/payment-transactions"
import type { UpdatePaymentResponse } from "./client"

import { orderBackend } from "@/lib/order-backend"
import { getCTBPayment, recordCTBPayment } from "@/lib/ct-backend/client"
import { upsertPaymentTransaction, getPaymentTransactionByOrderReference } from "@/lib/payment-transactions"

// Persist a gateway-verified payment (CyberSource or Stripe, normalized to the
// same UpdatePaymentResponse shape). CT Backend mode (default): only successful
// (AUTHORIZED) payments are stored, in dev_ctbackend, via the signed POST
// /api/payments — declined attempts stay in the gateway portal.
// BC mode: original behavior, every gateway result upserted locally.
// Returns the stored row id, or "" when nothing was stored.
export async function storeVerifiedPayment(payment: UpdatePaymentResponse): Promise<string> {
  if (orderBackend() === "bc") {
    return upsertPaymentTransaction(payment)
  }

  if (payment.status !== "AUTHORIZED") {
    return ""
  }

  const input = {
    amount: payment.amount?.total ?? payment.amount?.authorized ?? undefined,
    currency: payment.amount?.currency ?? undefined,
    customerEmail: payment.billingAddress?.email?.trim() || payment.shippingAddress?.email?.trim() || undefined,
    gatewayResponse: payment,
    orderReference: payment.orderReference,
    reconciliationId: payment.reconciliationId ?? undefined,
    transactionId: payment.transactionId,
  }

  // The card is already charged at this point — retry once, and if CT Backend
  // still cannot record it, log the full payload for manual recovery before
  // failing (the charge also remains visible in the gateway portal).
  try {
    return (await recordCTBPayment(input)).id
  } catch (firstError) {
    console.error("[storeVerifiedPayment] CT Backend payment record failed, retrying", firstError)
    try {
      return (await recordCTBPayment(input)).id
    } catch (secondError) {
      console.error(
        "[storeVerifiedPayment] RECOVERY NEEDED — charged payment could not be recorded:",
        JSON.stringify(input)
      )
      throw secondError
    }
  }
}

// Re-read a payment previously persisted by storeVerifiedPayment(), from
// whichever backend recorded it — used before creating an order, so an order
// can never be created for a payment that didn't actually succeed.
export async function loadVerifiedPayment(orderReference: string): Promise<StoredPaymentTransaction | null> {
  if (orderBackend() === "bc") {
    return getPaymentTransactionByOrderReference(orderReference)
  }

  const payment = await getCTBPayment(orderReference)
  if (!payment) return null

  return {
    amount: payment.amount,
    currency: payment.currency,
    orderNo: payment.orderNo,
    orderReference: payment.orderReference,
    paymentStatus: payment.status,
    paymentTransactionId: payment.id,
    transactionId: payment.transactionId,
  }
}

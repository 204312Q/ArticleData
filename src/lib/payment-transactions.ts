import type { UpdatePaymentResponse } from '@/lib/payment-gateway/client'

import { prisma } from '@/lib/prisma'
import { randomUUID } from 'node:crypto'

function resolveCustomerEmail(payment: UpdatePaymentResponse): string | null {
  return payment.billingAddress?.email?.trim() || payment.shippingAddress?.email?.trim() || null
}

export async function upsertPaymentTransaction(payment: UpdatePaymentResponse): Promise<string> {
  const amount = payment.amount?.total ?? payment.amount?.authorized ?? null
  const currency = payment.amount?.currency ?? null
  const customerEmail = resolveCustomerEmail(payment)
  const gatewayResponse = JSON.stringify(payment)
  const reconciliationId = payment.reconciliationId ?? null

  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    INSERT INTO payment_transactions (
      id,
      order_reference,
      transaction_id,
      payment_status,
      amount,
      currency,
      reconciliation_id,
      customer_email,
      gateway_response,
      created_at,
      updated_at
    )
    VALUES (
      ${randomUUID()}::uuid,
      ${payment.orderReference},
      ${payment.transactionId},
      ${payment.status},
      ${amount},
      ${currency},
      ${reconciliationId},
      ${customerEmail},
      ${gatewayResponse}::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (order_reference)
    DO UPDATE SET
      transaction_id = EXCLUDED.transaction_id,
      payment_status = EXCLUDED.payment_status,
      amount = EXCLUDED.amount,
      currency = EXCLUDED.currency,
      reconciliation_id = EXCLUDED.reconciliation_id,
      customer_email = EXCLUDED.customer_email,
      gateway_response = EXCLUDED.gateway_response,
      updated_at = NOW()
    RETURNING id
  `

  const persistedId = rows[0]?.id?.trim()
  if (!persistedId) {
    throw new Error("Failed to persist payment transaction record.")
  }

  return persistedId
}

export type StoredPaymentTransaction = {
  amount: string | null
  currency: string | null
  // Set once an order has actually been created for this payment — lets a
  // completion call detect it already lost the race to the webhook backstop
  // (see checkout/complete/route.ts) instead of re-deriving pricing.
  orderNo: string | null
  orderReference: string
  paymentStatus: string
  paymentTransactionId: string
  transactionId: string
}

// Reads a payment already charged & recorded by /api/payments/confirm so the
// checkout-complete step can create the order without re-running the payment.
export async function getPaymentTransactionByOrderReference(
  orderReference: string
): Promise<StoredPaymentTransaction | null> {
  const rows = await prisma.$queryRaw<
    Array<{
      amount: string | number | null
      currency: string | null
      id: string
      order_reference: string
      payment_status: string
      transaction_id: string
    }>
  >`
    SELECT id, transaction_id, payment_status, amount, currency, order_reference
    FROM payment_transactions
    WHERE order_reference = ${orderReference}
    LIMIT 1
  `

  const row = rows[0]
  if (!row) {
    return null
  }

  return {
    amount: row.amount === null || row.amount === undefined ? null : String(row.amount),
    currency: row.currency ?? null,
    // BC mode's webhook backstop returns early and never creates orders (see
    // createBackstopOrder), so this race can't happen there.
    orderNo: null,
    orderReference: row.order_reference,
    paymentStatus: row.payment_status,
    paymentTransactionId: row.id,
    transactionId: row.transaction_id,
  }
}

type UpsertOrderRecordInput = {
  customerNo: string
  dateType: string
  externalDocumentNo: string
  orderNo: string
  orderSource?: string | null
  paymentTransactionId?: string | null
}

export async function upsertOrderRecord(input: UpsertOrderRecordInput): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO orders (
      id,
      order_no,
      external_document_no,
      customer_no,
      date_type,
      order_source,
      payment_transaction_id,
      created_at,
      updated_at
    )
    VALUES (
      ${randomUUID()}::uuid,
      ${input.orderNo},
      ${input.externalDocumentNo},
      ${input.customerNo},
      ${input.dateType},
      ${input.orderSource || "Undefined"},
      ${input.paymentTransactionId || null}::uuid,
      NOW(),
      NOW()
    )
    ON CONFLICT (order_no)
    DO UPDATE SET
      external_document_no = EXCLUDED.external_document_no,
      customer_no = EXCLUDED.customer_no,
      date_type = EXCLUDED.date_type,
      order_source = EXCLUDED.order_source,
      payment_transaction_id = EXCLUDED.payment_transaction_id,
      updated_at = NOW()
  `
}

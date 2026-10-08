import type { UpdatePaymentResponse } from "./client"

import Stripe from "stripe"

let cachedClient: Stripe | null = null

export function getStripeClient(): Stripe {
  if (cachedClient) {
    return cachedClient
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set")
  }

  cachedClient = new Stripe(secretKey)
  return cachedClient
}

export type CreateCheckoutSessionInput = {
  amount: string
  currency: string
  cancelUrl: string
  email: string
  metadata?: Record<string, string>
  orderReference: string
  successUrl: string
}

export type CreateCheckoutSessionResult = {
  sessionId: string
  url: string
}

// Stripe amounts are integers in the currency's smallest unit (cents for SGD).
function toStripeAmount(amount: string): number {
  return Math.round(Number.parseFloat(amount) * 100)
}

function fromStripeAmount(amount: number | null): string | undefined {
  if (amount === null) return undefined
  return (amount / 100).toFixed(2)
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
  const stripe = getStripeClient()

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [
      {
        price_data: {
          currency: input.currency.toLowerCase(),
          product_data: { name: `Order ${input.orderReference}` },
          unit_amount: toStripeAmount(input.amount),
        },
        quantity: 1,
      },
    ],
    metadata: { ...input.metadata, orderReference: input.orderReference },
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  })

  if (!session.url) {
    throw new Error("Stripe did not return a URL for this checkout session")
  }

  return { sessionId: session.id, url: session.url }
}

export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient()
  return stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] })
}

// Normalizes a Stripe PaymentIntent into the exact same shape CyberSource's
// updatePayment() already returns, so everything downstream (storeVerifiedPayment,
// /api/checkout/complete, the confirmation email) works unmodified regardless of
// which gateway actually charged the card.
export function toUpdatePaymentResponse(
  intent: Stripe.PaymentIntent,
  expectedOrderReference: string
): UpdatePaymentResponse {
  const paymentMethod =
    typeof intent.payment_method === "object" && intent.payment_method !== null
      ? intent.payment_method
      : null
  const billingDetails = paymentMethod?.billing_details

  return {
    amount: {
      authorized: fromStripeAmount(intent.amount),
      total: fromStripeAmount(intent.amount),
      currency: intent.currency?.toUpperCase(),
    },
    billingAddress: billingDetails
      ? {
          address1: billingDetails.address?.line1 ?? undefined,
          address2: billingDetails.address?.line2 ?? undefined,
          administrativeArea: billingDetails.address?.state ?? undefined,
          country: billingDetails.address?.country ?? undefined,
          email: billingDetails.email ?? undefined,
          firstName: billingDetails.name ?? undefined,
          locality: billingDetails.address?.city ?? undefined,
          phoneNumber: billingDetails.phone ?? undefined,
          postalCode: billingDetails.address?.postal_code ?? undefined,
        }
      : undefined,
    errorReason: intent.last_payment_error?.message ?? null,
    orderReference: intent.metadata?.orderReference ?? expectedOrderReference,
    status: intent.status === "succeeded" ? "AUTHORIZED" : intent.status.toUpperCase(),
    submitTimeUtc: new Date(intent.created * 1000).toISOString(),
    transactionId: intent.id,
  }
}

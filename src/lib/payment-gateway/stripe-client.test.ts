import type Stripe from "stripe"

import { it, expect, describe } from "vitest"

import { toUpdatePaymentResponse } from "./stripe-client"

function makeIntent(overrides: Partial<Stripe.PaymentIntent> = {}): Stripe.PaymentIntent {
  return {
    id: "pi_123",
    amount: 182800,
    currency: "sgd",
    status: "succeeded",
    created: 1785600000,
    metadata: { orderReference: "CONF-20260801-093000-A1B2" },
    last_payment_error: null,
    payment_method: null,
    ...overrides,
  } as unknown as Stripe.PaymentIntent
}

describe("toUpdatePaymentResponse", () => {
  it("maps a succeeded PaymentIntent to an AUTHORIZED payment", () => {
    const result = toUpdatePaymentResponse(makeIntent(), "CONF-20260801-093000-A1B2")

    expect(result.status).toBe("AUTHORIZED")
    expect(result.transactionId).toBe("pi_123")
    expect(result.orderReference).toBe("CONF-20260801-093000-A1B2")
    expect(result.amount?.total).toBe("1828.00")
    expect(result.amount?.currency).toBe("SGD")
  })

  it("maps a non-succeeded status to its uppercased Stripe status, not AUTHORIZED", () => {
    const result = toUpdatePaymentResponse(
      makeIntent({
        status: "requires_payment_method",
        last_payment_error: { message: "Your card was declined." } as Stripe.PaymentIntent["last_payment_error"],
      }),
      "CONF-20260801-093000-A1B2"
    )

    expect(result.status).not.toBe("AUTHORIZED")
    expect(result.status).toBe("REQUIRES_PAYMENT_METHOD")
    expect(result.errorReason).toBe("Your card was declined.")
  })

  it("extracts billing details when payment_method is expanded", () => {
    const result = toUpdatePaymentResponse(
      makeIntent({
        payment_method: {
          billing_details: {
            email: "jane.tan@example.com",
            name: "Jane Tan",
            phone: "91234567",
            address: {
              line1: "123 Tampines Street 42",
              line2: null,
              city: null,
              state: null,
              postal_code: "521123",
              country: "SG",
            },
          },
        } as unknown as Stripe.PaymentIntent["payment_method"],
      }),
      "CONF-20260801-093000-A1B2"
    )

    expect(result.billingAddress?.email).toBe("jane.tan@example.com")
    expect(result.billingAddress?.postalCode).toBe("521123")
    expect(result.billingAddress?.country).toBe("SG")
  })

  it("falls back to the expected order reference when metadata is missing it", () => {
    const result = toUpdatePaymentResponse(makeIntent({ metadata: {} }), "CONF-FALLBACK")

    expect(result.orderReference).toBe("CONF-FALLBACK")
  })
})

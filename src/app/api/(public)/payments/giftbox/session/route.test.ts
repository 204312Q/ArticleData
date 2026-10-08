import type { NextRequest } from "next/server"

import { it, vi, expect, describe, afterEach, beforeEach } from "vitest"

vi.mock("@/lib/guard/assert", () => ({
  assertRequestGuards: vi.fn(),
}))
vi.mock("@/lib/payment-gateway-mode", () => ({
  paymentGateway: vi.fn(),
}))
vi.mock("@/lib/payment-gateway/stripe-client", () => ({
  createCheckoutSession: vi.fn(),
}))
vi.mock("@/lib/payment-gateway/capture-context", () => ({
  buildCaptureContextPayload: vi.fn((input: unknown) => input),
}))
vi.mock("@/lib/payment-gateway/client", () => ({
  PaymentGatewayError: class PaymentGatewayError extends Error {},
  generateCaptureContext: vi.fn(),
}))
vi.mock("src/sections/baby-full-month-gift-set/baby-full-month-gift-set-catalog", () => ({
  getGiftSetProducts: vi.fn(),
}))

import { assertRequestGuards } from "@/lib/guard/assert"
import { paymentGateway } from "@/lib/payment-gateway-mode"
import { generateCaptureContext } from "@/lib/payment-gateway/client"
import { createCheckoutSession } from "@/lib/payment-gateway/stripe-client"

import { getGiftSetProducts } from "src/sections/baby-full-month-gift-set/baby-full-month-gift-set-catalog"

import { POST } from "./route"

const DRAFT_ID = "GIFT-20260801-093000-XYZ1"

// Matches makeDraft()'s items[].itemNo/price below — the pricing
// verification (verify-order-pricing.ts) resolves this instead of trusting
// the request's own `amount`/draft numbers.
const GIFT_SET_PRODUCTS = [
  { id: "baby-bliss-a", bcNumber: "CFM-GFT-0001", price: 196.2 },
] as unknown as Awaited<ReturnType<typeof getGiftSetProducts>>

function makeDraft(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    draftId: DRAFT_ID,
    items: [
      {
        productId: "baby-bliss-a",
        productName: "Baby Bliss Kebaya Set",
        itemNo: "CFM-GFT-0001",
        quantity: 1,
        unitPrice: 196.2,
        lineTotal: 196.2,
      },
    ],
    delivery: {
      fullName: "Jane Tan",
      phone: "91234567",
      email: "customer@example.com",
      address: "123 Example Ave",
      floor: "",
      unit: "",
      postalCode: "123456",
      deliveryDate: "2026-09-01",
    },
    pricing: {
      subtotal: 196.2,
      promoCode: null,
      promoDiscount: 0,
      gstAmount: 16.2,
      total: 196.2,
      shippingMethod: "STANDARD",
      shippingAmount: 20,
    },
    ...overrides,
  }
}

function makeBody(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    // total (196.20) + shipping (20) — the amount actually charged, per
    // baby-full-month-gift-set-checkout-view.tsx.
    amount: "216.20",
    currency: "SGD",
    customer: { email: "customer@example.com", phoneNumber: "91234567" },
    draft: makeDraft(),
    orderReference: DRAFT_ID,
    ...overrides,
  }
}

function makeRequest(body: unknown): NextRequest {
  const url = "https://localhost/api/payments/giftbox/session"
  const request = new Request(url, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  })

  // A plain Request has no `.nextUrl` (that's a NextRequest-only property) —
  // the route reads request.nextUrl.origin, so it needs one here too.
  return Object.assign(request, { nextUrl: new URL(url) }) as unknown as NextRequest
}

describe("POST /api/payments/giftbox/session", () => {
  beforeEach(() => {
    vi.mocked(assertRequestGuards).mockResolvedValue(null)
    vi.mocked(getGiftSetProducts).mockResolvedValue(GIFT_SET_PRODUCTS)
    vi.mocked(paymentGateway).mockReturnValue("stripe")
    vi.mocked(createCheckoutSession).mockResolvedValue({
      sessionId: "sess_1",
      url: "https://checkout.stripe.com/sess_1",
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("creates a Stripe session when the requested amount matches total + shipping", async () => {
    const res = await POST(makeRequest(makeBody()))
    const json = (await res.json()) as { data: { gateway: string } }

    expect(res.status).toBe(200)
    expect(json.data.gateway).toBe("stripe")
    expect(createCheckoutSession).toHaveBeenCalledTimes(1)
  })

  it("returns 400 and never calls the gateway when the requested amount omits shipping", async () => {
    // A common way to under-charge: forget to add the $20 shipping fee.
    const res = await POST(makeRequest(makeBody({ amount: "196.20" })))
    const json = (await res.json()) as { message: string }

    expect(res.status).toBe(400)
    expect(json.message).toMatch(/requested amount/i)
    expect(createCheckoutSession).not.toHaveBeenCalled()
  })

  it("also blocks the CyberSource path on a mismatched amount", async () => {
    vi.mocked(paymentGateway).mockReturnValue("cybersource")

    const res = await POST(makeRequest(makeBody({ amount: "0.01" })))

    expect(res.status).toBe(400)
    expect(generateCaptureContext).not.toHaveBeenCalled()
  })

  it("returns 400 and never calls the gateway when the item isn't in the gift set catalog", async () => {
    vi.mocked(getGiftSetProducts).mockResolvedValue(
      [] as unknown as Awaited<ReturnType<typeof getGiftSetProducts>>
    )

    const res = await POST(makeRequest(makeBody()))

    expect(res.status).toBe(400)
    expect(createCheckoutSession).not.toHaveBeenCalled()
  })
})

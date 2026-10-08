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
vi.mock("src/sections/product/product-catalog", () => ({
  getProductCatalog: vi.fn(),
}))

import { assertRequestGuards } from "@/lib/guard/assert"
import { paymentGateway } from "@/lib/payment-gateway-mode"
import { generateCaptureContext } from "@/lib/payment-gateway/client"
import { createCheckoutSession } from "@/lib/payment-gateway/stripe-client"

import { getProductCatalog } from "src/sections/product/product-catalog"

import { POST } from "./route"

const DRAFT_ID = "DRAFT-456"

// Matches makeDraft()'s packageSelection.itemNo/pricing below — the pricing
// verification (verify-order-pricing.ts) resolves this instead of trusting
// the request's own `amount`/draft numbers.
const CATALOG = {
  packageCategories: [
    {
      id: "cat-1",
      options: [{ id: "dual-28", bcNumber: "CFM-PCP-001", price: 100, bundles: [] }],
    },
  ],
  addOnGroups: [],
} as unknown as Awaited<ReturnType<typeof getProductCatalog>>

function makeDraft(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    addOns: [],
    bundles: [],
    delivery: {
      address: "1 Test Road",
      email: "customer@example.com",
      floor: "",
      fullName: "Test Customer",
      paymentMethod: "full",
      paymentType: "credit-card",
      phone: "91234567",
      postalCode: "123456",
      unit: "",
    },
    draftId: DRAFT_ID,
    packageSelection: {
      categoryId: "cat-1",
      categoryName: "Confinement",
      durationDays: 28,
      itemNo: "CFM-PCP-001",
      optionId: "dual-28",
      optionLabel: "Dual 28 Days",
      selectedDate: "2026-08-01",
      selectedDateType: "confirmed",
      startWith: "lunch",
    },
    pricing: {
      balance: 0,
      deposit: 0,
      gstAmount: 8.26,
      promoCode: null,
      promoDiscount: 0,
      subtotal: 100,
      total: 100,
    },
    specialRequests: { note: "", riceOption: "NO_PREF", selected: [] },
    summary: { categoryName: "Confinement", optionLabel: "Dual 28 Days", totalLabel: "$100.00" },
    ...overrides,
  }
}

function makeBody(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    amount: "100.00",
    currency: "SGD",
    customer: { email: "customer@example.com", phoneNumber: "91234567" },
    draft: makeDraft(),
    orderReference: DRAFT_ID,
    ...overrides,
  }
}

function makeRequest(body: unknown): NextRequest {
  const url = "https://localhost/api/payments/session"
  const request = new Request(url, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  })

  // A plain Request has no `.nextUrl` (that's a NextRequest-only property) —
  // the route reads request.nextUrl.origin, so it needs one here too.
  return Object.assign(request, { nextUrl: new URL(url) }) as unknown as NextRequest
}

describe("POST /api/payments/session", () => {
  beforeEach(() => {
    vi.mocked(assertRequestGuards).mockResolvedValue(null)
    vi.mocked(getProductCatalog).mockResolvedValue(CATALOG)
    vi.mocked(paymentGateway).mockReturnValue("stripe")
    vi.mocked(createCheckoutSession).mockResolvedValue({
      sessionId: "sess_1",
      url: "https://checkout.stripe.com/sess_1",
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("creates a Stripe session when the requested amount matches the draft's recomputed total", async () => {
    const res = await POST(makeRequest(makeBody()))
    const json = (await res.json()) as { data: { gateway: string } }

    expect(res.status).toBe(200)
    expect(json.data.gateway).toBe("stripe")
    expect(createCheckoutSession).toHaveBeenCalledTimes(1)
  })

  it("returns 400 and never calls the gateway when the requested amount doesn't match the draft", async () => {
    // Card would be charged $0.01 while the draft still claims a $100 package.
    const res = await POST(makeRequest(makeBody({ amount: "0.01" })))
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

  it("returns 400 and never calls the gateway when the package itemNo isn't in the catalog", async () => {
    vi.mocked(getProductCatalog).mockResolvedValue({
      packageCategories: [],
      addOnGroups: [],
    } as unknown as Awaited<ReturnType<typeof getProductCatalog>>)

    const res = await POST(makeRequest(makeBody()))

    expect(res.status).toBe(400)
    expect(createCheckoutSession).not.toHaveBeenCalled()
  })
})

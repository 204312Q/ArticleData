import type { NextRequest } from "next/server"
import type { CTBPayment } from "@/lib/ct-backend/client"

import { it, vi, expect, describe, afterEach, beforeEach } from "vitest"

vi.mock("@/lib/guard/assert", () => ({
  assertRequestGuards: vi.fn(),
}))
vi.mock("@/lib/checkout/complete-order", () => ({
  completeCheckoutOrder: vi.fn(),
}))
vi.mock("@/lib/payment-transactions", () => ({
  getPaymentTransactionByOrderReference: vi.fn(),
}))
vi.mock("@/lib/ct-backend/client", () => ({
  CTBackendError: class CTBackendError extends Error {},
  getCTBPayment: vi.fn(),
  validateCTBPromo: vi.fn(),
}))
vi.mock("@/lib/email/graphMailer", () => ({
  sendMail: vi.fn(),
}))
vi.mock("src/sections/baby-full-month-gift-set/baby-full-month-gift-set-catalog", () => ({
  getGiftSetProducts: vi.fn(),
}))

import { sendMail } from "@/lib/email/graphMailer"
import { getCTBPayment } from "@/lib/ct-backend/client"
import { assertRequestGuards } from "@/lib/guard/assert"
import { completeCheckoutOrder } from "@/lib/checkout/complete-order"

import { getGiftSetProducts } from "src/sections/baby-full-month-gift-set/baby-full-month-gift-set-catalog"

import { POST } from "./route"

const DRAFT_ID = "GIFT-20260801-093000-A1B2"

// Matches makeBody()'s items[].itemNo/price below — the pricing verification
// (verify-order-pricing.ts) resolves this instead of trusting the draft's
// own numbers.
const GIFT_SET_PRODUCTS = [
  { id: "baby-bliss-a", bcNumber: "CFM-GFT-0001", price: 196.2 },
] as unknown as Awaited<ReturnType<typeof getGiftSetProducts>>

// total (196.20) + shipping (20) — the amount actually charged via
// /api/payments/giftbox/session, per baby-full-month-gift-set-checkout-view.tsx.
const CTB_PAID_PAYMENT = {
  amount: "216.20",
  createdAt: "2026-01-01T00:00:00.000Z",
  currency: "SGD",
  customerEmail: "customer@example.com",
  id: "CTB-PT-1",
  method: "Credit Card",
  orderId: null,
  orderNo: null,
  orderReference: DRAFT_ID,
  reconciliationId: null,
  status: "PAID",
  transactionId: "TXN-1",
} satisfies CTBPayment

function makeBody(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    draft: {
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
    },
    orderReference: DRAFT_ID,
    ...overrides,
  }
}

function makeRequest(body: unknown): NextRequest {
  return new Request("https://localhost/api/checkout/giftbox/complete", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  }) as unknown as NextRequest
}

describe("POST /api/checkout/giftbox/complete", () => {
  beforeEach(() => {
    vi.mocked(assertRequestGuards).mockResolvedValue(null)
    vi.mocked(completeCheckoutOrder).mockResolvedValue(
      { orderNo: "WEB-2026-00001" } as unknown as Awaited<ReturnType<typeof completeCheckoutOrder>>
    )
    vi.mocked(getGiftSetProducts).mockResolvedValue(GIFT_SET_PRODUCTS)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it("reuses the payment recorded in CT Backend and creates the order (never re-charges)", async () => {
    vi.mocked(getCTBPayment).mockResolvedValue(CTB_PAID_PAYMENT)

    const res = await POST(makeRequest(makeBody()))

    expect(res.status).toBe(201)
    expect(getCTBPayment).toHaveBeenCalledWith(DRAFT_ID)
    expect(completeCheckoutOrder).toHaveBeenCalledTimes(1)
    expect(completeCheckoutOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        draft: expect.objectContaining({ addOns: expect.arrayContaining([expect.objectContaining({ itemNo: "CFM-GFT-0001" })]) }),
        payment: expect.objectContaining({ paymentStatus: "PAID", paymentTransactionId: "CTB-PT-1" }),
      })
    )
  })

  it("returns the existing order without re-verifying pricing when the webhook backstop already created it", async () => {
    vi.mocked(getCTBPayment).mockResolvedValue({ ...CTB_PAID_PAYMENT, orderNo: "WEB-2026-00001" })

    const res = await POST(makeRequest(makeBody()))
    const json = (await res.json()) as { data: { orderNo: string } }

    expect(res.status).toBe(201)
    expect(json.data.orderNo).toBe("WEB-2026-00001")
    expect(getGiftSetProducts).not.toHaveBeenCalled()
    expect(completeCheckoutOrder).not.toHaveBeenCalled()
    expect(sendMail).not.toHaveBeenCalled()
  })

  it("skips the confirmation email when the order already existed (duplicate)", async () => {
    vi.mocked(getCTBPayment).mockResolvedValue(CTB_PAID_PAYMENT)
    vi.mocked(completeCheckoutOrder).mockResolvedValue(
      { duplicate: true, orderNo: "WEB-2026-00001" } as unknown as Awaited<ReturnType<typeof completeCheckoutOrder>>
    )

    const res = await POST(makeRequest(makeBody()))

    expect(res.status).toBe(201)
    expect(sendMail).not.toHaveBeenCalled()
  })

  it("returns 409 and creates no order when CT Backend has no payment", async () => {
    vi.mocked(getCTBPayment).mockResolvedValue(null)

    const res = await POST(makeRequest(makeBody()))
    const json = (await res.json()) as { message: string }

    expect(res.status).toBe(409)
    expect(json.message).toMatch(/no payment found/i)
    expect(completeCheckoutOrder).not.toHaveBeenCalled()
  })

  it("returns 409 and creates no order when the payment is not PAID", async () => {
    vi.mocked(getCTBPayment).mockResolvedValue({ ...CTB_PAID_PAYMENT, status: "PENDING" })

    const res = await POST(makeRequest(makeBody()))

    expect(res.status).toBe(409)
    expect(completeCheckoutOrder).not.toHaveBeenCalled()
  })

  it("returns 409 and creates no order when the charged amount doesn't match the order total", async () => {
    // Card was only charged $0.01, but the draft still claims a $196.20 item.
    vi.mocked(getCTBPayment).mockResolvedValue({ ...CTB_PAID_PAYMENT, amount: "0.01" })

    const res = await POST(makeRequest(makeBody()))
    const json = (await res.json()) as { message: string }

    expect(res.status).toBe(409)
    expect(json.message).toMatch(/charged amount/i)
    expect(completeCheckoutOrder).not.toHaveBeenCalled()
  })

  it("returns 409 and creates no order when the item isn't in the gift set catalog", async () => {
    vi.mocked(getCTBPayment).mockResolvedValue(CTB_PAID_PAYMENT)
    vi.mocked(getGiftSetProducts).mockResolvedValue(
      [] as unknown as Awaited<ReturnType<typeof getGiftSetProducts>>
    )

    const res = await POST(makeRequest(makeBody()))

    expect(res.status).toBe(409)
    expect(completeCheckoutOrder).not.toHaveBeenCalled()
  })

  it("returns 501 and never looks up the payment when ORDER_BACKEND=bc", async () => {
    vi.stubEnv("ORDER_BACKEND", "bc")

    const res = await POST(makeRequest(makeBody()))

    expect(res.status).toBe(501)
    expect(getCTBPayment).not.toHaveBeenCalled()
    expect(completeCheckoutOrder).not.toHaveBeenCalled()
  })

  it("returns 400 when orderReference does not match draftId", async () => {
    const res = await POST(makeRequest(makeBody({ orderReference: "OTHER" })))

    expect(res.status).toBe(400)
    expect(getCTBPayment).not.toHaveBeenCalled()
    expect(completeCheckoutOrder).not.toHaveBeenCalled()
  })
})

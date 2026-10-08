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
vi.mock("src/sections/product/product-catalog", () => ({
  getProductCatalog: vi.fn(),
}))

import { sendMail } from "@/lib/email/graphMailer"
import { getCTBPayment } from "@/lib/ct-backend/client"
import { assertRequestGuards } from "@/lib/guard/assert"
import { completeCheckoutOrder } from "@/lib/checkout/complete-order"
import { getPaymentTransactionByOrderReference } from "@/lib/payment-transactions"

import { getProductCatalog } from "src/sections/product/product-catalog"

import { POST } from "./route"

// Matches makeBody()'s packageSelection.itemNo/pricing below — the pricing
// verification (verify-order-pricing.ts) resolves this instead of trusting
// the draft's own numbers.
const CATALOG = {
  packageCategories: [
    {
      id: "cat-1",
      options: [{ id: "dual-28", bcNumber: "CFM-PCP-001", price: 100, bundles: [] }],
    },
  ],
  addOnGroups: [],
} as unknown as Awaited<ReturnType<typeof getProductCatalog>>

const DRAFT_ID = "DRAFT-123"

const AUTHORIZED_PAYMENT = {
  amount: "100.00",
  currency: "SGD",
  orderNo: null,
  orderReference: DRAFT_ID,
  paymentStatus: "AUTHORIZED",
  paymentTransactionId: "PT-1",
  transactionId: "TXN-1",
}

const CTB_PAID_PAYMENT = {
  amount: "100.00",
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
    },
    orderReference: DRAFT_ID,
    ...overrides,
  }
}

function makeRequest(body: unknown): NextRequest {
  return new Request("https://localhost/api/checkout/complete", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  }) as unknown as NextRequest
}

describe("POST /api/checkout/complete", () => {
  beforeEach(() => {
    vi.mocked(assertRequestGuards).mockResolvedValue(null)
    vi.mocked(completeCheckoutOrder).mockResolvedValue(
      { orderNo: "WEB-2026-00001" } as unknown as Awaited<ReturnType<typeof completeCheckoutOrder>>
    )
    vi.mocked(getProductCatalog).mockResolvedValue(CATALOG)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  describe("CT Backend mode (default)", () => {
    it("reuses the payment recorded in CT Backend and creates the order (never re-charges)", async () => {
      vi.mocked(getCTBPayment).mockResolvedValue(CTB_PAID_PAYMENT)

      const res = await POST(makeRequest(makeBody()))

      expect(res.status).toBe(201)
      // proof it does NOT charge again: it looks the payment up instead
      expect(getCTBPayment).toHaveBeenCalledWith(DRAFT_ID)
      // dev_confinement is untouched in CT Backend mode
      expect(getPaymentTransactionByOrderReference).not.toHaveBeenCalled()
      expect(completeCheckoutOrder).toHaveBeenCalledTimes(1)
      expect(completeCheckoutOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          payment: expect.objectContaining({
            paymentStatus: "PAID",
            paymentTransactionId: "CTB-PT-1",
            transactionId: "TXN-1",
          }),
        })
      )
    })

    it("returns the existing order without re-verifying pricing when the webhook backstop already created it", async () => {
      // Stripe's webhook can race ahead of this browser-driven call and
      // create the order first (see payments/webhook/route.ts) — the
      // payment record it left behind already carries the resulting orderNo.
      vi.mocked(getCTBPayment).mockResolvedValue({ ...CTB_PAID_PAYMENT, orderNo: "WEB-2026-00001" })

      const res = await POST(makeRequest(makeBody()))
      const json = (await res.json()) as { data: { orderNo: string } }

      expect(res.status).toBe(201)
      expect(json.data.orderNo).toBe("WEB-2026-00001")
      // Never re-derives pricing/promo state for an order that already exists.
      expect(getProductCatalog).not.toHaveBeenCalled()
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
      // Card was only charged $0.01, but the draft still claims a $100 order.
      vi.mocked(getCTBPayment).mockResolvedValue({ ...CTB_PAID_PAYMENT, amount: "0.01" })

      const res = await POST(makeRequest(makeBody()))
      const json = (await res.json()) as { message: string }

      expect(res.status).toBe(409)
      expect(json.message).toMatch(/charged amount/i)
      expect(completeCheckoutOrder).not.toHaveBeenCalled()
    })

    it("returns 409 and creates no order when the package itemNo isn't in the catalog", async () => {
      vi.mocked(getCTBPayment).mockResolvedValue(CTB_PAID_PAYMENT)
      vi.mocked(getProductCatalog).mockResolvedValue({
        packageCategories: [],
        addOnGroups: [],
      } as unknown as Awaited<ReturnType<typeof getProductCatalog>>)

      const res = await POST(makeRequest(makeBody()))

      expect(res.status).toBe(409)
      expect(completeCheckoutOrder).not.toHaveBeenCalled()
    })
  })

  describe("BC mode (ORDER_BACKEND=bc)", () => {
    beforeEach(() => {
      vi.stubEnv("ORDER_BACKEND", "bc")
    })

    it("reuses the locally recorded payment and creates the order", async () => {
      vi.mocked(getPaymentTransactionByOrderReference).mockResolvedValue(AUTHORIZED_PAYMENT)

      const res = await POST(makeRequest(makeBody()))

      expect(res.status).toBe(201)
      expect(getPaymentTransactionByOrderReference).toHaveBeenCalledWith(DRAFT_ID)
      expect(getCTBPayment).not.toHaveBeenCalled()
      expect(completeCheckoutOrder).toHaveBeenCalledWith(
        expect.objectContaining({ payment: AUTHORIZED_PAYMENT })
      )
    })

    it("returns 409 and creates no order when the payment is not AUTHORIZED", async () => {
      vi.mocked(getPaymentTransactionByOrderReference).mockResolvedValue({
        ...AUTHORIZED_PAYMENT,
        paymentStatus: "DECLINED",
      })

      const res = await POST(makeRequest(makeBody()))

      expect(res.status).toBe(409)
      expect(completeCheckoutOrder).not.toHaveBeenCalled()
    })
  })

  it("returns 400 when orderReference does not match draftId", async () => {
    const res = await POST(makeRequest(makeBody({ orderReference: "OTHER" })))

    expect(res.status).toBe(400)
    expect(getCTBPayment).not.toHaveBeenCalled()
    expect(getPaymentTransactionByOrderReference).not.toHaveBeenCalled()
    expect(completeCheckoutOrder).not.toHaveBeenCalled()
  })
})

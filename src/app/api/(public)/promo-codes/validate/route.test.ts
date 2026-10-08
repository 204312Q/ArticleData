import type { NextRequest } from "next/server"

import { it, vi, expect, describe, afterEach, beforeEach } from "vitest"

vi.mock("@/lib/guard/assert", () => ({
  assertRequestGuards: vi.fn(),
}))
vi.mock("@/lib/bcClient", () => ({
  BCRequestError: class BCRequestError extends Error {},
  getCPNRPromoCode: vi.fn(),
}))
vi.mock("@/lib/ct-backend/client", () => ({
  CTBackendError: class CTBackendError extends Error {},
  validateCTBPromo: vi.fn(),
}))

import { getCPNRPromoCode } from "@/lib/bcClient"
import { assertRequestGuards } from "@/lib/guard/assert"
import { validateCTBPromo } from "@/lib/ct-backend/client"

import { POST } from "./route"

function makeRequest(body: unknown): NextRequest {
  return new Request("https://localhost/api/promo-codes/validate", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  }) as unknown as NextRequest
}

const CART_LINES = [
  { lineAmount: 1378, productNo: "CFM-PCP-001" },
  { lineAmount: 42, productNo: "CFM-ADN-001" },
]

describe("POST /api/promo-codes/validate", () => {
  beforeEach(() => {
    vi.mocked(assertRequestGuards).mockResolvedValue(null)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  describe("CT Backend mode (default)", () => {
    it("forwards the cart lines and maps the server-computed discount into meta", async () => {
      vi.mocked(validateCTBPromo).mockResolvedValue({
        appliedToProductNos: ["CFM-PCP-001"],
        code: "CPCTMA19094",
        discountAmount: 100,
        discountType: "PERCENT",
        discountValue: 10,
        eligibleSubtotal: 1378,
        scope: "SPECIFIC_ITEMS",
        valid: true,
      })

      const res = await POST(
        makeRequest({ code: "cpctma19094", customerEmail: "a@b.com", lines: CART_LINES, subtotal: 1420 })
      )
      const json = (await res.json()) as Record<string, unknown>

      expect(res.status).toBe(200)
      expect(getCPNRPromoCode).not.toHaveBeenCalled()
      expect(validateCTBPromo).toHaveBeenCalledWith({
        code: "CPCTMA19094",
        customerEmail: "a@b.com",
        lines: CART_LINES,
      })
      // Meta mapped as a fixed Amount equal to the server-computed discount, so
      // the storefront's local recompute always matches the server value.
      expect(json.valid).toBe(true)
      expect(json.discountType).toBe("Amount")
      expect(json.discountValue).toBe(100)
      expect(json.discountAmount).toBe(100)
      expect(json.maxCap).toBeNull()
    })

    it("returns valid=false with the backend reason for rejected codes", async () => {
      vi.mocked(validateCTBPromo).mockResolvedValue({
        reason: "Promo does not apply to any item in your cart",
        valid: false,
      })

      const res = await POST(makeRequest({ code: "SCOPED1", lines: CART_LINES }))
      const json = (await res.json()) as Record<string, unknown>

      expect(res.status).toBe(200)
      expect(json.valid).toBe(false)
      expect(json.reason).toMatch(/does not apply/i)
    })

    it("falls back to a single subtotal line when no lines are sent", async () => {
      vi.mocked(validateCTBPromo).mockResolvedValue({
        reason: "Promo code not found",
        valid: false,
      })

      await POST(makeRequest({ code: "ABC", subtotal: 500 }))

      expect(validateCTBPromo).toHaveBeenCalledWith({
        code: "ABC",
        customerEmail: undefined,
        lines: [{ lineAmount: 500 }],
      })
    })
  })

  describe("BC mode (ORDER_BACKEND=bc)", () => {
    beforeEach(() => {
      vi.stubEnv("ORDER_BACKEND", "bc")
    })

    it("validates against Business Central and keeps the original meta shape", async () => {
      vi.mocked(getCPNRPromoCode).mockResolvedValue({
        blocked: false,
        code: "BC10",
        description: "10% off",
        discountType: "Percent",
        discountValue: 10,
        maxCap: 50,
        minSpend: 0,
      } as unknown as Awaited<ReturnType<typeof getCPNRPromoCode>>)

      const res = await POST(makeRequest({ code: "bc10", lines: CART_LINES, subtotal: 1420 }))
      const json = (await res.json()) as Record<string, unknown>

      expect(res.status).toBe(200)
      expect(validateCTBPromo).not.toHaveBeenCalled()
      expect(getCPNRPromoCode).toHaveBeenCalledWith("BC10")
      expect(json.valid).toBe(true)
      expect(json.discountType).toBe("Percent")
      expect(json.discountAmount).toBe(50) // 10% of 1420 capped at 50
    })
  })

  it("returns 400 when code is missing", async () => {
    const res = await POST(makeRequest({ lines: CART_LINES }))

    expect(res.status).toBe(400)
    expect(validateCTBPromo).not.toHaveBeenCalled()
    expect(getCPNRPromoCode).not.toHaveBeenCalled()
  })
})

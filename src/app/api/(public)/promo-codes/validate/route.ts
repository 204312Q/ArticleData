import type { NextRequest } from "next/server"
import type { CTBPromoLine } from "@/lib/ct-backend/client"

import { orderBackend } from "@/lib/order-backend"
import { assertRequestGuards } from "@/lib/guard/assert"
import { firstZodErrorMessage } from "@/lib/api-response"
import { BCRequestError, getCPNRPromoCode } from "@/lib/bcClient"
import { CTBackendError, validateCTBPromo } from "@/lib/ct-backend/client"

import { validatePromoBodySchema } from "./schema"

export const runtime = "nodejs"

function calculateDiscount(
  discountType: "Amount" | "Percent",
  discountValue: number,
  subtotal: number,
  maxCap: number,
): number {
  if (discountType === "Amount") {
    return maxCap > 0 ? Math.min(discountValue, maxCap) : discountValue
  }
  const raw = (subtotal * discountValue) / 100
  return maxCap > 0 ? Math.min(raw, maxCap) : raw
}

// ----------------------------------------------------------------------
// BC validation (original flow) — kept intact behind the ORDER_BACKEND flag.
async function validateAgainstBC(code: string, subtotal: number): Promise<Response> {
  try {
    const promo = await getCPNRPromoCode(code)

    if (!promo) {
      return Response.json({ valid: false, reason: "Promo code not found." }, { status: 404 })
    }

    if (promo.blocked) {
      return Response.json({ valid: false, reason: "This promo code is no longer active." }, { status: 422 })
    }

    const now = new Date()

    if (promo.startTime && new Date(promo.startTime) > now) {
      return Response.json({ valid: false, reason: "This promo code is not yet active." }, { status: 422 })
    }

    if (promo.endTime && new Date(promo.endTime) < now) {
      return Response.json({ valid: false, reason: "This promo code has expired." }, { status: 422 })
    }

    const maxUses = promo.maxUses ?? 0
    const usageCount = promo.usageCount ?? 0
    if (maxUses > 0 && usageCount >= maxUses) {
      return Response.json({ valid: false, reason: "This promo code has reached its usage limit." }, { status: 422 })
    }

    const minSpend = promo.minSpend ?? 0
    if (subtotal < minSpend) {
      return Response.json(
        {
          valid: false,
          reason: `Minimum order amount of ${minSpend.toFixed(2)} required for this promo code.`,
          minSpend,
        },
        { status: 422 },
      )
    }

    const discountType = promo.discountType ?? "Amount"
    const discountValue = promo.discountValue ?? 0
    const maxCap = promo.maxCap ?? 0
    const discountAmount = calculateDiscount(discountType, discountValue, subtotal, maxCap)

    return Response.json({
      valid: true,
      code: promo.code,
      description: promo.description,
      discountType,
      discountValue,
      maxCap: maxCap > 0 ? maxCap : null,
      minSpend: minSpend > 0 ? minSpend : null,
      itemCategoryCode: promo.itemCategoryCode,
      discountAmount: Math.round(discountAmount * 100) / 100,
    })
  } catch (error) {
    if (error instanceof BCRequestError) {
      return Response.json({ error: "BC request failed", status: error.status }, { status: error.status })
    }
    const message = error instanceof Error ? error.message : "Failed to validate promo code"
    return Response.json({ error: message }, { status: 500 })
  }
}

// ----------------------------------------------------------------------
// CT Backend validation (default) — authoritative, scope-aware. The server
// computes the discount against the eligible cart lines; the response maps it
// into the meta shape the storefront already reads, as a fixed Amount so the
// client's local recompute (min(amount, subtotal)) always equals the server
// value. The storefront re-validates whenever the cart changes, which keeps
// item-scoped discounts fresh.
async function validateAgainstCTB(options: {
  code: string
  customerEmail?: string
  customerPhone?: string
  lines: CTBPromoLine[]
}): Promise<Response> {
  try {
    const result = await validateCTBPromo(options)

    if (!result.valid) {
      return Response.json({ valid: false, reason: result.reason })
    }

    return Response.json({
      valid: true,
      code: result.code,
      discountType: "Amount",
      discountValue: result.discountAmount,
      maxCap: null,
      minSpend: null,
      discountAmount: result.discountAmount,
      scope: result.scope,
      appliedToProductNos: result.appliedToProductNos,
      eligibleSubtotal: result.eligibleSubtotal,
    })
  } catch (error) {
    if (error instanceof CTBackendError) {
      console.error("[promo-codes/validate] CT Backend error", {
        message: error.message,
        status: error.status,
      })
      return Response.json({ error: "Failed to validate promo code" }, { status: 502 })
    }
    const message = error instanceof Error ? error.message : "Failed to validate promo code"
    return Response.json({ error: message }, { status: 500 })
  }
}

// ----------------------------------------------------------------------
// POST — storefront promo check with cart lines (item-scoped promos work).
export async function POST(request: NextRequest): Promise<Response> {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Request Param Invalid" }, { status: 400 })
  }

  const parsed = validatePromoBodySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: firstZodErrorMessage(parsed.error) }, { status: 400 })
  }

  // Passed through exactly as the customer typed it — CT Backend matches promo
  // codes case-sensitively, and some are mixed case (MummiesClub10).
  const code = parsed.data.code
  const lines =
    parsed.data.lines && parsed.data.lines.length > 0
      ? parsed.data.lines
      : [{ lineAmount: parsed.data.subtotal ?? 0 }]
  const subtotal = parsed.data.subtotal ?? lines.reduce((sum, line) => sum + line.lineAmount, 0)

  if (orderBackend() === "bc") {
    return validateAgainstBC(code, subtotal)
  }

  return validateAgainstCTB({
    code,
    customerEmail: parsed.data.customerEmail,
    customerPhone: parsed.data.customerPhone,
    lines,
  })
}

// ----------------------------------------------------------------------
// GET — legacy query-param check (code + subtotal only). Kept for older
// clients; item-scoped promos need the POST body with cart lines.
export async function GET(request: NextRequest): Promise<Response> {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  const { searchParams } = new URL(request.url)
  // Case preserved, same as POST — promo codes are matched exactly.
  const code = searchParams.get("code")?.trim()
  const subtotalRaw = searchParams.get("subtotal")

  if (!code) {
    return Response.json({ error: "Missing required query parameter: code" }, { status: 400 })
  }

  const subtotal = subtotalRaw !== null ? Number(subtotalRaw) : 0
  if (subtotalRaw !== null && (!Number.isFinite(subtotal) || subtotal < 0)) {
    return Response.json({ error: "subtotal must be a non-negative number" }, { status: 400 })
  }

  if (orderBackend() === "bc") {
    return validateAgainstBC(code, subtotal)
  }

  return validateAgainstCTB({ code, lines: [{ lineAmount: subtotal }] })
}

import type { CheckoutDraft } from "./complete-order"

import { getCPNRPromoCode } from "@/lib/bcClient"
import { orderBackend } from "@/lib/order-backend"
import { validateCTBPromo, type CTBPromoLine } from "@/lib/ct-backend/client"

import { getProductCatalog } from "src/sections/product/product-catalog"
import { getGiftSetProducts } from "src/sections/baby-full-month-gift-set/baby-full-month-gift-set-catalog"

import { computeGiftboxShippingFee, computePackageShippingFee } from "./shipping-fee"

// ----------------------------------------------------------------------
// Server-side order pricing verification.
//
// draft.pricing.* (subtotal, promoDiscount, total, shippingAmount, deposit)
// and every line's `price` are client-submitted — /api/checkout/complete and
// /api/checkout/giftbox/complete otherwise trust them completely, and the
// amount actually charged (set at /api/payments/session, also client-
// submitted) is never checked against any of it. That means a caller can
// charge a card $0.01 and submit a full-price draft, or submit a
// self-consistent but fabricated cheap draft for a real, expensive item —
// nothing here currently stops either.
//
// This module recomputes the whole chain — subtotal from the live catalog by
// itemNo, promo discount from a fresh server-side check, shipping from the
// same pure fee functions the frontend uses — and compares the result to what
// was actually charged. Anything that doesn't reconcile fails closed: the
// order is not created. A catalog/promo lookup failure also fails closed
// (caught below), rather than silently letting an unverified order through.
//
// This is deliberately independent of /api/promo-codes/validate/route.ts —
// that route's response shape feeds the client's promo UI (discount type,
// cap, min-spend metadata) and changing it risks breaking that. The BC-mode
// promo rules below (blocked/expiry/usage/minSpend/discount calc) mirror that
// route's validateAgainstBC() intentionally; keep the two in sync if BC promo
// rules ever change.
// ----------------------------------------------------------------------

const TOLERANCE_SGD = 0.02

export type VerifyOrderPricingResult = { ok: true } | { ok: false; reason: string }

function isGiftboxDraft(draft: CheckoutDraft): boolean {
  // Same discriminator buildCTBOrderLines() already uses in complete-order.ts —
  // adaptGiftboxDraftToCheckoutDraft() is the only place selectedDateType is "delivery".
  return draft.packageSelection.selectedDateType === "delivery"
}

function mismatch(label: string, expected: number, actual: number): string {
  return `${label} does not match current pricing (expected $${expected.toFixed(2)}, got $${actual.toFixed(2)}). Please refresh and try again.`
}

// ----------------------------------------------------------------------
// Subtotal — recomputed from the live catalog by itemNo, never from the
// client's declared line prices.

type ResolvedLines = { subtotal: number; lines: CTBPromoLine[] }

async function resolveProductSubtotal(draft: CheckoutDraft): Promise<ResolvedLines> {
  const catalog = await getProductCatalog()
  const allOptions = catalog.packageCategories.flatMap((category) => category.options)
  const allBundles = allOptions.flatMap((option) => option.bundles ?? [])
  const allAddOns = catalog.addOnGroups.flatMap((group) => group.options)

  const packageOption = allOptions.find(
    (option) => option.bcNumber?.trim().toUpperCase() === draft.packageSelection.itemNo.trim().toUpperCase()
  )
  if (!packageOption) {
    throw new Error(`Package item "${draft.packageSelection.itemNo}" was not found in the catalog.`)
  }

  const lines: CTBPromoLine[] = [{ lineAmount: packageOption.price, productNo: packageOption.bcNumber }]
  let subtotal = packageOption.price

  for (const bundle of draft.bundles) {
    const match = allBundles.find(
      (candidate) => candidate.bcNumber?.trim().toUpperCase() === bundle.itemNo.trim().toUpperCase()
    )
    if (!match) {
      throw new Error(`Bundle item "${bundle.itemNo}" was not found in the catalog.`)
    }
    subtotal += match.price
    lines.push({ lineAmount: match.price, productNo: match.bcNumber })
  }

  // One option per add-on group is selected at most — no quantity multiplier
  // here, matching product-order-flow.tsx's own subtotal (selectedOption.price
  // + bundles + addOns, summed as-is). The `quantity` field on draft.addOns is
  // just the catalog option's "servings" label, not an order multiplier.
  for (const addOn of draft.addOns) {
    const match = allAddOns.find(
      (candidate) => candidate.bcNumber?.trim().toUpperCase() === addOn.itemNo.trim().toUpperCase()
    )
    if (!match) {
      throw new Error(`Add-on item "${addOn.itemNo}" was not found in the catalog.`)
    }
    subtotal += match.price
    lines.push({ lineAmount: match.price, productNo: match.bcNumber })
  }

  return { subtotal, lines }
}

async function resolveGiftboxSubtotal(draft: CheckoutDraft): Promise<ResolvedLines> {
  const products = await getGiftSetProducts()
  const priceByItemNo = new Map<string, number>()

  for (const product of products) {
    if (product.variants?.length) {
      for (const variant of product.variants) {
        if (variant.bcNumber) {
          priceByItemNo.set(variant.bcNumber.trim().toUpperCase(), variant.price ?? product.price)
        }
      }
    } else if (product.bcNumber) {
      priceByItemNo.set(product.bcNumber.trim().toUpperCase(), product.price)
    }
  }

  const lines: CTBPromoLine[] = []
  let subtotal = 0

  // Giftbox quantity IS a real order multiplier (how many of that item), per
  // adaptGiftboxDraftToCheckoutDraft() and the cart's own lineTotal calc.
  for (const item of draft.addOns) {
    const unitPrice = priceByItemNo.get(item.itemNo.trim().toUpperCase())
    if (unitPrice === undefined) {
      throw new Error(`Gift set item "${item.itemNo}" was not found in the catalog.`)
    }
    const lineAmount = Math.round(unitPrice * item.quantity * 100) / 100
    subtotal += lineAmount
    lines.push({ lineAmount, productNo: item.itemNo })
  }

  return { subtotal, lines }
}

// ----------------------------------------------------------------------
// Promo discount — re-checked against whichever backend is authoritative for
// promos right now, never trusted from the draft.

function calculateBcDiscount(
  discountType: "Amount" | "Percent",
  discountValue: number,
  subtotal: number,
  maxCap: number
): number {
  const raw = discountType === "Amount" ? discountValue : (subtotal * discountValue) / 100
  const capped = maxCap > 0 ? Math.min(raw, maxCap) : raw
  return Math.round(Math.min(capped, subtotal) * 100) / 100
}

async function resolveAuthoritativePromoDiscount(
  promoCode: string | null,
  subtotal: number,
  lines: CTBPromoLine[],
  customerEmail: string,
  customerPhone: string
): Promise<number> {
  if (!promoCode) {
    return 0
  }

  if (orderBackend() === "bc") {
    const promo = await getCPNRPromoCode(promoCode)
    if (!promo || promo.blocked) return 0

    const now = new Date()
    if (promo.startTime && new Date(promo.startTime) > now) return 0
    if (promo.endTime && new Date(promo.endTime) < now) return 0

    const maxUses = promo.maxUses ?? 0
    const usageCount = promo.usageCount ?? 0
    if (maxUses > 0 && usageCount >= maxUses) return 0

    const minSpend = promo.minSpend ?? 0
    if (subtotal < minSpend) return 0

    return calculateBcDiscount(promo.discountType ?? "Amount", promo.discountValue ?? 0, subtotal, promo.maxCap ?? 0)
  }

  const result = await validateCTBPromo({ code: promoCode, customerEmail, customerPhone, lines })
  return result.valid ? result.discountAmount : 0
}

// ----------------------------------------------------------------------

type ComputedChargeAmount = { ok: true; amount: number } | { ok: false; reason: string }

// Recomputes what a draft should cost — subtotal from the catalog, discount
// from a fresh promo check, shipping from the pure fee functions — without
// reference to any externally-reported "amount". Shared by both call sites:
// verifyOrderPricing (checkout completion, checks what was ACTUALLY charged)
// and verifyRequestedChargeAmount (payment session creation, checks what's
// ABOUT to be charged, before the card is touched at all).
async function computeExpectedChargeAmount(draft: CheckoutDraft): Promise<ComputedChargeAmount> {
  try {
    const giftbox = isGiftboxDraft(draft)
    const { subtotal: expectedSubtotal, lines } = giftbox
      ? await resolveGiftboxSubtotal(draft)
      : await resolveProductSubtotal(draft)

    if (Math.abs(expectedSubtotal - draft.pricing.subtotal) > TOLERANCE_SGD) {
      return { ok: false, reason: mismatch("Order subtotal", expectedSubtotal, draft.pricing.subtotal) }
    }

    const expectedPromoDiscount = await resolveAuthoritativePromoDiscount(
      draft.pricing.promoCode,
      expectedSubtotal,
      lines,
      draft.delivery.email,
      draft.delivery.phone
    )

    if (Math.abs(expectedPromoDiscount - draft.pricing.promoDiscount) > TOLERANCE_SGD) {
      return {
        ok: false,
        reason: "The applied promo code is no longer valid for this order. Please review your order and try again.",
      }
    }

    const expectedTotal = Math.max(0, expectedSubtotal - expectedPromoDiscount)
    if (Math.abs(expectedTotal - draft.pricing.total) > TOLERANCE_SGD) {
      return { ok: false, reason: mismatch("Order total", expectedTotal, draft.pricing.total) }
    }

    const expectedShippingFee = giftbox
      ? computeGiftboxShippingFee(expectedTotal)
      : computePackageShippingFee(expectedTotal)
    const expectedShippingAmount = expectedShippingFee?.amount ?? 0
    const declaredShippingAmount = draft.pricing.shippingAmount ?? 0

    // Partial-payment package orders omit shipping entirely (charged later
    // with the balance) — only check shipping for full-payment orders.
    if (draft.delivery.paymentMethod !== "partial" && Math.abs(expectedShippingAmount - declaredShippingAmount) > TOLERANCE_SGD) {
      return { ok: false, reason: mismatch("Shipping fee", expectedShippingAmount, declaredShippingAmount) }
    }

    // Deposit is a fixed policy amount, not derived from the catalog.
    if (draft.delivery.paymentMethod === "partial" && Math.abs(draft.pricing.deposit - 100) > TOLERANCE_SGD) {
      return { ok: false, reason: "Deposit amount is invalid for a partial-payment order." }
    }

    const expectedChargeAmount =
      draft.delivery.paymentMethod === "partial" ? draft.pricing.deposit : expectedTotal + expectedShippingAmount

    return { ok: true, amount: expectedChargeAmount }
  } catch (error) {
    console.error("[verify-order-pricing] Verification failed — blocking order", error)
    return {
      ok: false,
      reason: "Unable to verify this order's pricing right now. Please try again in a moment.",
    }
  }
}

async function verifyAmountMatchesDraft(
  draft: CheckoutDraft,
  amountToCheck: string | number | null,
  amountLabel: string
): Promise<VerifyOrderPricingResult> {
  const computed = await computeExpectedChargeAmount(draft)
  if (!computed.ok) {
    return computed
  }

  const actual = Number(amountToCheck)
  if (!Number.isFinite(actual)) {
    return { ok: false, reason: `The ${amountLabel.toLowerCase()} for this order could not be verified.` }
  }

  if (Math.abs(computed.amount - actual) > TOLERANCE_SGD) {
    return { ok: false, reason: mismatch(amountLabel, computed.amount, actual) }
  }

  return { ok: true }
}

// Used at checkout completion — checks what the payment gateway actually
// confirms was charged, after the fact.
export async function verifyOrderPricing(
  draft: CheckoutDraft,
  paymentAmount: string | null
): Promise<VerifyOrderPricingResult> {
  return verifyAmountMatchesDraft(draft, paymentAmount, "Charged amount")
}

// Used at payment session creation — checks the amount about to be charged
// BEFORE any card is touched, so a mismatched amount never reaches the
// gateway in the first place (closes the gap verifyOrderPricing alone can't:
// by the time it runs, the charge has already happened).
export async function verifyRequestedChargeAmount(
  draft: CheckoutDraft,
  requestedAmount: string
): Promise<VerifyOrderPricingResult> {
  return verifyAmountMatchesDraft(draft, requestedAmount, "Requested amount")
}

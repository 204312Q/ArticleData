// ----------------------------------------------------------------------
// Shipping/delivery fee rules — confirmed with the business 2026-08-05.
// Giftbox and Confinement packages have DIFFERENT rules; there is no shared
// tiering between them (unlike an earlier draft of this contract).
//
// Giftbox: strict two-tier delivery fee, based on the cart's items total
// AFTER promo discount but BEFORE shipping (GST-inclusive):
//   >= $300  -> FREE,     $0
//   <  $300  -> STANDARD, $20
// There is no small-order carve-out for giftbox — even a tiny cart just
// pays the $20 standard fee.
//
// Confinement packages: no delivery fee at all — it's bundled into the
// package price. The ONLY charge is a small-order surcharge, meant to
// discourage a steep promo (e.g. a Trial Meal at 50% off) from pushing an
// order below a sane minimum:
//   $0.01 – $19.99  -> SMALL_ORDER, $8
//   otherwise       -> no fee (omit shippingMethod/shippingAmount entirely,
//                      don't send an explicit "FREE" tier — shipping isn't
//                      a package concept outside this one edge case)
// ----------------------------------------------------------------------

export type ShippingMethod = "FREE" | "SMALL_ORDER" | "STANDARD"

export type ShippingFee = { method: ShippingMethod; amount: number }

export const SHIPPING_METHOD_LABEL: Record<ShippingMethod, string> = {
  FREE: "Free",
  SMALL_ORDER: "Small order fee",
  STANDARD: "Standard",
}

export function computeGiftboxShippingFee(
  itemsTotalAfterDiscount: number
): { method: "FREE" | "STANDARD"; amount: number } {
  if (itemsTotalAfterDiscount <= 0) return { method: "FREE", amount: 0 }
  if (itemsTotalAfterDiscount >= 300) return { method: "FREE", amount: 0 }
  return { method: "STANDARD", amount: 20 }
}

// Returns null when no fee applies — callers should omit
// shippingMethod/shippingAmount from the order payload entirely in that
// case, not send an explicit "FREE" tier.
export function computePackageShippingFee(
  itemsTotalAfterDiscount: number
): { method: "SMALL_ORDER"; amount: number } | null {
  if (itemsTotalAfterDiscount > 0 && itemsTotalAfterDiscount < 20) {
    return { method: "SMALL_ORDER", amount: 8 }
  }

  return null
}

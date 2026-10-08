// Shared promo-code validation client, used by both the confinement package
// checkout (product-order-flow.tsx) and the gift set checkout
// (baby-full-month-gift-set-checkout-view.tsx) so the two flows can never
// drift apart — there is exactly one code path that decides whether a promo
// code is valid, and it always asks the server, never a local hardcoded list.

export type AppliedPromoMeta = {
  discountType: 'Amount' | 'Percent';
  discountValue: number;
  maxCap: number | null;
  minSpend: number | null;
  itemCategoryCode?: string;
};

export type PromoValidationResult =
  | { ok: true; meta: AppliedPromoMeta; description?: string }
  | { ok: false; reason: string };

export type PromoCartLine = {
  lineAmount: number;
  productNo?: string;
};

// Mirrors the BC discount formula (CPNR Promo Code Mgt.CalculateDiscount) so the
// displayed/charged discount matches what Business Central applies to the order.
export function computePromoDiscount(meta: AppliedPromoMeta | null, subtotal: number): number {
  if (!meta) {
    return 0;
  }

  const cap = meta.maxCap ?? 0;
  let raw = meta.discountType === 'Amount' ? meta.discountValue : (subtotal * meta.discountValue) / 100;

  if (cap > 0) {
    raw = Math.min(raw, cap);
  }

  raw = Math.min(raw, subtotal);

  return Math.round(raw * 100) / 100;
}

export async function fetchPromoValidation(
  code: string,
  subtotal: number,
  lines: PromoCartLine[],
  customerEmail?: string,
  customerPhone?: string
): Promise<PromoValidationResult> {
  try {
    // POST with the cart lines so item-scoped promos are evaluated against
    // the selected products (not just the subtotal).
    const response = await fetch('/api/promo-codes/validate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code, subtotal, lines, customerEmail, customerPhone }),
    });
    const data = await response.json();

    if (!response.ok || !data?.valid) {
      return { ok: false, reason: data?.reason || data?.error || 'Promo code is not valid.' };
    }

    return {
      ok: true,
      meta: {
        discountType: data.discountType === 'Percent' ? 'Percent' : 'Amount',
        discountValue: Number(data.discountValue ?? 0),
        maxCap: data.maxCap ?? null,
        minSpend: data.minSpend ?? null,
        itemCategoryCode: data.itemCategoryCode,
      },
      description: data.description,
    };
  } catch {
    return { ok: false, reason: 'Could not validate the promo code. Please try again.' };
  }
}

import { listBCItems, type BCItem } from 'src/lib/bcClient';

import { giftSetProducts, type GiftSetProduct, type GiftSetVariant } from './baby-full-month-gift-set-data';

type BcItemFacts = {
  unitPrice: number | null;
  blocked: boolean;
};

function indexBcItems(items: BCItem[]): Map<string, BcItemFacts> {
  const byNumber = new Map<string, BcItemFacts>();

  for (const item of items) {
    const number = typeof item.number === 'string' ? item.number.trim().toUpperCase() : '';
    if (!number) continue;
    byNumber.set(number, {
      unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : null,
      blocked: item.blocked === true,
    });
  }

  return byNumber;
}

function withBcPrice(unitPrice: number | null, fallback: number): number {
  if (unitPrice === null) return fallback;
  return Math.round(unitPrice * 1.09 * 100) / 100;
}

function overlayVariant(variant: GiftSetVariant, byNumber: Map<string, BcItemFacts>, productFallbackPrice: number): GiftSetVariant[] {
  if (!variant.bcNumber) return [variant];

  const facts = byNumber.get(variant.bcNumber.toUpperCase());
  if (!facts) return [variant];
  if (facts.blocked) return [];

  return [{ ...variant, price: withBcPrice(facts.unitPrice, variant.price ?? productFallbackPrice) }];
}

function applyGiftboxOverlay(
  products: GiftSetProduct[],
  byNumber: Map<string, BcItemFacts>
): GiftSetProduct[] {
  return products.flatMap((product) => {
    if (product.variants) {
      const overlaidVariants = product.variants.flatMap((v) =>
        overlayVariant(v, byNumber, product.price)
      );

      if (overlaidVariants.length === 0) return [];

      const minPrice = Math.min(...overlaidVariants.map((v) => v.price ?? product.price));
      return [{ ...product, price: minPrice, variants: overlaidVariants }];
    }

    if (!product.bcNumber) return [product];

    const facts = byNumber.get(product.bcNumber.toUpperCase());
    if (!facts) return [product];
    if (facts.blocked) return [];

    return [{ ...product, price: withBcPrice(facts.unitPrice, product.price) }];
  });
}

export async function getGiftSetProducts(): Promise<GiftSetProduct[]> {
  try {
    const bcItems = await listBCItems(500, "startswith(number,'CFM-GFT-')", {
      next: { revalidate: 300, tags: ['bc-items'] },
    });
    return applyGiftboxOverlay(giftSetProducts, indexBcItems(bcItems));
  } catch {
    return giftSetProducts;
  }
}

import { z } from 'zod';

import { listBCItems, type BCItem, listCPNRSpecialReqPresets, type CPNRSpecReqPresetRecord } from 'src/lib/bcClient';

import { type ProductCatalog, defaultProductCatalog } from './product-data';

const PRODUCT_CATALOG_URL = process.env.PRODUCT_CATALOG_URL?.trim();
const PRODUCT_CATALOG_ALLOWED_HOSTS = process.env.PRODUCT_CATALOG_ALLOWED_HOSTS?.trim();
const isProduction = process.env.NODE_ENV === 'production';

export const PRODUCT_CATALOG_REVALIDATE_SECONDS = 300;
export const PRODUCT_CATALOG_TAG = 'product-catalog';

type GetProductCatalogOptions = {
  fresh?: boolean;
};

const productBundleSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().finite().nonnegative(),
  description: z.string().optional(),
  notes: z.array(z.string()).optional(),
  bcNumber: z.string().optional(),
});

const packageOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  durationDays: z.number().int().positive(),
  price: z.number().finite().nonnegative(),
  bcNumber: z.string().optional(),
  bundles: z.array(productBundleSchema).optional(),
});

const packageCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  note: z.string().optional(),
  options: z.array(packageOptionSchema),
});

const addOnOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  qty: z.number().int().positive(),
  price: z.number().finite().nonnegative(),
  bcNumber: z.string().optional(),
});

const addOnGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  type: z.enum(['single', 'multi']),
  options: z.array(addOnOptionSchema),
});

const specialRequestOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const promoCodeSchema = z.object({
  code: z.string(),
  type: z.enum(['amount', 'percent']),
  value: z.number().finite().nonnegative(),
  minSubtotal: z.number().finite().nonnegative().optional(),
  description: z.string(),
  conditions: z.array(z.string()).optional(),
  autoApply: z.boolean().optional(),
  autoApplyImmediately: z.boolean().optional(),
});

const productCatalogSchema = z.object({
  packageCategories: z.array(packageCategorySchema),
  addOnGroups: z.array(addOnGroupSchema),
  specialRequestOptions: z.array(specialRequestOptionSchema),
  promoCodes: z.array(promoCodeSchema),
});

function getAllowedCatalogHosts() {
  if (!PRODUCT_CATALOG_ALLOWED_HOSTS) {
    return [];
  }

  return Array.from(
    new Set(
      PRODUCT_CATALOG_ALLOWED_HOSTS.split(',')
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

function isLocalDevelopmentHost(hostname: string) {
  return ['localhost', '127.0.0.1', '::1'].includes(hostname);
}

function assertValidProductCatalogUrl(urlValue: string) {
  const url = new URL(urlValue);

  if (!['https:', 'http:'].includes(url.protocol)) {
    throw new Error(`Unsupported product catalog protocol: ${url.protocol}`);
  }

  const allowedHosts = getAllowedCatalogHosts();
  const normalizedHostname = url.hostname.toLowerCase();

  if (isProduction) {
    if (url.protocol !== 'https:') {
      throw new Error('PRODUCT_CATALOG_URL must use HTTPS in production.');
    }

    if (allowedHosts.length === 0) {
      throw new Error(
        'PRODUCT_CATALOG_ALLOWED_HOSTS must be configured in production when PRODUCT_CATALOG_URL is set.'
      );
    }
  } else if (url.protocol === 'http:' && !isLocalDevelopmentHost(normalizedHostname)) {
    throw new Error('HTTP product catalog URLs are only allowed for localhost during development.');
  }

  if (allowedHosts.length > 0 && !allowedHosts.includes(normalizedHostname)) {
    throw new Error(
      `Product catalog host "${url.hostname}" is not in PRODUCT_CATALOG_ALLOWED_HOSTS.`
    );
  }

  return url.toString();
}

type BcItemFacts = {
  unitPrice: number | null;
  blocked: boolean;
};

/** Build a fast lookup of BC item number (uppercased) -> the facts we overlay. */
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

/**
 * Overlay live BC price/availability onto a single catalog option.
 * - No `bcNumber`, or number not found in BC -> keep the static option unchanged.
 * - BC marks it blocked -> drop it (returns []).
 * - Otherwise -> swap in the live BC unit price.
 */
function overlayOption<T extends { bcNumber?: string; price: number }>(
  option: T,
  byNumber: Map<string, BcItemFacts>
): T[] {
  if (!option.bcNumber) return [option];

  const facts = byNumber.get(option.bcNumber.toUpperCase());
  if (!facts) return [option];
  if (facts.blocked) return [];

  const bcPrice = facts.unitPrice !== null ? Math.round(facts.unitPrice * 1.09 * 100) / 100 : null;
  return [{ ...option, price: bcPrice ?? option.price }];
}

/** Returns a new catalog with live BC price/availability stamped over the static one. */
function applyBusinessCentralOverlay(
  catalog: ProductCatalog,
  byNumber: Map<string, BcItemFacts>
): ProductCatalog {
  const packageCategories = catalog.packageCategories.map((category) => ({
    ...category,
    options: category.options.flatMap((option) =>
      overlayOption(option, byNumber).map((overlaidOption) =>
        overlaidOption.bundles
          ? {
              ...overlaidOption,
              bundles: overlaidOption.bundles.flatMap((bundle) => overlayOption(bundle, byNumber)),
            }
          : overlaidOption
      )
    ),
  }));

  const addOnGroups = catalog.addOnGroups.flatMap((group) => {
    const options = group.options.flatMap((option) => overlayOption(option, byNumber));
    if (options.length === 0) return []; // every serving blocked in BC -> hide the whole group
    return [{ ...group, options }];
  });

  return { ...catalog, packageCategories, addOnGroups };
}

/** Maps BC special request presets to the catalog's SpecialRequestOption shape. */
function mapBcPresets(presets: CPNRSpecReqPresetRecord[]) {
  return presets
    .filter(
      (p) =>
        p.blocked !== true &&
        typeof p.code === 'string' &&
        p.code.trim() &&
        typeof p.description === 'string' &&
        p.description.trim()
    )
    .map((p) => ({ id: p.code!.trim(), label: p.description!.trim() }));
}

/** Loads the static or remote catalog (the "skeleton"), before any BC overlay. */
async function loadBaseCatalog(options: GetProductCatalogOptions): Promise<ProductCatalog> {
  if (!PRODUCT_CATALOG_URL) {
    return defaultProductCatalog;
  }

  try {
    const validatedUrl = assertValidProductCatalogUrl(PRODUCT_CATALOG_URL);
    const response = await fetch(
      validatedUrl,
      options.fresh
        ? { cache: 'no-store' }
        : { next: { revalidate: PRODUCT_CATALOG_REVALIDATE_SECONDS, tags: [PRODUCT_CATALOG_TAG] } }
    );

    if (!response.ok) {
      throw new Error(`Product catalog request failed with ${response.status}`);
    }

    return productCatalogSchema.parse(await response.json());
  } catch (error) {
    console.error('Failed to load product catalog. Falling back to static product data.', error);
    return defaultProductCatalog;
  }
}

export async function getProductCatalog(
  options: GetProductCatalogOptions = {}
): Promise<ProductCatalog> {
  const baseCatalog = await loadBaseCatalog(options);

  const [itemsResult, presetsResult] = await Promise.allSettled([
    listBCItems(1000, "startswith(number,'CFM-')", { next: { revalidate: 300, tags: ['bc-items'] } }),
    listCPNRSpecialReqPresets(),
  ]);

  let catalog = baseCatalog;

  if (itemsResult.status === 'fulfilled') {
    catalog = applyBusinessCentralOverlay(catalog, indexBcItems(itemsResult.value));
  } else {
    console.error('Failed to overlay live BC pricing. Serving catalog with static prices.', itemsResult.reason);
  }

  if (presetsResult.status === 'fulfilled') {
    const mapped = mapBcPresets(presetsResult.value);
    if (mapped.length > 0) {
      catalog = { ...catalog, specialRequestOptions: mapped };
    }
  } else {
    console.error('Failed to load BC special request presets. Serving static options.', presetsResult.reason);
  }

  return catalog;
}

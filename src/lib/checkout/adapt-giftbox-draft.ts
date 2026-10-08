import type { CheckoutDraft } from "./complete-order"

import { z } from "zod"

import {
  encodeRepeatedMetadata,
  decodeRepeatedMetadata,
  encodeSectionedMetadata,
  decodeSectionedMetadata,
} from "./draft-metadata"

// The giftbox checkout has a much simpler shape than the confinement package
// one (a flat list of items — no package/bundle/add-on model, no special
// requests, no deposit). Rather than build a parallel order-creation module
// and email template, this adapts a giftbox draft into the existing
// CheckoutDraft shape so completeCheckoutOrder() and buildOrderConfirmationEmail()
// can be reused verbatim.

export const giftboxDraftItemSchema = z.object({
  choiceLabels: z.array(z.string().trim().min(1)).optional(),
  selections: z.record(z.string(), z.string()).optional(),
  itemNo: z.string({ error: "items[].itemNo is required" }).trim().min(1, "items[].itemNo is required"),
  lineTotal: z.number().nonnegative(),
  productId: z.string({ error: "items[].productId is required" }).trim().min(1),
  productName: z.string({ error: "items[].productName is required" }).trim().min(1),
  quantity: z
    .number({ error: "items[].quantity is required" })
    .int("items[].quantity must be an integer")
    .positive("items[].quantity must be greater than 0"),
  unitPrice: z.number().nonnegative(),
  variantName: z.string().trim().optional(),
})

export const giftboxDraftSchema = z.object({
  delivery: z.object({
    address: z.string({ error: "delivery.address is required" }).trim().min(1, "delivery.address is required"),
    deliveryDate: z
      .string({ error: "delivery.deliveryDate is required" })
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "delivery.deliveryDate must be in YYYY-MM-DD format"),
    email: z.string({ error: "delivery.email is required" }).trim().email("delivery.email must be a valid email address"),
    floor: z.string().trim(),
    fullName: z.string({ error: "delivery.fullName is required" }).trim().min(1, "delivery.fullName is required"),
    phone: z.string({ error: "delivery.phone is required" }).trim().min(1, "delivery.phone is required"),
    postalCode: z.string({ error: "delivery.postalCode is required" }).trim().min(1, "delivery.postalCode is required"),
    unit: z.string().trim(),
  }),
  draftId: z.string({ error: "draftId is required" }).trim().min(1, "draftId is required"),
  items: z.array(giftboxDraftItemSchema).min(1, "At least one item is required"),
  pricing: z.object({
    gstAmount: z.number().nonnegative(),
    promoCode: z.string().trim().nullable(),
    promoDiscount: z.number().nonnegative(),
    // Tiered shipping fee (src/lib/checkout/shipping-fee.ts) — giftbox is
    // always paid in full, so this is always computed, unlike the package
    // checkout's partial-payment path.
    shippingAmount: z.number().nonnegative(),
    shippingMethod: z.enum(["FREE", "SMALL_ORDER", "STANDARD"]),
    subtotal: z.number().nonnegative(),
    total: z.number().positive(),
  }),
})

export type GiftboxDraftInput = z.infer<typeof giftboxDraftSchema>

const GIFTBOX_METADATA_PREFIX = "giftbox"
// "items" is deliberately not in this list — a cart's item count is
// unbounded, so it's encoded separately below via encodeRepeatedMetadata.
const GIFTBOX_METADATA_SECTIONS = ["draftId", "delivery", "pricing"] as const

// choiceLabels is dropped here on purpose: it's a display-only field (shown
// in the cart/checkout review UI) that nothing server-side reads anymore —
// buildItemSelections() below covers the same ground more compactly. Leaving
// it out of the metadata copy keeps more of Stripe's 500-char-per-value
// budget free for the fields that actually reach CT Backend and the
// confirmation email.
function toMetadataItem(item: GiftboxDraftInput["items"][number]) {
  return {
    itemNo: item.itemNo,
    lineTotal: item.lineTotal,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    selections: item.selections,
    unitPrice: item.unitPrice,
    variantName: item.variantName,
  }
}

export function encodeGiftboxDraftMetadata(draft: GiftboxDraftInput): Record<string, string> {
  return {
    ...encodeSectionedMetadata(draft, GIFTBOX_METADATA_SECTIONS, GIFTBOX_METADATA_PREFIX),
    ...encodeRepeatedMetadata(draft.items.map(toMetadataItem), "items", GIFTBOX_METADATA_PREFIX),
  }
}

export function decodeGiftboxDraftMetadata(
  metadata: Record<string, string | undefined | null>
): GiftboxDraftInput | null {
  const base = decodeSectionedMetadata<Omit<GiftboxDraftInput, "items">>(
    metadata,
    GIFTBOX_METADATA_SECTIONS,
    GIFTBOX_METADATA_PREFIX
  )
  if (!base) {
    return null
  }

  const items = decodeRepeatedMetadata<GiftboxDraftInput["items"][number]>(
    metadata,
    "items",
    GIFTBOX_METADATA_PREFIX
  )
  if (!items) {
    return null
  }

  return { ...base, items }
}

function buildItemLabel(item: GiftboxDraftInput["items"][number]): string {
  return [item.productName, item.variantName].filter(Boolean).join(" - ")
}

export function adaptGiftboxDraftToCheckoutDraft(input: GiftboxDraftInput): CheckoutDraft {
  const addOns = input.items.map((item) => ({
    id: item.productId,
    itemNo: item.itemNo,
    label: buildItemLabel(item),
    price: item.unitPrice,
    quantity: item.quantity,
    // Already keyed by CT Backend's own option group/value codes (e.g.
    // CARDMSG: "PERSONALISED") — see ctb-selection-codes.ts. Variant is
    // conveyed via `label`/`itemNo` above instead, since "variant" isn't one
    // of CT Backend's recognized option groups.
    selections: item.selections && Object.keys(item.selections).length > 0 ? item.selections : undefined,
  }))

  return {
    addOns,
    bundles: [],
    delivery: {
      address: input.delivery.address,
      email: input.delivery.email,
      floor: input.delivery.floor,
      fullName: input.delivery.fullName,
      paymentMethod: "full",
      paymentType: "credit-card",
      phone: input.delivery.phone,
      postalCode: input.delivery.postalCode,
      unit: input.delivery.unit,
    },
    draftId: input.draftId,
    // Placeholder — giftbox orders have no real package/meal-plan selection.
    // selectedDateType: "delivery" signals buildCTBOrderLines() to skip the
    // placeholder line entirely, matching CT Backend's own native order
    // structure for giftbox orders (no package line, dateType "DELIVERY").
    // Never resolved against BC's catalog (that lookup only happens in BC
    // mode, which this flow doesn't use).
    packageSelection: {
      categoryId: null,
      categoryName: "Giftbox Order",
      durationDays: 1,
      itemNo: "GIFTBOX-ORDER",
      optionId: null,
      optionLabel: "Giftbox Order",
      selectedDate: input.delivery.deliveryDate,
      selectedDateType: "delivery",
      startWith: "lunch",
    },
    pricing: {
      balance: 0,
      deposit: 0,
      gstAmount: input.pricing.gstAmount,
      promoCode: input.pricing.promoCode,
      promoDiscount: input.pricing.promoDiscount,
      shippingAmount: input.pricing.shippingAmount,
      shippingMethod: input.pricing.shippingMethod,
      subtotal: input.pricing.subtotal,
      total: input.pricing.total,
    },
    specialRequests: { note: "", riceOption: "NO_PREF", selected: [] },
    summary: {
      categoryName: "Giftbox Order",
      optionLabel: `${input.items.length} item${input.items.length === 1 ? "" : "s"}`,
      totalLabel: `$${input.pricing.total.toFixed(2)}`,
    },
  }
}

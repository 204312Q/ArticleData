import { it, expect, describe } from "vitest"

import {
  giftboxDraftSchema,
  encodeGiftboxDraftMetadata,
  decodeGiftboxDraftMetadata,
  adaptGiftboxDraftToCheckoutDraft,
} from "./adapt-giftbox-draft"

function makeGiftboxInput() {
  return giftboxDraftSchema.parse({
    draftId: "GIFT-20260801-093000-A1B2",
    items: [
      {
        productId: "baby-bliss-a",
        productName: "Baby Bliss Kebaya Set",
        itemNo: "CFM-GFT-0001",
        variantName: "Pink",
        choiceLabels: ["Size: M"],
        selections: { size: "M" },
        quantity: 1,
        unitPrice: 120,
        lineTotal: 120,
      },
      {
        productId: "tingkat-classic",
        productName: "Tingkat Classic Set",
        itemNo: "CFM-GFT-0002",
        quantity: 2,
        unitPrice: 40,
        lineTotal: 80,
      },
    ],
    delivery: {
      fullName: "Jane Tan",
      phone: "91234567",
      email: "customer@example.com",
      address: "123 Example Ave",
      floor: "12",
      unit: "34",
      postalCode: "123456",
      deliveryDate: "2026-09-01",
    },
    pricing: {
      subtotal: 200,
      promoCode: "WELCOME10",
      promoDiscount: 20,
      gstAmount: 16.2,
      total: 196.2,
      shippingMethod: "STANDARD",
      shippingAmount: 20,
    },
  })
}

describe("adaptGiftboxDraftToCheckoutDraft", () => {
  it("maps every item into addOns, preserving itemNo/price/quantity", () => {
    const draft = adaptGiftboxDraftToCheckoutDraft(makeGiftboxInput())

    expect(draft.bundles).toEqual([])
    expect(draft.addOns).toEqual([
      {
        id: "baby-bliss-a",
        itemNo: "CFM-GFT-0001",
        label: "Baby Bliss Kebaya Set - Pink",
        price: 120,
        quantity: 1,
        selections: { size: "M" },
      },
      {
        id: "tingkat-classic",
        itemNo: "CFM-GFT-0002",
        label: "Tingkat Classic Set",
        price: 40,
        quantity: 2,
        selections: undefined,
      },
    ])
  })

  it("prices the placeholder package line at exactly $0", () => {
    const input = makeGiftboxInput()
    const draft = adaptGiftboxDraftToCheckoutDraft(input)

    const addOnsTotal = draft.addOns.reduce((sum, addOn) => sum + addOn.price * addOn.quantity, 0)
    expect(addOnsTotal).toBe(input.pricing.subtotal)

    // Mirrors buildCTBOrderLines()'s own derivation: packagePrice = subtotal - bundlesTotal - addOnsTotal.
    const packagePrice = Math.max(0, draft.pricing.subtotal - 0 - addOnsTotal)
    expect(packagePrice).toBe(0)
  })

  it("carries delivery details and the delivery date into packageSelection.selectedDate", () => {
    const draft = adaptGiftboxDraftToCheckoutDraft(makeGiftboxInput())

    expect(draft.delivery).toMatchObject({
      address: "123 Example Ave",
      email: "customer@example.com",
      fullName: "Jane Tan",
      paymentMethod: "full",
      paymentType: "credit-card",
      phone: "91234567",
      postalCode: "123456",
    })
    expect(draft.packageSelection.selectedDate).toBe("2026-09-01")
    // "delivery" (not "confirmed"/"edd") is what tells buildCTBOrderLines()
    // in complete-order.ts to skip the placeholder package line and send
    // dateType: "DELIVERY" instead of "CONFIRMED" — matching CT Backend's
    // own native structure for giftbox orders.
    expect(draft.packageSelection.selectedDateType).toBe("delivery")
  })

  it("carries pricing through with deposit/balance at 0 (full payment only)", () => {
    const draft = adaptGiftboxDraftToCheckoutDraft(makeGiftboxInput())

    expect(draft.pricing).toEqual({
      balance: 0,
      deposit: 0,
      gstAmount: 16.2,
      promoCode: "WELCOME10",
      promoDiscount: 20,
      shippingMethod: "STANDARD",
      shippingAmount: 20,
      subtotal: 200,
      total: 196.2,
    })
  })

  it("rejects an item with no resolved itemNo", () => {
    const invalid = {
      ...makeGiftboxInput(),
      items: [{ ...makeGiftboxInput().items[0], itemNo: "" }],
    }

    expect(() => giftboxDraftSchema.parse(invalid)).toThrow()
  })
})

describe("encodeGiftboxDraftMetadata / decodeGiftboxDraftMetadata", () => {
  it("round-trips a draft through metadata", () => {
    const input = makeGiftboxInput()
    const metadata = encodeGiftboxDraftMetadata(input)
    const decoded = decodeGiftboxDraftMetadata(metadata)

    expect(decoded).toEqual({
      ...input,
      // choiceLabels is intentionally dropped from the metadata copy — see
      // toMetadataItem() in adapt-giftbox-draft.ts.
      items: input.items.map(({ choiceLabels: _choiceLabels, ...rest }) => rest),
    })
  })

  it("encodes one metadata key per item plus a count key, not one combined blob", () => {
    const metadata = encodeGiftboxDraftMetadata(makeGiftboxInput())

    expect(metadata.giftbox_items_count).toBe("2")
    expect(metadata.giftbox_items_0).toBeDefined()
    expect(metadata.giftbox_items_1).toBeDefined()
    expect(metadata.giftbox_items).toBeUndefined()
  })

  it("keeps every metadata value under 500 chars even with a personalised, multi-item cart (regression: this used to overflow as one combined blob)", () => {
    const input = giftboxDraftSchema.parse({
      ...makeGiftboxInput(),
      items: [
        {
          productId: "baby-bliss-a",
          productName: "Baby Bliss Kebaya Set",
          itemNo: "CFM-GFT-0001",
          variantName: "Pink",
          choiceLabels: [
            "Choice of Ang Ku Kueh: Gold Dust Ang Ku Kueh",
            "Card Message: Congratulations on your beautiful new baby girl! Wishing your family so much love, joy, and precious moments together in this new chapter.",
          ],
          selections: {
            angKuKuehType: "Gold Dust Ang Ku Kueh",
            card:
              "Congratulations on your beautiful new baby girl! Wishing your family so much love, joy, and precious moments together in this new chapter.",
          },
          quantity: 1,
          unitPrice: 120,
          lineTotal: 120,
        },
        {
          productId: "tingkat-classic",
          productName: "Tingkat Classic Set",
          itemNo: "CFM-GFT-0002",
          quantity: 2,
          unitPrice: 40,
          lineTotal: 80,
        },
      ],
    })

    const metadata = encodeGiftboxDraftMetadata(input)

    for (const [key, value] of Object.entries(metadata)) {
      expect(value.length, `${key} should be under 500 chars`).toBeLessThan(500)
    }
    expect(decodeGiftboxDraftMetadata(metadata)?.items).toHaveLength(2)
  })

  it("round-trips a draft with zero items rejected by the schema, but handles an empty array at the encode/decode layer directly", () => {
    const metadata = encodeGiftboxDraftMetadata({ ...makeGiftboxInput(), items: [] })

    expect(metadata.giftbox_items_count).toBe("0")
    expect(decodeGiftboxDraftMetadata(metadata)?.items).toEqual([])
  })

  it("returns null when the items count key is missing", () => {
    const metadata = encodeGiftboxDraftMetadata(makeGiftboxInput())
    delete metadata.giftbox_items_count

    expect(decodeGiftboxDraftMetadata(metadata)).toBeNull()
  })

  it("returns null when a fixed section is missing", () => {
    const metadata = encodeGiftboxDraftMetadata(makeGiftboxInput())
    delete metadata.giftbox_delivery

    expect(decodeGiftboxDraftMetadata(metadata)).toBeNull()
  })
})

import type { CheckoutDraft } from "./complete-order"

import { it, expect, describe } from "vitest"

import {
  encodeDraftMetadata,
  decodeDraftMetadata,
  encodeRepeatedMetadata,
  decodeRepeatedMetadata,
  encodeSectionedMetadata,
  decodeSectionedMetadata,
} from "./draft-metadata"

function makeDraft(): CheckoutDraft {
  return {
    draftId: "CONF-20260801-093000-A1B2",
    summary: {
      categoryName: "Standard",
      optionLabel: "28 Days",
      totalLabel: "$3,200.00",
    },
    packageSelection: {
      categoryId: "standard",
      categoryName: "Standard",
      durationDays: 28,
      itemNo: "CFM-PCP-0001",
      optionId: "opt-1",
      optionLabel: "28 Days",
      selectedDateType: "confirmed",
      selectedDate: "2026-09-01",
      startWith: "lunch",
    },
    bundles: [{ id: "b1", itemNo: "CFM-BND-0001", name: "Herbal Bundle", price: 200 }],
    addOns: [{ id: "a1", itemNo: "CFM-ADN-0001", label: "Extra Soup", price: 20, quantity: 2 }],
    specialRequests: {
      note: "No spicy food please, thank you very much for accommodating this request!",
      riceOption: "BROWN",
      selected: ["No Weekend Deliveries"],
    },
    delivery: {
      address: "123 Example Ave",
      email: "customer@example.com",
      floor: "12",
      fullName: "Jane Tan",
      paymentMethod: "full",
      paymentType: "credit-card",
      phone: "91234567",
      postalCode: "123456",
      unit: "34",
    },
    pricing: {
      balance: 0,
      deposit: 0,
      gstAmount: 250,
      promoCode: "WELCOME10",
      promoDiscount: 100,
      subtotal: 3050,
      total: 3200,
    },
  }
}

describe("encodeDraftMetadata / decodeDraftMetadata", () => {
  it("round-trips a full draft through metadata", () => {
    const draft = makeDraft()
    const metadata = encodeDraftMetadata(draft)
    const decoded = decodeDraftMetadata(metadata)

    expect(decoded).toEqual(draft)
  })

  it("keeps each metadata value comfortably under Stripe's per-value limit", () => {
    const metadata = encodeDraftMetadata(makeDraft())

    for (const value of Object.values(metadata)) {
      expect(value.length).toBeLessThan(500)
    }
  })

  it("keeps every metadata value under 500 chars even with many add-ons (regression: this used to overflow as one combined blob)", () => {
    const draft = makeDraft()
    draft.addOns = [
      { id: "a1", itemNo: "CFM-ADN-003", label: "Pig's Trotter with Ginger and Vinegar (5 servings)", price: 55, quantity: 5 },
      { id: "a2", itemNo: "CFM-ADN-006", label: "Milk Boosting Fish and Papaya Soup (5 servings)", price: 32, quantity: 5 },
      { id: "a3", itemNo: "CFM-ADN-009", label: "Homemade Bird's Nest (5 servings)", price: 66, quantity: 5 },
      { id: "a4", itemNo: "CFM-ADN-010", label: "Comforting Set", price: 32, quantity: 3 },
      { id: "a5", itemNo: "CFM-ADN-011", label: "Thermal Flask", price: 10, quantity: 1 },
      { id: "a6", itemNo: "CFM-PPD-001", label: "Solaris UV Sterilizer", price: 299, quantity: 1 },
    ]

    const metadata = encodeDraftMetadata(draft)

    for (const [key, value] of Object.entries(metadata)) {
      expect(value.length, `${key} should be under 500 chars`).toBeLessThan(500)
    }
    expect(metadata.draft_addOns_count).toBe("6")
    expect(decodeDraftMetadata(metadata)).toEqual(draft)
  })

  it("returns null when a section is missing", () => {
    const metadata = encodeDraftMetadata(makeDraft())
    delete metadata.draft_delivery

    expect(decodeDraftMetadata(metadata)).toBeNull()
  })

  it("returns null when a section fails to parse", () => {
    const metadata = encodeDraftMetadata(makeDraft())
    metadata.draft_pricing = "{not valid json"

    expect(decodeDraftMetadata(metadata)).toBeNull()
  })

  it("returns null when the addOns count key is missing", () => {
    const metadata = encodeDraftMetadata(makeDraft())
    delete metadata.draft_addOns_count

    expect(decodeDraftMetadata(metadata)).toBeNull()
  })

  it("returns null when an addOns entry is missing", () => {
    const metadata = encodeDraftMetadata(makeDraft())
    delete metadata.draft_addOns_0

    expect(decodeDraftMetadata(metadata)).toBeNull()
  })

  it("round-trips a draft with zero add-ons", () => {
    const draft = { ...makeDraft(), addOns: [] }
    const metadata = encodeDraftMetadata(draft)

    expect(metadata.draft_addOns_count).toBe("0")
    expect(decodeDraftMetadata(metadata)).toEqual(draft)
  })

  it("returns null for empty metadata", () => {
    expect(decodeDraftMetadata({})).toBeNull()
  })
})

describe("encodeSectionedMetadata / decodeSectionedMetadata (generic)", () => {
  type GiftboxLikeDraft = {
    draftId: string
    items: Array<{ itemNo: string; quantity: number }>
    delivery: { address: string }
  }

  const SECTIONS = ["draftId", "items", "delivery"] as const

  function makeGiftboxLikeDraft(): GiftboxLikeDraft {
    return {
      draftId: "GIFT-20260801-093000-C3D4",
      items: [{ itemNo: "CFM-GFT-0001", quantity: 2 }],
      delivery: { address: "1 Example Road" },
    }
  }

  it("round-trips an arbitrary draft shape under a custom prefix", () => {
    const draft = makeGiftboxLikeDraft()
    const metadata = encodeSectionedMetadata(draft, SECTIONS, "giftbox")

    expect(Object.keys(metadata)).toEqual(["giftbox_draftId", "giftbox_items", "giftbox_delivery"])
    expect(decodeSectionedMetadata<GiftboxLikeDraft>(metadata, SECTIONS, "giftbox")).toEqual(draft)
  })

  it("does not collide with a different prefix's keys", () => {
    const draft = makeGiftboxLikeDraft()
    const metadata = {
      ...encodeSectionedMetadata(draft, SECTIONS, "giftbox"),
      ...encodeDraftMetadata(makeDraft()),
    }

    expect(decodeSectionedMetadata<GiftboxLikeDraft>(metadata, SECTIONS, "giftbox")).toEqual(draft)
    expect(decodeDraftMetadata(metadata)).toEqual(makeDraft())
  })

  it("returns null when a section is missing under the given prefix", () => {
    const metadata = encodeSectionedMetadata(makeGiftboxLikeDraft(), SECTIONS, "giftbox")
    delete metadata.giftbox_delivery

    expect(decodeSectionedMetadata(metadata, SECTIONS, "giftbox")).toBeNull()
  })
})

describe("encodeRepeatedMetadata / decodeRepeatedMetadata", () => {
  type Item = { label: string; price: number }

  it("encodes one metadata key per entry plus a count key", () => {
    const items: Item[] = [
      { label: "Extra Soup", price: 20 },
      { label: "Thermal Flask", price: 10 },
    ]

    const metadata = encodeRepeatedMetadata(items, "addOns", "draft")

    expect(metadata).toEqual({
      draft_addOns_count: "2",
      draft_addOns_0: JSON.stringify(items[0]),
      draft_addOns_1: JSON.stringify(items[1]),
    })
  })

  it("round-trips an arbitrary number of entries", () => {
    const items: Item[] = Array.from({ length: 6 }, (_, index) => ({
      label: `Item ${index}`,
      price: index * 10,
    }))

    const metadata = encodeRepeatedMetadata(items, "addOns", "draft")

    expect(decodeRepeatedMetadata<Item>(metadata, "addOns", "draft")).toEqual(items)
  })

  it("round-trips an empty list", () => {
    const metadata = encodeRepeatedMetadata<Item>([], "addOns", "draft")

    expect(metadata).toEqual({ draft_addOns_count: "0" })
    expect(decodeRepeatedMetadata<Item>(metadata, "addOns", "draft")).toEqual([])
  })

  it("returns null when the count key is missing", () => {
    expect(decodeRepeatedMetadata<Item>({}, "addOns", "draft")).toBeNull()
  })

  it("returns null when the count is not a valid non-negative integer", () => {
    expect(decodeRepeatedMetadata<Item>({ draft_addOns_count: "not-a-number" }, "addOns", "draft")).toBeNull()
    expect(decodeRepeatedMetadata<Item>({ draft_addOns_count: "-1" }, "addOns", "draft")).toBeNull()
  })

  it("returns null when an indexed entry is missing", () => {
    const metadata = encodeRepeatedMetadata([{ label: "A", price: 1 }, { label: "B", price: 2 }], "addOns", "draft")
    delete metadata.draft_addOns_1

    expect(decodeRepeatedMetadata<Item>(metadata, "addOns", "draft")).toBeNull()
  })

  it("returns null when an indexed entry fails to parse", () => {
    const metadata = encodeRepeatedMetadata([{ label: "A", price: 1 }], "addOns", "draft")
    metadata.draft_addOns_0 = "{not valid json"

    expect(decodeRepeatedMetadata<Item>(metadata, "addOns", "draft")).toBeNull()
  })

  it("does not collide with a different prefix or key", () => {
    const addOns = encodeRepeatedMetadata([{ label: "Soup", price: 20 }], "addOns", "draft")
    const items = encodeRepeatedMetadata([{ label: "Gift", price: 88 }], "items", "giftbox")
    const metadata = { ...addOns, ...items }

    expect(decodeRepeatedMetadata<Item>(metadata, "addOns", "draft")).toEqual([{ label: "Soup", price: 20 }])
    expect(decodeRepeatedMetadata<Item>(metadata, "items", "giftbox")).toEqual([{ label: "Gift", price: 88 }])
  })
})

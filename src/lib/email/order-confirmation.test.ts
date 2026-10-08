import type { CheckoutDraft, CompletedCheckoutOrder } from "@/lib/checkout/complete-order"

import { it, expect, describe } from "vitest"

import { buildOrderConfirmationEmail } from "./order-confirmation"

const DRAFT: CheckoutDraft = {
  draftId: "DRAFT-123",
  summary: { categoryName: "Dual Meal", optionLabel: "28 Days", totalLabel: "$1,828.00" },
  packageSelection: {
    categoryId: "dual-meal",
    categoryName: "Dual Meal",
    durationDays: 28,
    itemNo: "CFM-PCP-001",
    optionId: "dual-28",
    optionLabel: "28 Days",
    selectedDateType: "confirmed",
    selectedDate: "2026-08-01",
    startWith: "lunch",
  },
  bundles: [{ id: "bundle-1", itemNo: "CFM-BND-001", name: "BMB Massage Package", price: 1440.6 }],
  addOns: [
    {
      id: "pig-trotter-1",
      itemNo: "CFM-ADN-001",
      label: "Pig's Trotter (1 serving)",
      price: 12,
      quantity: 1,
    },
  ],
  specialRequests: { note: "No coriander please", riceOption: "BROWN", selected: ["No Salmon"] },
  delivery: {
    address: "1 Test Road",
    email: "customer@example.com",
    floor: "10",
    unit: "05",
    fullName: "Jane Tan",
    paymentMethod: "full",
    paymentType: "credit-card",
    phone: "91234567",
    postalCode: "123456",
  },
  pricing: {
    balance: 0,
    deposit: 0,
    gstAmount: 150.87,
    promoCode: "EB5OFF",
    promoDiscount: 91.4,
    subtotal: 1828,
    total: 1828,
  },
}

const COMPLETED_ORDER: CompletedCheckoutOrder = {
  customerNo: "CUST-001",
  customerSource: "created",
  notes: [],
  orderNo: "WEB-2026-00001",
  orderReference: "DRAFT-123",
  orderSystemId: "sys-1",
  paymentTransactionId: "PT-1",
  paymentStatus: "AUTHORIZED",
  resolvedItems: [],
  transactionId: "TXN-1",
}

describe("buildOrderConfirmationEmail", () => {
  it("includes the order number, key line items, and total", () => {
    const email = buildOrderConfirmationEmail({ completedOrder: COMPLETED_ORDER, draft: DRAFT })

    expect(email.subject).toContain("WEB-2026-00001")
    expect(email.html).toContain("WEB-2026-00001")
    expect(email.html).toContain("Dual Meal - 28 Days")
    expect(email.html).toContain("BMB Massage Package")
    expect(email.html).toContain("Pig's Trotter (1 serving)")
    expect(email.html).toContain("$1,828.00")
    expect(email.html).toContain("Jane Tan")
    expect(email.text).toContain("WEB-2026-00001")
    expect(email.text).toContain("Jane Tan")
  })

  it("falls back to the order reference when there is no BC order number yet", () => {
    const email = buildOrderConfirmationEmail({
      completedOrder: { ...COMPLETED_ORDER, orderNo: null },
      draft: DRAFT,
    })

    expect(email.subject).toContain("DRAFT-123")
  })

  it("lists special requests and rice preference when present", () => {
    const email = buildOrderConfirmationEmail({ completedOrder: COMPLETED_ORDER, draft: DRAFT })

    expect(email.html).toContain("No Salmon")
    expect(email.html).toContain("All Brown Rice")
    expect(email.html).toContain("No coriander please")
  })

  it("omits the special requests section entirely when there are none", () => {
    const email = buildOrderConfirmationEmail({
      completedOrder: COMPLETED_ORDER,
      draft: {
        ...DRAFT,
        specialRequests: { note: "", riceOption: "NO_PREF", selected: [] },
      },
    })

    expect(email.html).not.toContain("Special Requests")
  })

  it("shows the add-on's pack price as-is, with no quantity multiplier, for a package order", () => {
    const email = buildOrderConfirmationEmail({
      completedOrder: COMPLETED_ORDER,
      draft: {
        ...DRAFT,
        addOns: [
          { id: "pig-trotter-3", itemNo: "CFM-ADN-002", label: "Pig's Trotter (3 servings)", price: 35, quantity: 3 },
        ],
      },
    })

    // "quantity: 3" here is the catalog option's servings-count label, already
    // folded into the label text — not a count of packs bought, so it must
    // neither multiply the price nor get a redundant "x3" suffix.
    expect(email.html).toContain("Pig's Trotter (3 servings)</td>")
    expect(email.html).not.toContain("x3")
    expect(email.html).toContain("$35.00")
    expect(email.html).not.toContain("$105.00")
  })

  it("multiplies price by quantity for a giftbox order's add-on line, since quantity is a real purchase count there", () => {
    const email = buildOrderConfirmationEmail({
      completedOrder: COMPLETED_ORDER,
      draft: {
        ...DRAFT,
        packageSelection: { ...DRAFT.packageSelection, selectedDateType: "delivery" },
        addOns: [
          { id: "baby-bliss-c", itemNo: "CFM-GFT-BBC", label: "Baby Bliss (Kebaya Gift Box) - Baby Bliss C", price: 8.5, quantity: 22 },
        ],
      },
    })

    expect(email.html).toContain("Baby Bliss (Kebaya Gift Box) - Baby Bliss C x22")
    expect(email.html).toContain("$187.00")
  })

  it("shows the add-on's own unit price alongside its multiplied line amount, for both order types", () => {
    const packageEmail = buildOrderConfirmationEmail({
      completedOrder: COMPLETED_ORDER,
      draft: {
        ...DRAFT,
        addOns: [
          { id: "pig-trotter-3", itemNo: "CFM-ADN-002", label: "Pig's Trotter (3 servings)", price: 35, quantity: 3 },
        ],
      },
    })

    // Package add-ons have no real per-unit breakdown (quantity is a servings
    // label, not a count) — unit price and amount are just the same $35.00.
    expect(packageEmail.html).toContain("Unit Price")
    expect(packageEmail.html).toContain("$35.00")

    const giftboxEmail = buildOrderConfirmationEmail({
      completedOrder: COMPLETED_ORDER,
      draft: {
        ...DRAFT,
        packageSelection: { ...DRAFT.packageSelection, selectedDateType: "delivery" },
        addOns: [
          { id: "baby-bliss-c", itemNo: "CFM-GFT-BBC", label: "Baby Bliss (Kebaya Gift Box) - Baby Bliss C", price: 8.5, quantity: 22 },
        ],
      },
    })

    // Giftbox quantity is a real multiplier — unit price ($8.50) must appear
    // distinctly from the multiplied line amount ($187.00), not just the total.
    expect(giftboxEmail.html).toContain("$8.50")
    expect(giftboxEmail.html).toContain("$187.00")
  })

  it("shows the package's own price in the package row, not the order's grand total", () => {
    const email = buildOrderConfirmationEmail({
      completedOrder: COMPLETED_ORDER,
      draft: {
        ...DRAFT,
        // summary.totalLabel ($1,828.00) is the package's own price; the
        // order's grand total ($3,189.20, after bundle + add-on + discount)
        // is a different number and must not leak into the package row.
        pricing: { ...DRAFT.pricing, subtotal: 3280.6, total: 3189.2 },
      },
    })

    expect(email.html).toContain("$1,828.00")
    expect(email.html).toContain("$3,189.20")
  })

  it("skips the placeholder package row entirely for giftbox orders, since there's no real package", () => {
    const email = buildOrderConfirmationEmail({
      completedOrder: COMPLETED_ORDER,
      draft: {
        ...DRAFT,
        packageSelection: { ...DRAFT.packageSelection, selectedDateType: "delivery" },
        summary: { categoryName: "Giftbox Order", optionLabel: "1 item", totalLabel: "$172.09" },
        bundles: [],
        addOns: [
          { id: "baby-bliss-c", itemNo: "CFM-GFT-BBC", label: "Baby Bliss (Kebaya Gift Box) - Baby Bliss C", price: 8.5, quantity: 22 },
        ],
      },
    })

    // No placeholder row for the (nonexistent) package — only the real item line.
    expect(email.html).not.toContain("Giftbox Order")
    expect(email.html).not.toContain("$172.09")
    expect(email.html).toContain("Baby Bliss (Kebaya Gift Box) - Baby Bliss C x22")
  })

  it("shows a plain delivery date with no confirmed/E.D.D. or lunch/dinner copy for giftbox orders (selectedDateType: delivery)", () => {
    const email = buildOrderConfirmationEmail({
      completedOrder: COMPLETED_ORDER,
      draft: {
        ...DRAFT,
        packageSelection: { ...DRAFT.packageSelection, selectedDateType: "delivery" },
      },
    })

    expect(email.html).toContain("1 August 2026")
    expect(email.html).not.toContain("Confirmed start date")
    expect(email.html).not.toContain("starting with")
    expect(email.text).toContain("1 August 2026")
    expect(email.text).not.toContain("Confirmed start date")
  })
})

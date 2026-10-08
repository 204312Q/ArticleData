import type { CheckoutDraft } from "./complete-order"

import { it, vi, expect, describe, beforeEach } from "vitest"

const createCTBOrderMock = vi.fn()
const orderBackendMock = vi.fn()

vi.mock("@/lib/order-backend", () => ({
  orderBackend: () => orderBackendMock(),
}))
vi.mock("@/lib/ct-backend/client", () => ({
  createCTBOrder: (input: unknown) => createCTBOrderMock(input),
}))
vi.mock("@/lib/payment-transactions", () => ({
  upsertOrderRecord: vi.fn(),
}))
vi.mock("@/lib/bcClient", () => ({
  listBCItems: vi.fn(),
  createBCCustomer: vi.fn(),
  findBCCustomerByEmail: vi.fn(),
  findBCCustomerByPhone: vi.fn(),
  createCPNROrderWithLines: vi.fn(),
  listCPNRSpecialReqPresets: vi.fn(),
}))

import { completeCheckoutOrder } from "./complete-order"
import { adaptGiftboxDraftToCheckoutDraft } from "./adapt-giftbox-draft"

function makeProductDraft(): CheckoutDraft {
  return {
    draftId: "CONF-20260801-093000-A1B2",
    summary: { categoryName: "Standard", optionLabel: "28 Days", totalLabel: "$3,200.00" },
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
    bundles: [],
    addOns: [{ id: "a1", itemNo: "CFM-ADN-0001", label: "Extra Soup", price: 20, quantity: 2 }],
    specialRequests: { note: "", riceOption: "NO_PREF", selected: [] },
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
    pricing: { balance: 0, deposit: 0, gstAmount: 250, promoCode: null, promoDiscount: 0, subtotal: 3040, total: 3200 },
  }
}

function makeGiftboxDraft(): CheckoutDraft {
  return adaptGiftboxDraftToCheckoutDraft({
    draftId: "GIFT-20260801-093000-C3D4",
    items: [
      {
        productId: "baby-bliss-c",
        productName: "Baby Bliss (Kebaya Gift Box)",
        itemNo: "CFM-GFT-BBC",
        variantName: "Baby Bliss C",
        quantity: 22,
        unitPrice: 8.5,
        lineTotal: 187,
      },
    ],
    delivery: {
      fullName: "Priya Nair",
      phone: "+6598765432",
      email: "priya.nair@example.com",
      address: "88 Tanjong Pagar Road",
      floor: "",
      unit: "#12-08",
      postalCode: "088523",
      deliveryDate: "2026-08-15",
    },
    pricing: {
      subtotal: 187,
      promoCode: "GIFTSET15",
      promoDiscount: 28.05,
      gstAmount: 13.14,
      total: 172.09,
      shippingMethod: "STANDARD",
      shippingAmount: 20,
    },
  })
}

function makePayment() {
  return {
    amount: "172.09",
    currency: "SGD",
    orderReference: "GIFT-20260801-093000-C3D4",
    paymentStatus: "PAID" as const,
    paymentTransactionId: "pt_1",
    transactionId: "pi_123",
  }
}

describe("completeCheckoutOrder — CTB envelope shape", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    orderBackendMock.mockReturnValue("ctbackend")
    createCTBOrderMock.mockResolvedValue({ id: "id_1", orderNo: "WEB-2026-00001", duplicate: false })
  })

  it("sends dateType CONFIRMED and includes the package placeholder line for a product order", async () => {
    await completeCheckoutOrder({ draft: makeProductDraft(), payment: makePayment() })

    const envelope = createCTBOrderMock.mock.calls[0][0]
    expect(envelope.dateType).toBe("CONFIRMED")
    expect(envelope.lines).toHaveLength(2)
    expect(envelope.lines[0]).toMatchObject({ productNo: "CFM-PCP-0001", description: "Standard - 28 Days" })
    // addOns[].quantity (2) is the catalog option's "servings" label, not a
    // real purchase multiplier, for a product order — the CTB line quantity
    // should always be 1 regardless of that label.
    expect(envelope.lines[1]).toMatchObject({
      productNo: "CFM-ADN-0001",
      quantity: 1,
      unitPrice: 20,
      lineAmount: 20,
    })
  })

  it("sends dateType EDD for a product order with an E.D.D date", async () => {
    const draft = makeProductDraft()
    draft.packageSelection.selectedDateType = "edd"

    await completeCheckoutOrder({ draft, payment: makePayment() })

    expect(createCTBOrderMock.mock.calls[0][0].dateType).toBe("EDD")
  })

  it("sends dateType DELIVERY and omits the package placeholder line for a giftbox order (matches CT Backend's native structure)", async () => {
    await completeCheckoutOrder({ draft: makeGiftboxDraft(), payment: makePayment() })

    const envelope = createCTBOrderMock.mock.calls[0][0]
    expect(envelope.dateType).toBe("DELIVERY")
    expect(envelope.lines).toHaveLength(1)
    expect(envelope.lines[0]).toMatchObject({
      description: "Baby Bliss (Kebaya Gift Box) - Baby Bliss C",
      productNo: "CFM-GFT-BBC",
      quantity: 22,
      unitPrice: 8.5,
    })
    expect(envelope.lines.some((line: { productNo?: string }) => line.productNo === "GIFTBOX-ORDER")).toBe(false)
  })
})

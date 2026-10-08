import { randomUUID } from "node:crypto"
import { orderBackend } from "@/lib/order-backend"
import { upsertOrderRecord } from "@/lib/payment-transactions"
import { createCTBOrder, type CTBOrderLine, type CTBCreateOrderInput } from "@/lib/ct-backend/client"
import {
  listBCItems,
  type BCItem,
  type BCCustomer,
  createBCCustomer,
  findBCCustomerByEmail,
  findBCCustomerByPhone,
  createCPNROrderWithLines,
  listCPNRSpecialReqPresets,
  type CPNRCreateSalesOrderWithLinesInput,
  type CPNRCreateSalesOrderWithLinesRecord,
} from "@/lib/bcClient"

type DeliveryDraft = {
  address: string
  email: string
  floor: string
  fullName: string
  paymentMethod: "full" | "partial"
  paymentType: "credit-card" | "paynow"
  phone: string
  postalCode: string
  unit: string
}

export type CheckoutDraft = {
  draftId: string
  summary: {
    categoryName: string
    optionLabel: string
    totalLabel: string
  }
  packageSelection: {
    categoryId: string | null
    categoryName: string
    durationDays: number
    itemNo: string
    optionId: string | null
    optionLabel: string
    // "delivery" is only ever set by adaptGiftboxDraftToCheckoutDraft() —
    // giftbox orders have no confirmed-start-date/E.D.D. concept, just a flat
    // delivery date. It also signals buildCTBOrderLines() to skip the
    // placeholder package line entirely (see there).
    selectedDateType: "confirmed" | "edd" | "delivery"
    selectedDate: string
    startWith: "lunch" | "dinner"
  }
  bundles: Array<{
    id: string
    itemNo: string
    name: string
    price: number
  }>
  addOns: Array<{
    id: string
    itemNo: string
    label: string
    price: number
    quantity: number
    selections?: Record<string, string>
  }>
  specialRequests: {
    note: string
    riceOption: "WHITE" | "BROWN" | "NO_PREF"
    selected: string[]
  }
  delivery: DeliveryDraft
  pricing: {
    balance: number
    deposit: number
    gstAmount: number
    promoCode: string | null
    promoDiscount: number
    // Tiered shipping fee (src/lib/checkout/shipping-fee.ts). Undefined for
    // partial-payment package orders, where shipping isn't charged yet.
    shippingAmount?: number
    shippingMethod?: "FREE" | "SMALL_ORDER" | "STANDARD"
    subtotal: number
    total: number
  }
}

type VerifiedPayment = {
  amount: string | null
  currency: string | null
  orderReference: string
  paymentStatus: string
  paymentTransactionId: string
  transactionId: string
}

type ProductGroup = "Addon" | "Bundle" | "Package" | "PartnerProduct"

type GroupedBCItem = {
  description: string | null
  displayName: string | null
  number: string
  productGroup: ProductGroup
  unitPrice: number | null
}

export type CheckoutResolvedLine = {
  itemNo: string
  quantity: number
  sourceId: string
  sourceLabel: string
  sourceType: "addon" | "bundle" | "package"
  unitPrice: number | null
}

type CheckoutOrderLinePayload = {
  description?: string
  firstMealSession?: "Dinner" | "Lunch"
  no: string
  portion?: "Dual" | "Single" | "Trial"
  quantity: number
  riceOption?: "Brown" | "Undefined" | "White"
  session?: "Dinner" | "Lunch" | "LunchAndDinner"
  specialRequestNote?: string
  specialRequestPresetCodes?: string[]
  unitPrice?: number
}

export type CompletedCheckoutOrder = {
  customerNo: string
  // "none" — CT Backend mode stores a customer snapshot instead of a BC customer record.
  customerSource: "created" | "matched_email" | "matched_phone" | "none"
  // Set when CT Backend reports this externalDocumentNo was already submitted —
  // callers should skip sending a second confirmation email in that case.
  duplicate?: boolean
  notes: string[]
  orderNo: string | null
  orderReference: string
  orderSystemId: string | null
  paymentTransactionId: string
  paymentStatus: string
  resolvedItems: CheckoutResolvedLine[]
  transactionId: string
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function resolveProductGroup(itemNo: string): ProductGroup | null {
  const upper = itemNo.toUpperCase()
  if (upper.startsWith("CFM-ADN-")) return "Addon"
  if (upper.startsWith("CFM-PCP-")) return "Package"
  if (upper.startsWith("CFM-PPD-")) return "PartnerProduct"
  if (upper.startsWith("CFM-BND-")) return "Bundle"
  return null
}

function toGroupedBCItem(item: BCItem): GroupedBCItem | null {
  if (typeof item.number !== "string" || !item.number.trim()) {
    return null
  }

  const productGroup = resolveProductGroup(item.number)
  if (!productGroup) {
    return null
  }

  return {
    description: typeof item.description === "string" ? item.description.trim() || null : null,
    displayName: typeof item.displayName === "string" ? item.displayName.trim() || null : null,
    number: item.number.trim(),
    productGroup,
    unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : null,
  }
}

/**
 * Resolve a BC item by its exact item number (the source of truth key carried
 * from the catalog through checkout). No fuzzy name/price matching: the frontend
 * already knows the BC item number, so we look it up directly and fail loudly if
 * it is missing or belongs to an unexpected product group.
 */
function findBCItemByNumber(
  items: GroupedBCItem[],
  options: {
    itemNo: string
    sourceLabel: string
    expectedGroups: ProductGroup[]
  }
): GroupedBCItem {
  const target = options.itemNo.trim().toUpperCase()
  const match = items.find((item) => item.number.toUpperCase() === target)

  if (!match) {
    throw new Error(`Unable to resolve a BC item for "${options.sourceLabel}" (itemNo: ${options.itemNo}).`)
  }

  if (!options.expectedGroups.includes(match.productGroup)) {
    throw new Error(
      `BC item "${match.number}" is a ${match.productGroup} but ${options.expectedGroups.join(" or ")} was expected for "${options.sourceLabel}".`
    )
  }

  return match
}

function resolvePackagePortion(categoryId: string | null): "Dual" | "Single" | "Trial" {
  if (categoryId === "dual-meal") return "Dual"
  if (categoryId === "trial-meal") return "Trial"
  return "Single"
}

function resolvePackageSession(
  categoryId: string | null,
  startWith: "lunch" | "dinner"
): "Dinner" | "Lunch" | "LunchAndDinner" {
  if (categoryId === "dual-meal") {
    return "LunchAndDinner"
  }

  return startWith === "dinner" ? "Dinner" : "Lunch"
}

function resolveFirstMealSession(startWith: "lunch" | "dinner"): "Dinner" | "Lunch" {
  return startWith === "dinner" ? "Dinner" : "Lunch"
}

function resolveRiceOption(riceOption: "WHITE" | "BROWN" | "NO_PREF"): "Brown" | "Undefined" | "White" {
  if (riceOption === "WHITE") return "White"
  if (riceOption === "BROWN") return "Brown"
  return "Undefined"
}

function buildAddressLine2(delivery: DeliveryDraft): string | undefined {
  const parts = [delivery.floor.trim(), delivery.unit.trim()].filter((value) => value.length > 0)
  if (parts.length === 0) {
    return undefined
  }

  return parts.join("-")
}

function buildSpecialRequestNote(options: {
  draft: CheckoutDraft
  unmatchedLabels: string[]
}): string | undefined {
  const parts: string[] = []

  if (options.unmatchedLabels.length > 0) {
    parts.push(`Unmapped requests: ${options.unmatchedLabels.join(", ")}`)
  }

  if (options.draft.specialRequests.note.trim()) {
    parts.push(options.draft.specialRequests.note.trim())
  }

  return parts.length > 0 ? parts.join(" | ") : undefined
}

function normalizePresetDescription(value: string): string {
  return normalizeText(value)
    .replace(/^no\s+/, "exclude ")
    .replace(/\bdeliveries\b/g, "delivery")
    .replace(/\bpig s\b/g, "pig")
}

async function resolveSpecialRequestPresetCodes(
  selectedLabels: string[]
): Promise<{ matchedCodes: string[]; unmatchedLabels: string[] }> {
  if (selectedLabels.length === 0) {
    return { matchedCodes: [], unmatchedLabels: [] }
  }

  const presets = await listCPNRSpecialReqPresets(200)
  const normalizedPresetMap = new Map<string, string>()

  for (const preset of presets) {
    if (typeof preset.code !== "string" || typeof preset.description !== "string") {
      continue
    }

    normalizedPresetMap.set(normalizePresetDescription(preset.description), preset.code.trim())
  }

  const matchedCodes: string[] = []
  const unmatchedLabels: string[] = []

  for (const label of selectedLabels) {
    const normalizedLabel = normalizePresetDescription(label)
    const directMatch = normalizedPresetMap.get(normalizedLabel)

    if (directMatch) {
      matchedCodes.push(directMatch)
      continue
    }

    const fuzzyMatch = [...normalizedPresetMap.entries()].find(
      ([description]) => description.includes(normalizedLabel) || normalizedLabel.includes(description)
    )

    if (fuzzyMatch) {
      matchedCodes.push(fuzzyMatch[1])
      continue
    }

    unmatchedLabels.push(label)
  }

  return {
    matchedCodes: [...new Set(matchedCodes)],
    unmatchedLabels,
  }
}

async function resolveCheckoutCustomer(
  draft: CheckoutDraft
): Promise<{ customer: BCCustomer; source: "created" | "matched_email" | "matched_phone" }> {
  const byEmail = await findBCCustomerByEmail(draft.delivery.email)
  if (byEmail?.number) return { customer: byEmail, source: "matched_email" }

  const byPhone = await findBCCustomerByPhone(draft.delivery.phone)
  if (byPhone?.number) return { customer: byPhone, source: "matched_phone" }

  const createdCustomer = await createBCCustomer({
    addressLine1: draft.delivery.address.trim(),
    addressLine2: buildAddressLine2(draft.delivery),
    city: "Singapore",
    country: "SG",
    displayName: draft.delivery.fullName.trim(),
    email: draft.delivery.email.trim(),
    phoneNumber: draft.delivery.phone.trim(),
    postalCode: draft.delivery.postalCode.trim(),
  })

  if (!createdCustomer.number) {
    throw new Error("Business Central created a customer without a customer number.")
  }

  return { customer: createdCustomer, source: "created" }
}

async function loadGroupedBCItems(): Promise<GroupedBCItem[]> {
  const items = await listBCItems(1000, "startswith(number,'CFM-')")

  return items
    .map((item) => toGroupedBCItem(item))
    .filter((item): item is GroupedBCItem => Boolean(item))
}

async function buildResolvedOrderLines(
  draft: CheckoutDraft
): Promise<{
  lines: CheckoutOrderLinePayload[]
  notes: string[]
  noWeekendDeliveries: boolean
  resolvedItems: CheckoutResolvedLine[]
}> {
  const groupedItems = await loadGroupedBCItems()
  const notes: string[] = []

  const packageCandidate = findBCItemByNumber(groupedItems, {
    itemNo: draft.packageSelection.itemNo,
    sourceLabel: `${draft.packageSelection.categoryName} ${draft.packageSelection.optionLabel}`,
    expectedGroups: ["Package"],
  })

  const noWeekendDeliveries = draft.specialRequests.selected.includes("No Weekend Deliveries")
  const presetLabels = draft.specialRequests.selected.filter((s) => s !== "No Weekend Deliveries")
  const { matchedCodes, unmatchedLabels } = await resolveSpecialRequestPresetCodes(presetLabels)

  if (unmatchedLabels.length > 0) {
    notes.push(`Some special requests were not mapped to BC preset codes: ${unmatchedLabels.join(", ")}`)
  }

  const lines: CheckoutOrderLinePayload[] = [
    {
      description: `${draft.packageSelection.categoryName} - ${draft.packageSelection.optionLabel}`,
      firstMealSession: resolveFirstMealSession(draft.packageSelection.startWith),
      no: packageCandidate.number,
      portion: resolvePackagePortion(draft.packageSelection.categoryId),
      quantity: 1,
      riceOption: resolveRiceOption(draft.specialRequests.riceOption),
      session: resolvePackageSession(draft.packageSelection.categoryId, draft.packageSelection.startWith),
      specialRequestNote: buildSpecialRequestNote({
        draft,
        unmatchedLabels,
      }),
      specialRequestPresetCodes: matchedCodes.length > 0 ? matchedCodes : undefined,
      unitPrice: packageCandidate.unitPrice ?? undefined,
    },
  ]

  const resolvedItems: CheckoutResolvedLine[] = [
    {
      itemNo: packageCandidate.number,
      quantity: 1,
      sourceId: draft.packageSelection.optionId ?? draft.packageSelection.categoryId ?? "package",
      sourceLabel: `${draft.packageSelection.categoryName} - ${draft.packageSelection.optionLabel}`,
      sourceType: "package",
      unitPrice: packageCandidate.unitPrice,
    },
  ]

  for (const bundle of draft.bundles) {
    const item = findBCItemByNumber(groupedItems, {
      itemNo: bundle.itemNo,
      sourceLabel: bundle.name,
      expectedGroups: ["Bundle", "PartnerProduct"],
    })

    lines.push({
      description: bundle.name,
      no: item.number,
      quantity: 1,
      unitPrice: item.unitPrice ?? undefined,
    })
    resolvedItems.push({
      itemNo: item.number,
      quantity: 1,
      sourceId: bundle.id,
      sourceLabel: bundle.name,
      sourceType: "bundle",
      unitPrice: item.unitPrice,
    })
  }

  for (const addOn of draft.addOns) {
    const item = findBCItemByNumber(groupedItems, {
      itemNo: addOn.itemNo,
      sourceLabel: addOn.label,
      expectedGroups: ["Addon", "PartnerProduct"],
    })

    // addOn.quantity is the catalog option's "servings" label (e.g. "3
    // servings" for one $35 pack), not a real purchase multiplier — see
    // verify-order-pricing.ts. Always order 1 of the pack, same as bundles above.
    lines.push({
      description: addOn.label,
      no: item.number,
      quantity: 1,
      unitPrice: item.unitPrice ?? undefined,
    })
    resolvedItems.push({
      itemNo: item.number,
      quantity: 1,
      sourceId: addOn.id,
      sourceLabel: addOn.label,
      sourceType: "addon",
      unitPrice: item.unitPrice,
    })
  }

  return { lines, notes, noWeekendDeliveries, resolvedItems }
}

function buildBCOrderPayload(options: {
  customerNo: string
  draft: CheckoutDraft
  lines: CheckoutOrderLinePayload[]
  noWeekendDeliveries: boolean
  payment: VerifiedPayment
}): {
  payload: CPNRCreateSalesOrderWithLinesInput
} {
  const requestedDeliveryDate = options.draft.packageSelection.selectedDate
  const dateType = options.draft.packageSelection.selectedDateType === "edd" ? "EDD" : "Confirmed"

  const { delivery } = options.draft
  const shipToAddress2 = buildAddressLine2(delivery)

  return {
    payload: {
      billToCustomerNo: options.customerNo,
      confirmedStartDate: dateType === "Confirmed" ? requestedDeliveryDate : undefined,
      currencyCode: options.payment.currency ?? "SGD",
      dateType,
      eddDate: dateType === "EDD" ? requestedDeliveryDate : undefined,
      externalDocumentNo: options.payment.orderReference,
      orderLinesJson: JSON.stringify(options.lines),
      orderSource: "Website",
      promoCode: options.draft.pricing.promoCode?.trim().toUpperCase() || undefined,
      promisedDeliveryDate: requestedDeliveryDate,
      requestId: randomUUID(),
      requestedDeliveryDate,
      noWeekendDeliveries: options.noWeekendDeliveries || undefined,
      sellToCustomerNo: options.customerNo,
      shipToName: delivery.fullName.trim(),
      shipToAddress: delivery.address.trim(),
      shipToAddress2: shipToAddress2 || undefined,
      shipToPostCode: delivery.postalCode.trim(),
      shipToContact: delivery.fullName.trim(),
      shipToPhoneNo: delivery.phone.trim(),
    },
  }
}

function requireOrderNo(order: CPNRCreateSalesOrderWithLinesRecord): string {
  if (!order.orderNo?.trim()) {
    throw new Error("Business Central did not return an order number.")
  }

  return order.orderNo
}

// ----------------------------------------------------------------------
// BC fulfilment (original flow) — OFF-WIRED while production BC is not ready.
// Kept intact behind the ORDER_BACKEND flag: set ORDER_BACKEND=bc to restore
// BC customer + order creation and the local dev_confinement mirror.
async function completeCheckoutOrderBC(options: {
  draft: CheckoutDraft
  payment: VerifiedPayment
}): Promise<CompletedCheckoutOrder> {
  if (options.payment.paymentStatus !== "AUTHORIZED") {
    throw new Error(`Payment is not authorized. Current status: ${options.payment.paymentStatus}`)
  }

  const { customer, source } = await resolveCheckoutCustomer(options.draft)
  if (!customer.number) {
    throw new Error("Business Central customer number is missing.")
  }

  const { lines, notes, noWeekendDeliveries, resolvedItems } = await buildResolvedOrderLines(options.draft)
  const { payload } = buildBCOrderPayload({
    customerNo: customer.number,
    draft: options.draft,
    lines,
    noWeekendDeliveries,
    payment: options.payment,
  })
  console.log("[checkout] BC payload:", JSON.stringify(payload, null, 2))
  const createdOrder = await createCPNROrderWithLines(payload)
  const orderNo = requireOrderNo(createdOrder)

  await upsertOrderRecord({
    customerNo: customer.number,
    dateType: payload.dateType,
    externalDocumentNo: payload.externalDocumentNo,
    orderNo,
    orderSource: payload.orderSource,
    paymentTransactionId: options.payment.paymentTransactionId,
  })

  return {
    customerNo: customer.number,
    customerSource: source,
    notes,
    orderNo,
    orderReference: options.payment.orderReference,
    orderSystemId: createdOrder.orderSystemId?.trim() || null,
    paymentTransactionId: options.payment.paymentTransactionId,
    paymentStatus: options.payment.paymentStatus,
    resolvedItems,
    transactionId: options.payment.transactionId,
  }
}

// ----------------------------------------------------------------------
// CT Backend fulfilment (default while BC is not ready). No BC calls at all:
// lines are built from the draft (prices as charged), and the whole order is
// pushed to CT Backend, which assigns the WEB-YYYY-NNNNN order number and
// links the order to the payment recorded at confirm time (dev_ctbackend).

function buildCTBOrderLines(draft: CheckoutDraft): {
  lines: CTBOrderLine[]
  noWeekendDelivery: boolean
  resolvedItems: CheckoutResolvedLine[]
} {
  // Giftbox orders have no real "package" — adaptGiftboxDraftToCheckoutDraft()
  // only fills packageSelection with placeholder values to satisfy this shared
  // shape, so CT Backend should never see a line for it (confirmed against
  // CT Backend's own native order structure, which has no such line either).
  const isGiftboxOrder = draft.packageSelection.selectedDateType === "delivery"

  // draft.addOns[].quantity means different things per order type: for a
  // giftbox order it's a real purchase multiplier (how many of that item),
  // but for a package order it's just the catalog option's "servings" label
  // (e.g. "3 servings" for one $35 pack) — see verify-order-pricing.ts. Only
  // multiply by it for giftbox orders, or a package order's add-on line ends
  // up billed at 3x/5x its actual price in the CT Backend order breakdown.
  const addOnOrderedQty = (addOn: CheckoutDraft["addOns"][number]): number =>
    isGiftboxOrder ? addOn.quantity : 1

  const bundlesTotal = draft.bundles.reduce((sum, bundle) => sum + bundle.price, 0)
  const addOnsTotal = draft.addOns.reduce((sum, addOn) => sum + addOn.price * addOnOrderedQty(addOn), 0)
  // The draft carries no package price on its own — derive it from the charged subtotal.
  const packagePrice = Math.max(0, draft.pricing.subtotal - bundlesTotal - addOnsTotal)

  const noWeekendDeliveries = draft.specialRequests.selected.includes("No Weekend Deliveries")
  const specialRequestLabels = draft.specialRequests.selected.filter((label) => label !== "No Weekend Deliveries")
  const packageDescription = `${draft.packageSelection.categoryName} - ${draft.packageSelection.optionLabel}`

  const lines: CTBOrderLine[] = isGiftboxOrder
    ? []
    : [
        {
          description: packageDescription,
          lineAmount: packagePrice,
          productNo: draft.packageSelection.itemNo,
          quantity: 1,
          selections: {
            durationDays: draft.packageSelection.durationDays,
            firstMealSession: resolveFirstMealSession(draft.packageSelection.startWith),
            portion: resolvePackagePortion(draft.packageSelection.categoryId),
            riceOption: resolveRiceOption(draft.specialRequests.riceOption),
            session: resolvePackageSession(draft.packageSelection.categoryId, draft.packageSelection.startWith),
            specialRequests: specialRequestLabels,
          },
          unitPrice: packagePrice,
        },
      ]

  const resolvedItems: CheckoutResolvedLine[] = isGiftboxOrder
    ? []
    : [
        {
          itemNo: draft.packageSelection.itemNo,
          quantity: 1,
          sourceId: draft.packageSelection.optionId ?? draft.packageSelection.categoryId ?? "package",
          sourceLabel: packageDescription,
          sourceType: "package",
          unitPrice: packagePrice,
        },
      ]

  for (const bundle of draft.bundles) {
    lines.push({
      description: bundle.name,
      lineAmount: bundle.price,
      productNo: bundle.itemNo,
      quantity: 1,
      unitPrice: bundle.price,
    })
    resolvedItems.push({
      itemNo: bundle.itemNo,
      quantity: 1,
      sourceId: bundle.id,
      sourceLabel: bundle.name,
      sourceType: "bundle",
      unitPrice: bundle.price,
    })
  }

  for (const addOn of draft.addOns) {
    const quantity = addOnOrderedQty(addOn)
    lines.push({
      description: addOn.label,
      lineAmount: addOn.price * quantity,
      productNo: addOn.itemNo,
      quantity,
      selections: addOn.selections,
      unitPrice: addOn.price,
    })
    resolvedItems.push({
      itemNo: addOn.itemNo,
      quantity,
      sourceId: addOn.id,
      sourceLabel: addOn.label,
      sourceType: "addon",
      unitPrice: addOn.price,
    })
  }

  return { lines, noWeekendDelivery: noWeekendDeliveries, resolvedItems }
}

async function completeCheckoutOrderCTB(options: {
  draft: CheckoutDraft
  payment: VerifiedPayment
}): Promise<CompletedCheckoutOrder> {
  // Defense in depth — the route already gates on PAID, and CT Backend
  // enforces it again server-side before creating the order.
  if (options.payment.paymentStatus !== "PAID") {
    throw new Error(`Payment is not paid. Current status: ${options.payment.paymentStatus}`)
  }

  const { draft, payment } = options
  const { lines, noWeekendDelivery, resolvedItems } = buildCTBOrderLines(draft)

  const noteParts: string[] = []
  if (draft.specialRequests.note.trim()) {
    noteParts.push(draft.specialRequests.note.trim())
  }
  if (draft.delivery.paymentMethod === "partial") {
    noteParts.push(
      `Partial payment: deposit $${draft.pricing.deposit.toFixed(2)}, balance $${draft.pricing.balance.toFixed(2)}`
    )
  }

  const envelope: CTBCreateOrderInput = {
    customer: {
      email: draft.delivery.email.trim(),
      name: draft.delivery.fullName.trim(),
      phone: draft.delivery.phone.trim(),
    },
    dateType:
      draft.packageSelection.selectedDateType === "edd"
        ? "EDD"
        : draft.packageSelection.selectedDateType === "delivery"
          ? "DELIVERY"
          : "CONFIRMED",
    delivery: {
      address: draft.delivery.address.trim(),
      contactName: draft.delivery.fullName.trim(),
      phone: draft.delivery.phone.trim(),
      postalCode: draft.delivery.postalCode.trim(),
      unitNo: buildAddressLine2(draft.delivery),
    },
    deliveryDate: draft.packageSelection.selectedDate,
    externalDocumentNo: payment.orderReference,
    lines,
    notes: noteParts.length > 0 ? noteParts.join(" | ") : undefined,
    noWeekendDelivery,
    // orderNo omitted on purpose — CT Backend assigns the WEB-YYYY-NNNNN number.
    payment: {
      amount: payment.amount ?? undefined,
      currency: payment.currency ?? undefined,
      orderReference: payment.orderReference,
      status: payment.paymentStatus,
      transactionId: payment.transactionId,
    },
    // Exact case: CT Backend re-evaluates the promo when recording the order,
    // and an upper-cased mixed-case code would silently fail that lookup —
    // leaving the customer charged the discounted amount against an order with
    // no discount on it.
    promoCode: draft.pricing.promoCode?.trim() || undefined,
    totals: {
      discountAmount: draft.pricing.promoDiscount,
      gstAmount: draft.pricing.gstAmount,
      shippingAmount: draft.pricing.shippingAmount,
      shippingMethod: draft.pricing.shippingMethod,
      subtotal: draft.pricing.subtotal,
      totalAmount: draft.pricing.total,
    },
  }

  const createdOrder = await createCTBOrder(envelope)

  return {
    customerNo: "",
    customerSource: "none",
    duplicate: createdOrder.duplicate,
    notes: [],
    orderNo: createdOrder.orderNo,
    orderReference: payment.orderReference,
    orderSystemId: null,
    paymentTransactionId: payment.paymentTransactionId,
    paymentStatus: payment.paymentStatus,
    resolvedItems,
    transactionId: payment.transactionId,
  }
}

// ----------------------------------------------------------------------
// Entry point used by /api/checkout/complete. CT Backend fulfils orders by
// default; set ORDER_BACKEND=bc to restore the original Business Central flow.
export async function completeCheckoutOrder(options: {
  draft: CheckoutDraft
  payment: VerifiedPayment
}): Promise<CompletedCheckoutOrder> {
  if (orderBackend() === "bc") {
    return completeCheckoutOrderBC(options)
  }

  return completeCheckoutOrderCTB(options)
}


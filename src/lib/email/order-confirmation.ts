import type { CheckoutDraft, CompletedCheckoutOrder } from "@/lib/checkout/complete-order"

import dayjs from "dayjs"
import { companyInfo } from "@/layouts/main/data"

const BRAND_COLOR = "#F27B96"

const money = new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" })

export type OrderConfirmationEmail = {
  html: string
  subject: string
  text: string
}

function formatDeliveryDate(packageSelection: CheckoutDraft["packageSelection"]): string {
  const date = dayjs(packageSelection.selectedDate).format("D MMMM YYYY")

  // Giftbox orders have no confirmed-start-date/E.D.D. or lunch/dinner
  // concept — just a flat delivery date.
  if (packageSelection.selectedDateType === "delivery") {
    return date
  }

  const dateTypeLabel = packageSelection.selectedDateType === "edd" ? "E.D.D." : "Confirmed start date"
  const sessionLabel = packageSelection.startWith === "dinner" ? "Dinner" : "Lunch"

  return `${date} (${dateTypeLabel}, starting with ${sessionLabel})`
}

function buildLineItemRows(
  draft: CheckoutDraft
): Array<{ label: string; unitPrice: string; amount: string }> {
  // Same isGiftboxOrder distinction as buildCTBOrderLines() in complete-order.ts —
  // addOns[].quantity is a real purchase multiplier for giftbox orders, but for
  // package orders it's just the catalog option's "servings" label, already
  // folded into `addOn.label` (e.g. "Pig's Trotter (3 servings)"), not a count
  // of packs bought.
  const isGiftboxOrder = draft.packageSelection.selectedDateType === "delivery"

  // Giftbox orders have no real "package" (adaptGiftboxDraftToCheckoutDraft()
  // only fills packageSelection/summary with placeholder values) — showing a
  // "Giftbox Order" row valued at the order's grand total here would double-
  // count against every item line below it. buildCTBOrderLines() in
  // complete-order.ts skips this same placeholder line for the same reason.
  const rows: Array<{ label: string; unitPrice: string; amount: string }> = isGiftboxOrder
    ? []
    : [
        {
          label: `${draft.packageSelection.categoryName} - ${draft.packageSelection.optionLabel}`,
          unitPrice: draft.summary.totalLabel,
          amount: draft.summary.totalLabel,
        },
      ]

  for (const bundle of draft.bundles) {
    rows.push({
      label: bundle.name,
      unitPrice: money.format(bundle.price),
      amount: money.format(bundle.price),
    })
  }

  for (const addOn of draft.addOns) {
    rows.push(
      isGiftboxOrder
        ? {
            label: `${addOn.label} x${addOn.quantity}`,
            unitPrice: money.format(addOn.price),
            amount: money.format(addOn.price * addOn.quantity),
          }
        : { label: addOn.label, unitPrice: money.format(addOn.price), amount: money.format(addOn.price) }
    )
  }

  return rows
}

function buildSpecialRequestLines(draft: CheckoutDraft): string[] {
  const lines: string[] = [...draft.specialRequests.selected]

  if (draft.specialRequests.riceOption !== "NO_PREF") {
    lines.push(draft.specialRequests.riceOption === "WHITE" ? "All White Rice" : "All Brown Rice")
  }

  if (draft.specialRequests.note.trim()) {
    lines.push(`Note: ${draft.specialRequests.note.trim()}`)
  }

  return lines
}

export function buildOrderConfirmationEmail(input: {
  completedOrder: CompletedCheckoutOrder
  draft: CheckoutDraft
}): OrderConfirmationEmail {
  const { completedOrder, draft } = input
  const orderLabel = completedOrder.orderNo ?? completedOrder.orderReference
  const subject = `Chilli Padi Confinement - Order Confirmation - ${orderLabel}`

  const lineItemRows = buildLineItemRows(draft)
  const specialRequestLines = buildSpecialRequestLines(draft)
  const addressLine2 = [draft.delivery.floor, draft.delivery.unit].filter(Boolean).join("-")

  const pricingRows: Array<{ label: string; value: string }> = [
    { label: "Subtotal", value: money.format(draft.pricing.subtotal) },
  ]
  if (draft.pricing.promoCode) {
    pricingRows.push({
      label: `Discount (${draft.pricing.promoCode})`,
      value: `- ${money.format(draft.pricing.promoDiscount)}`,
    })
  }
  pricingRows.push({ label: "GST (9% incl.)", value: money.format(draft.pricing.gstAmount) })
  pricingRows.push({ label: "Total", value: money.format(draft.pricing.total) })
  if (draft.pricing.shippingAmount !== undefined) {
    pricingRows.push({
      label: "Shipping",
      value: draft.pricing.shippingAmount === 0 ? "Free" : money.format(draft.pricing.shippingAmount),
    })
    pricingRows.push({
      label: "Grand Total",
      value: money.format(draft.pricing.total + draft.pricing.shippingAmount),
    })
  }
  if (draft.pricing.deposit > 0) {
    pricingRows.push({ label: "Deposit Paid", value: money.format(draft.pricing.deposit) })
    pricingRows.push({ label: "Balance Due", value: money.format(draft.pricing.balance) })
  }

  const html = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #212B36;">
  <div style="background: ${BRAND_COLOR}; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Order Confirmation</h1>
  </div>
  <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
    <p>Hi ${draft.delivery.fullName},</p>
    <p>Thank you for your order. Here are your order details:</p>

    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 4px 0; color: #637381;">Order Number</td><td style="padding: 4px 0; text-align: right; font-weight: 600;">${orderLabel}</td></tr>
      <tr><td style="padding: 4px 0; color: #637381;">Order Reference</td><td style="padding: 4px 0; text-align: right;">${completedOrder.orderReference}</td></tr>
    </table>

    <h3 style="color: ${BRAND_COLOR}; border-bottom: 1px solid #eee; padding-bottom: 8px;">Order Details</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 4px 0; color: #637381; font-size: 12px;">Item</td>
        <td style="padding: 4px 0; color: #637381; font-size: 12px; text-align: right;">Unit Price</td>
        <td style="padding: 4px 0; color: #637381; font-size: 12px; text-align: right;">Amount</td>
      </tr>
      ${lineItemRows
        .map(
          (row) =>
            `<tr><td style="padding: 4px 0;">${row.label}</td><td style="padding: 4px 0; text-align: right; color: #637381;">${row.unitPrice}</td><td style="padding: 4px 0; text-align: right; font-weight: 600;">${row.amount}</td></tr>`
        )
        .join("")}
    </table>

    <p style="margin: 12px 0 4px; color: #637381;">Delivery Date</p>
    <p style="margin: 0;">${formatDeliveryDate(draft.packageSelection)}</p>

    ${
      specialRequestLines.length > 0
        ? `<h3 style="color: ${BRAND_COLOR}; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 20px;">Special Requests</h3>
           <ul style="margin: 0; padding-left: 20px;">${specialRequestLines.map((line) => `<li>${line}</li>`).join("")}</ul>`
        : ""
    }

    <h3 style="color: ${BRAND_COLOR}; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 20px;">Delivery Details</h3>
    <p style="margin: 0;">
      ${draft.delivery.fullName}<br />
      ${draft.delivery.address}${addressLine2 ? `, ${addressLine2}` : ""}<br />
      Singapore ${draft.delivery.postalCode}<br />
      ${draft.delivery.phone}
    </p>

    <h3 style="color: ${BRAND_COLOR}; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 20px;">Pricing</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${pricingRows
        .map(
          (row) =>
            `<tr><td style="padding: 4px 0;">${row.label}</td><td style="padding: 4px 0; text-align: right;">${row.value}</td></tr>`
        )
        .join("")}
    </table>

    <p style="margin-top: 24px; color: #637381; font-size: 13px;">
      If you have any questions about your order, please contact us at
      <a href="mailto:${companyInfo.email}" style="color: ${BRAND_COLOR};">${companyInfo.email}</a>
      or call ${companyInfo.phone}.
    </p>
    <p style="color: #919eab; font-size: 12px;">${companyInfo.name} &middot; ${companyInfo.address}</p>
  </div>
</div>
`.trim()

  const text = [
    "Order Confirmation",
    "",
    `Hi ${draft.delivery.fullName},`,
    "Thank you for your order. Here are your order details:",
    "",
    `Order Number: ${orderLabel}`,
    `Order Reference: ${completedOrder.orderReference}`,
    "",
    "=== ORDER DETAILS ===",
    ...lineItemRows.map((row) => `${row.label} (Unit Price: ${row.unitPrice}): ${row.amount}`),
    "",
    `Delivery Date: ${formatDeliveryDate(draft.packageSelection)}`,
    ...(specialRequestLines.length > 0
      ? ["", "=== SPECIAL REQUESTS ===", ...specialRequestLines.map((line) => `- ${line}`)]
      : []),
    "",
    "=== DELIVERY DETAILS ===",
    draft.delivery.fullName,
    `${draft.delivery.address}${addressLine2 ? `, ${addressLine2}` : ""}`,
    `Singapore ${draft.delivery.postalCode}`,
    draft.delivery.phone,
    "",
    "=== PRICING ===",
    ...pricingRows.map((row) => `${row.label}: ${row.value}`),
    "",
    `Questions? Contact us at ${companyInfo.email} or call ${companyInfo.phone}.`,
    `${companyInfo.name} - ${companyInfo.address}`,
  ].join("\n")

  return { html, subject, text }
}

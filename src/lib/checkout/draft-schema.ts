import { z } from "zod"

const draftLineSchema = z.object({
  id: z.string({ error: "Line item id is required" }).trim().min(1, "Line item id is required"),
  itemNo: z.string({ error: "Line item itemNo is required" }).trim().min(1, "Line item itemNo is required"),
  price: z.number({ error: "Line item price is required" }).nonnegative("Line item price must be non-negative"),
})

const deliverySchema = z.object({
  address: z.string({ error: "draft.delivery.address is required" }).trim().min(1, "draft.delivery.address is required"),
  email: z
    .string({ error: "draft.delivery.email is required" })
    .trim()
    .email("draft.delivery.email must be a valid email address"),
  floor: z.string().trim(),
  fullName: z.string({ error: "draft.delivery.fullName is required" }).trim().min(1, "draft.delivery.fullName is required"),
  paymentMethod: z.enum(["full", "partial"], { error: "draft.delivery.paymentMethod is invalid" }),
  paymentType: z.enum(["credit-card", "paynow"], { error: "draft.delivery.paymentType is invalid" }),
  phone: z.string({ error: "draft.delivery.phone is required" }).trim().min(1, "draft.delivery.phone is required"),
  postalCode: z
    .string({ error: "draft.delivery.postalCode is required" })
    .trim()
    .min(1, "draft.delivery.postalCode is required"),
  unit: z.string().trim(),
})

export const checkoutDraftSchema = z.object({
  addOns: z.array(
    draftLineSchema.extend({
      label: z.string({ error: "draft.addOns[].label is required" }).trim().min(1, "draft.addOns[].label is required"),
      quantity: z
        .number({ error: "draft.addOns[].quantity is required" })
        .int("draft.addOns[].quantity must be an integer")
        .positive("draft.addOns[].quantity must be greater than 0"),
    })
  ),
  bundles: z.array(
    draftLineSchema.extend({
      name: z.string({ error: "draft.bundles[].name is required" }).trim().min(1, "draft.bundles[].name is required"),
    })
  ),
  delivery: deliverySchema,
  draftId: z.string({ error: "draft.draftId is required" }).trim().min(1, "draft.draftId is required"),
  packageSelection: z.object({
    categoryId: z.string().trim().nullable(),
    categoryName: z.string({ error: "draft.packageSelection.categoryName is required" }).trim().min(1),
    durationDays: z
      .number({ error: "draft.packageSelection.durationDays is required" })
      .int("draft.packageSelection.durationDays must be an integer")
      .positive("draft.packageSelection.durationDays must be greater than 0"),
    itemNo: z
      .string({ error: "draft.packageSelection.itemNo is required" })
      .trim()
      .min(1, "draft.packageSelection.itemNo is required"),
    optionId: z.string().trim().nullable(),
    optionLabel: z.string({ error: "draft.packageSelection.optionLabel is required" }).trim().min(1),
    selectedDate: z
      .string({ error: "draft.packageSelection.selectedDate is required" })
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "draft.packageSelection.selectedDate must be in YYYY-MM-DD format"),
    selectedDateType: z.enum(["confirmed", "edd"], {
      error: "draft.packageSelection.selectedDateType must be confirmed or edd",
    }),
    startWith: z.enum(["lunch", "dinner"], {
      error: "draft.packageSelection.startWith must be lunch or dinner",
    }),
  }),
  pricing: z.object({
    balance: z.number().nonnegative(),
    deposit: z.number().nonnegative(),
    gstAmount: z.number().nonnegative(),
    promoCode: z.string().trim().nullable(),
    promoDiscount: z.number().nonnegative(),
    // Tiered shipping fee — omitted for partial-payment orders (see
    // src/lib/checkout/shipping-fee.ts).
    shippingAmount: z.number().nonnegative().optional(),
    shippingMethod: z.enum(["FREE", "SMALL_ORDER", "STANDARD"]).optional(),
    subtotal: z.number().nonnegative(),
    total: z.number().positive(),
  }),
  specialRequests: z.object({
    note: z.string().trim(),
    riceOption: z.enum(["WHITE", "BROWN", "NO_PREF"], {
      error: "draft.specialRequests.riceOption is invalid",
    }),
    selected: z.array(z.string().trim().min(1)),
  }),
  summary: z.object({
    categoryName: z.string().trim().min(1),
    optionLabel: z.string().trim().min(1),
    totalLabel: z.string().trim().min(1),
  }),
})

export type CheckoutDraftInput = z.infer<typeof checkoutDraftSchema>

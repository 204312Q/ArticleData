import { z } from "zod"

const dateLiteralSchema = z
  .string({ error: "Date must be a string in YYYY-MM-DD format" })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")

const giftboxOptionSchema = z.object({
  groupCode: z.string({ error: "groupCode is required" }).trim().min(1, "groupCode is required"),
  valueCode: z.string({ error: "valueCode is required" }).trim().min(1, "valueCode is required"),
  freeText: z.string().optional(),
})

const giftboxLineSchema = z.object({
  itemNo: z.string({ error: "itemNo is required" }).trim().min(1, "itemNo is required"),
  quantity: z.number({ error: "quantity is required" }).positive("quantity must be greater than 0"),
  unitPrice: z.number().optional(),
  options: z.array(giftboxOptionSchema).optional(),
})

export const createGiftboxOrderSchema = z.object({
  requestId: z.string().trim().optional(),
  sellToCustomerNo: z
    .string({ error: "sellToCustomerNo is required" })
    .trim()
    .min(1, "sellToCustomerNo is required"),
  billToCustomerNo: z.string().trim().optional(),
  externalDocumentNo: z.string().trim().optional(),
  requestedDeliveryDate: dateLiteralSchema.optional(),
  promoCode: z.string().trim().optional(),
  lines: z.array(giftboxLineSchema).min(1, "lines must contain at least one item"),
})

export type CreateGiftboxOrderInput = z.infer<typeof createGiftboxOrderSchema>

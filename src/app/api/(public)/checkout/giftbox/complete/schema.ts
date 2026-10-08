import { z } from "zod"
import { giftboxDraftSchema } from "@/lib/checkout/adapt-giftbox-draft"

export const completeGiftboxCheckoutSchema = z.object({
  draft: giftboxDraftSchema,
  orderReference: z.string({ error: "orderReference is required" }).trim().min(1, "orderReference is required"),
})

export type CompleteGiftboxCheckoutInput = z.infer<typeof completeGiftboxCheckoutSchema>

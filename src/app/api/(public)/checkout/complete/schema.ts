import { z } from "zod"
import { checkoutDraftSchema } from "@/lib/checkout/draft-schema"

export const completeCheckoutSchema = z.object({
  draft: checkoutDraftSchema,
  orderReference: z.string({ error: "orderReference is required" }).trim().min(1, "orderReference is required"),
})

export type CompleteCheckoutInput = z.infer<typeof completeCheckoutSchema>

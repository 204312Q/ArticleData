import { z } from "zod"

export const confirmPaymentSchema = z
  .object({
    orderReference: z.string({ error: "orderReference is required" }).trim().min(1, "orderReference is required"),
    resultJwt: z.string().trim().min(1).optional(),
    transientToken: z.string().trim().min(1).optional(),
    paymentIntentId: z.string().trim().min(1).optional(),
    stripeSessionId: z.string().trim().min(1).optional(),
  })
  .refine(
    (data) => (data.resultJwt && data.transientToken) || data.paymentIntentId || data.stripeSessionId,
    {
      error: "Either resultJwt + transientToken, paymentIntentId, or stripeSessionId is required",
    }
  )

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>

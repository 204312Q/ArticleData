import { z } from "zod"

export const payLabConfirmSchema = z.object({
  orderReference: z
    .string({ error: "orderReference is required" })
    .trim()
    .min(1, "orderReference is required"),
  resultJwt: z.string({ error: "resultJwt is required" }).trim().min(1, "resultJwt is required"),
  transientToken: z
    .string({ error: "transientToken is required" })
    .trim()
    .min(1, "transientToken is required"),
})

export type PayLabConfirmInput = z.infer<typeof payLabConfirmSchema>

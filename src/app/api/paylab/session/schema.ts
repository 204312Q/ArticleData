import { z } from "zod"

// SAMSUNGPAY is deliberately absent: it requires Samsung Internet on Samsung
// hardware, so it can never render on the machines this lab is driven from.
export const PAY_LAB_PAYMENT_TYPES = ["PANENTRY", "CLICKTOPAY", "GOOGLEPAY", "APPLEPAY"] as const

export const payLabSessionSchema = z.object({
  // Presenting one wallet at a time is the whole point of the lab — a failure is
  // only diagnostic if you know which type produced it.
  allowedPaymentTypes: z
    .array(z.enum(PAY_LAB_PAYMENT_TYPES), { error: "allowedPaymentTypes is required" })
    .min(1, "Select at least one payment type"),
  amount: z
    .string({ error: "amount is required" })
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "amount must be a valid monetary value"),
  currency: z
    .string({ error: "currency is required" })
    .trim()
    .length(3, "currency must be a 3-letter ISO code")
    .transform((value) => value.toUpperCase()),
  email: z
    .string({ error: "email is required" })
    .trim()
    .email("email must be a valid email address"),
  phoneNumber: z
    .string({ error: "phoneNumber is required" })
    .trim()
    .min(1, "phoneNumber is required"),
})

export type PayLabSessionInput = z.infer<typeof payLabSessionSchema>

import { z } from "zod"
import { giftboxDraftSchema } from "@/lib/checkout/adapt-giftbox-draft"

const amountSchema = z
  .union([
    z
      .number({ error: "amount is required" })
      .finite("amount must be a valid number")
      .positive("amount must be greater than 0"),
    z
      .string({ error: "amount is required" })
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "amount must be a valid monetary value"),
  ])
  .transform((value) => {
    if (typeof value === "number") {
      return value.toFixed(2)
    }

    const normalized = Number(value)
    return normalized.toFixed(2)
  })

export const createGiftboxPaymentSessionSchema = z.object({
  amount: amountSchema,
  currency: z
    .string({ error: "currency is required" })
    .trim()
    .length(3, "currency must be a 3-letter ISO code")
    .transform((value) => value.toUpperCase()),
  customer: z.object({
    email: z
      .string({ error: "customer.email is required" })
      .trim()
      .email("customer.email must be a valid email address"),
    phoneNumber: z.string({ error: "customer.phoneNumber is required" }).trim().min(1, "customer.phoneNumber is required"),
  }),
  // Only read by the Stripe branch of this route, to stash in the Checkout
  // Session's metadata — the CyberSource branch never touches this.
  draft: giftboxDraftSchema,
  orderReference: z.string({ error: "orderReference is required" }).trim().min(1, "orderReference is required"),
})

export type CreateGiftboxPaymentSessionInput = z.infer<typeof createGiftboxPaymentSessionSchema>

import { z } from "zod"

// POST body — the storefront sends the promo code plus its current cart lines
// so item-scoped promos can be evaluated against the selected products.
// `subtotal` remains as a fallback for callers that don't send lines.
export const validatePromoBodySchema = z.object({
  code: z.string({ error: "code is required" }).trim().min(1, "code is required"),
  customerEmail: z.string().trim().email("customerEmail must be a valid email").optional(),
  customerPhone: z.string().trim().optional(),
  lines: z
    .array(
      z.object({
        lineAmount: z.number({ error: "lines[].lineAmount is required" }).nonnegative(),
        productNo: z.string().trim().optional(),
      })
    )
    .optional(),
  subtotal: z.number().nonnegative().optional(),
})

export type ValidatePromoBody = z.infer<typeof validatePromoBodySchema>

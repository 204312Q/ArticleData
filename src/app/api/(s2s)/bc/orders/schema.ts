import { z } from "zod"

const dateLiteralSchema = z
  .string({ error: "Date must be a string in YYYY-MM-DD format" })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")

const orderLineSchema = z
  .object({
    no: z.string({ error: "Line item no is required" }).trim().min(1, "Line item no is required"),
    quantity: z.number({ error: "Line quantity is required" }).positive("Line quantity must be greater than 0"),
    unitPrice: z.number().optional(),
    description: z.string().optional(),
    description2: z.string().optional(),
    portion: z.enum(["Undefined", "Dual", "Single", "Trial"]).optional(),
    session: z.enum(["Undefined", "Lunch", "Dinner", "LunchAndDinner"]).optional(),
    firstMealSession: z.enum(["Undefined", "Lunch", "Dinner"]).optional(),
    riceOption: z.enum(["Undefined", "Brown", "White", "Mixed"]).optional(),
    specialRequestPreset: z.string().optional(),
    specialRequestPresetCodes: z.array(z.string().trim().min(1)).optional(),
    specialRequestNote: z.string().optional(),
  })
  .superRefine((line, ctx) => {
    if (line.portion === "Dual") {
      if (!line.firstMealSession || line.firstMealSession === "Undefined") {
        ctx.addIssue({
          code: "custom",
          message: "firstMealSession is required when portion is Dual",
          path: ["firstMealSession"],
        })
      }
    }

    if (line.portion === "Single" || line.portion === "Trial") {
      if (!line.session || line.session === "Undefined" || line.session === "LunchAndDinner") {
        ctx.addIssue({
          code: "custom",
          message: "session must be Lunch or Dinner when portion is Single or Trial",
          path: ["session"],
        })
      }
    }
  })

export const createOrderSchema = z
  .object({
    requestId: z.string().trim().optional(),
    paymentTransactionId: z.string().trim().optional().describe("UUID of PaymentTransaction from /api/payments/confirm"),
    sellToCustomerNo: z.string({ error: "sellToCustomerNo is required" }).trim().min(1, "sellToCustomerNo is required"),
    billToCustomerNo: z.string().trim().optional(),
    currencyCode: z.string().trim().optional(),
    shipToCode: z.string().trim().optional(),
    requestedDeliveryDate: dateLiteralSchema.optional(),
    promisedDeliveryDate: dateLiteralSchema.optional(),
    externalDocumentNo: z.string().trim().min(1, "externalDocumentNo cannot be empty").optional(),
    dateType: z.enum(["EDD", "Confirmed"], { error: "dateType must be EDD or Confirmed" }),
    eddDate: dateLiteralSchema.optional(),
    confirmedStartDate: dateLiteralSchema.optional(),
    orderSource: z.enum(["Undefined", "Website", "Salesperson", "EventOrder"]).optional(),
    noWeekendDeliveries: z.boolean().optional(),
    promoCode: z.string().trim().optional(),
    orderLinesJson: z.string().trim().optional(),
    orderLines: z.array(orderLineSchema).min(1, "orderLines must contain at least one line").optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.orderLinesJson && !value.orderLines) {
      ctx.addIssue({
        code: "custom",
        message: "Either orderLinesJson or orderLines is required",
        path: ["orderLinesJson"],
      })
    }

    if (value.dateType === "EDD" && !value.eddDate) {
      ctx.addIssue({
        code: "custom",
        message: "eddDate is required when dateType is EDD",
        path: ["eddDate"],
      })
    }

    if (value.dateType === "Confirmed") {
      if (!value.confirmedStartDate) {
        ctx.addIssue({
          code: "custom",
          message: "confirmedStartDate is required when dateType is Confirmed",
          path: ["confirmedStartDate"],
        })
      }
      if (!value.orderSource || value.orderSource === "Undefined") {
        ctx.addIssue({
          code: "custom",
          message: "orderSource is required and cannot be Undefined when dateType is Confirmed",
          path: ["orderSource"],
        })
      }
    }
  })

export type CreateOrderInput = z.infer<typeof createOrderSchema>

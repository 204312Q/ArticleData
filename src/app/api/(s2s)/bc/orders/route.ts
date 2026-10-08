import type { NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { randomUUID } from "node:crypto"
import { assertRequestGuards } from "@/lib/guard/assert"
import { firstZodErrorMessage } from "@/lib/api-response"
import {
  BCRequestError,
  createCPNROrderWithLines,
  type CPNRCreateSalesOrderWithLinesInput,
} from "@/lib/bcClient"

import { createOrderSchema, type CreateOrderInput } from "./schema"

export const runtime = "nodejs"

type OrderLine = NonNullable<CreateOrderInput["orderLines"]>[number]

function normalizeOrderLine(line: OrderLine): OrderLine {
  if (line.portion === "Dual") {
    return { ...line, session: "LunchAndDinner" as const }
  }
  if ((line.portion === "Single" || line.portion === "Trial") && line.session && line.session !== "Undefined") {
    return { ...line, firstMealSession: line.session as "Lunch" | "Dinner" }
  }
  return line
}

function resolveOrderLines(input: CreateOrderInput): string {
  let lines: OrderLine[]

  if (input.orderLinesJson !== undefined) {
    const trimmed = input.orderLinesJson.trim()
    if (!trimmed) throw new Error("orderLinesJson cannot be empty")
    let parsed: unknown
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      throw new Error("orderLinesJson must be a valid JSON array string")
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("orderLinesJson must be a non-empty JSON array string")
    }
    lines = parsed as OrderLine[]
  } else {
    lines = input.orderLines!
  }

  return JSON.stringify(lines.map(normalizeOrderLine))
}

function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

function generateExternalDocumentNo(dateType: CreateOrderInput["dateType"]): string {
  const now = new Date()
  const year = pad2(now.getUTCFullYear() % 100)
  const month = pad2(now.getUTCMonth() + 1)
  const day = pad2(now.getUTCDate())
  const hours = pad2(now.getUTCHours())
  const minutes = pad2(now.getUTCMinutes())
  const seconds = pad2(now.getUTCSeconds())
  const suffix = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase()
  const prefix = dateType === "EDD" ? "EDD" : "CFM"

  return `CP-${prefix}-${year}${month}${day}-${hours}${minutes}${seconds}-${suffix}`
}

type PreparedOrderPayload = {
  externalDocumentNo: string
  payload: CPNRCreateSalesOrderWithLinesInput
  requestId: string
}

function toPayload(input: CreateOrderInput): PreparedOrderPayload {
  const orderLinesJson = resolveOrderLines(input)

  const requestId = input.requestId?.trim() || randomUUID()
  const externalDocumentNo = input.externalDocumentNo?.trim() || generateExternalDocumentNo(input.dateType)

  const payload: CPNRCreateSalesOrderWithLinesInput = {
    requestId,
    sellToCustomerNo: input.sellToCustomerNo,
    billToCustomerNo: input.billToCustomerNo ?? input.sellToCustomerNo,
    externalDocumentNo,
    dateType: input.dateType,
    orderLinesJson,
  }

  if (input.currencyCode !== undefined) payload.currencyCode = input.currencyCode
  if (input.shipToCode !== undefined) payload.shipToCode = input.shipToCode
  if (input.requestedDeliveryDate !== undefined) payload.requestedDeliveryDate = input.requestedDeliveryDate
  if (input.promisedDeliveryDate !== undefined) payload.promisedDeliveryDate = input.promisedDeliveryDate
  if (input.eddDate !== undefined) payload.eddDate = input.eddDate
  if (input.confirmedStartDate !== undefined) payload.confirmedStartDate = input.confirmedStartDate
  if (input.orderSource !== undefined) payload.orderSource = input.orderSource
  if (input.noWeekendDeliveries !== undefined) payload.noWeekendDeliveries = input.noWeekendDeliveries
  if (input.promoCode) payload.promoCode = input.promoCode

  return {
    externalDocumentNo,
    payload,
    requestId,
  }
}

export async function POST(request: NextRequest) {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: "Request Param Invalid" }, { status: 400 })
    }

    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: firstZodErrorMessage(parsed.error) }, { status: 400 })
    }

    const prepared = toPayload(parsed.data)
    const created = await createCPNROrderWithLines(prepared.payload)

    // Store order in database with optional payment link
    if (created.orderNo) {
      try {
        await prisma.$executeRaw`
          INSERT INTO orders (
            id,
            order_no,
            external_document_no,
            customer_no,
            date_type,
            order_source,
            payment_transaction_id,
            created_at,
            updated_at
          )
          VALUES (
            ${randomUUID()}::uuid,
            ${created.orderNo},
            ${prepared.externalDocumentNo},
            ${parsed.data.sellToCustomerNo},
            ${parsed.data.dateType},
            ${parsed.data.orderSource || "Undefined"},
            ${parsed.data.paymentTransactionId || null}::uuid,
            NOW(),
            NOW()
          )
          ON CONFLICT (order_no)
          DO UPDATE SET
            payment_transaction_id = EXCLUDED.payment_transaction_id,
            updated_at = NOW()
        `
      } catch (dbError) {
        console.error("[orders] Failed to store order in database:", dbError)
        // Don't fail the whole request if DB storage fails - BC order was created successfully
      }
    }

    return Response.json(
      {
        success: true,
        source: "created_new",
        submitted: {
          externalDocumentNo: prepared.externalDocumentNo,
          requestId: prepared.requestId,
        },
        order: created,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof BCRequestError) {
      return Response.json(
        {
          error: "BC request failed",
          status: error.status,
          details: error.body,
        },
        { status: error.status },
      )
    }

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ error: "Failed to create order" }, { status: 500 })
  }
}

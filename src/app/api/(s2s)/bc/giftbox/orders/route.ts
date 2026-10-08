import type { NextRequest } from "next/server"

import { randomUUID } from "node:crypto"
import { assertRequestGuards } from "@/lib/guard/assert"
import { firstZodErrorMessage } from "@/lib/api-response"
import { BCRequestError, createCPNRGiftboxOrder } from "@/lib/bcClient"

import { createGiftboxOrderSchema } from "./schema"

export const runtime = "nodejs"

function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

function generateExternalDocumentNo(): string {
  const now = new Date()
  const year = pad2(now.getUTCFullYear() % 100)
  const month = pad2(now.getUTCMonth() + 1)
  const day = pad2(now.getUTCDate())
  const hours = pad2(now.getUTCHours())
  const minutes = pad2(now.getUTCMinutes())
  const seconds = pad2(now.getUTCSeconds())
  const suffix = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase()
  return `CP-GFT-${year}${month}${day}-${hours}${minutes}${seconds}-${suffix}`
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

    const parsed = createGiftboxOrderSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: firstZodErrorMessage(parsed.error) }, { status: 400 })
    }

    const input = parsed.data
    const requestId = input.requestId?.trim() || randomUUID()
    const externalDocumentNo = input.externalDocumentNo?.trim() || generateExternalDocumentNo()

    const created = await createCPNRGiftboxOrder({
      requestId,
      sellToCustomerNo: input.sellToCustomerNo,
      externalDocumentNo,
      ...(input.billToCustomerNo ? { billToCustomerNo: input.billToCustomerNo } : {}),
      ...(input.requestedDeliveryDate ? { requestedDeliveryDate: input.requestedDeliveryDate } : {}),
      ...(input.promoCode ? { promoCode: input.promoCode } : {}),
      giftboxLinesJson: JSON.stringify(input.lines),
    })

    return Response.json(
      {
        success: true,
        submitted: {
          externalDocumentNo,
          requestId,
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

    return Response.json({ error: "Failed to create giftbox order" }, { status: 500 })
  }
}

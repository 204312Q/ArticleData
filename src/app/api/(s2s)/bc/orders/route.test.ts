import { it, vi, expect, describe, beforeEach } from "vitest"
import { mockGuardFail, mockGuardPass } from "@/__tests__/helpers/auth-mock"
import { readJson, createJsonRequest } from "@/__tests__/helpers/request-mock"

vi.mock("@/lib/guard/assert", () => ({
  assertRequestGuards: vi.fn(),
}))

vi.mock("@/lib/bcClient", () => {
  class MockBCRequestError extends Error {
    status: number
    statusText: string
    body: string

    constructor(status: number, statusText: string, body: string) {
      super(`BC request failed (${status} ${statusText}): ${body}`)
      this.status = status
      this.statusText = statusText
      this.body = body
    }
  }

  return {
    BCRequestError: MockBCRequestError,
    createCPNROrderWithLines: vi.fn(),
  }
})

import { assertRequestGuards } from "@/lib/guard/assert"
import { BCRequestError, createCPNROrderWithLines } from "@/lib/bcClient"

import { POST } from "./route"

type OrderResponse = {
  success?: boolean
  source?: string
  error?: string
  status?: number
  submitted?: {
    externalDocumentNo?: string
    requestId?: string
  }
}

const validCreateOrderBody = {
  sellToCustomerNo: "C0001",
  externalDocumentNo: "WEB-ORDER-0001",
  dateType: "EDD",
  eddDate: "2026-05-01",
  orderLines: [
    {
      no: "CFM-DPG-002",
      quantity: 1,
      portion: "Dual",
      session: "LunchAndDinner",
      firstMealSession: "Lunch",
    },
  ],
}

const createdOrderRecord = {
  requestId: "8f4ce83c-b7ca-4af3-8b80-2d7f6ecfbd71",
  orderNo: "SO-1002",
  orderSystemId: "11111111-1111-1111-1111-111111111111",
  createdLineNos: "10000",
}

const assertGuardsMock = vi.mocked(assertRequestGuards)
const createOrderMock = vi.mocked(createCPNROrderWithLines)

describe("/api/bc/orders POST", () => {
  beforeEach(() => {
    mockGuardPass(assertGuardsMock as unknown as Parameters<typeof mockGuardPass>[0])
    createOrderMock.mockResolvedValue(createdOrderRecord)
  })

  it("short-circuits when guards fail", async () => {
    mockGuardFail(assertGuardsMock as unknown as Parameters<typeof mockGuardFail>[0], 401, "Unauthorized")

    const request = createJsonRequest("http://localhost/api/bc/orders", "POST", validCreateOrderBody)
    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(createOrderMock).not.toHaveBeenCalled()
  })

  it("returns 400 when order lines payload is missing", async () => {
    const request = createJsonRequest("http://localhost/api/bc/orders", "POST", {
      sellToCustomerNo: "C0001",
      dateType: "EDD",
      eddDate: "2026-05-01",
    })

    const response = await POST(request)
    const body = await readJson<OrderResponse>(response)

    expect(response.status).toBe(400)
    expect(body.error).toBe("Either orderLinesJson or orderLines is required")
    expect(createOrderMock).not.toHaveBeenCalled()
  })

  it("returns 201 for a valid one-shot order payload", async () => {
    const request = createJsonRequest("http://localhost/api/bc/orders", "POST", validCreateOrderBody)
    const response = await POST(request)
    const body = await readJson<OrderResponse>(response)

    expect(response.status).toBe(201)
    expect(body.success).toBe(true)
    expect(body.source).toBe("created_new")
    expect(body.submitted?.externalDocumentNo).toBe("WEB-ORDER-0001")
    expect(createOrderMock).toHaveBeenCalledTimes(1)
  })

  it("auto-generates requestId and externalDocumentNo when omitted", async () => {
    const request = createJsonRequest("http://localhost/api/bc/orders", "POST", {
      sellToCustomerNo: "C0001",
      dateType: "EDD",
      eddDate: "2026-05-01",
      orderLines: validCreateOrderBody.orderLines,
    })

    const response = await POST(request)
    const body = await readJson<OrderResponse>(response)

    expect(response.status).toBe(201)
    expect(body.submitted?.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
    expect(body.submitted?.externalDocumentNo).toMatch(/^CP-EDD-\d{6}-\d{6}-[0-9A-F]{4}$/)
    expect(createOrderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: expect.stringMatching(/^[0-9a-f-]{36}$/i),
        externalDocumentNo: expect.stringMatching(/^CP-EDD-\d{6}-\d{6}-[0-9A-F]{4}$/),
      }),
    )
  })

  it("maps BCRequestError status and body", async () => {
    createOrderMock.mockRejectedValue(new BCRequestError(503, "Service Unavailable", "gateway timeout"))

    const request = createJsonRequest("http://localhost/api/bc/orders", "POST", validCreateOrderBody)
    const response = await POST(request)
    const body = await readJson<OrderResponse>(response)

    expect(response.status).toBe(503)
    expect(body.error).toBe("BC request failed")
    expect(body.status).toBe(503)
  })
})
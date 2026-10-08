import type { NextRequest } from "next/server"

import { it, vi, expect, describe, afterEach, beforeEach } from "vitest"

const retrieveCheckoutSessionMock = vi.fn()

vi.mock("@/lib/guard/assert", () => ({
  assertRequestGuards: vi.fn(),
}))
vi.mock("@/lib/payment-transactions", () => ({
  upsertPaymentTransaction: vi.fn(),
}))
vi.mock("@/lib/ct-backend/client", () => ({
  CTBackendError: class CTBackendError extends Error {},
  recordCTBPayment: vi.fn(),
}))
vi.mock("@/lib/payment-gateway/client", () => ({
  PaymentGatewayError: class PaymentGatewayError extends Error {},
  updatePayment: vi.fn(),
}))
vi.mock("@/lib/payment-gateway/stripe-client", () => ({
  retrieveCheckoutSession: (sessionId: string) => retrieveCheckoutSessionMock(sessionId),
  toUpdatePaymentResponse: (intent: { id: string }, orderReference: string) => ({
    status: "AUTHORIZED",
    orderReference,
    transactionId: intent.id,
  }),
}))

import { assertRequestGuards } from "@/lib/guard/assert"
import { recordCTBPayment } from "@/lib/ct-backend/client"
import { updatePayment } from "@/lib/payment-gateway/client"
import { upsertPaymentTransaction } from "@/lib/payment-transactions"

import { POST } from "./route"

function makeRequest(body: unknown): NextRequest {
  return new Request("https://localhost/api/payments/confirm", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  }) as unknown as NextRequest
}

const VALID_BODY = { orderReference: "R1", resultJwt: "jwt-token", transientToken: "transient-token" }

function mockGatewayResult(status: string): void {
  vi.mocked(updatePayment).mockResolvedValue({
    data: {
      amount: { currency: "SGD", total: "100.00" },
      orderReference: "R1",
      status,
      transactionId: "TXN-1",
    },
    error: null,
    meta: { correlationId: "c1", timestamp: "2026-01-01T00:00:00.000Z" },
  } as unknown as Awaited<ReturnType<typeof updatePayment>>)
}

describe("POST /api/payments/confirm", () => {
  beforeEach(() => {
    vi.mocked(assertRequestGuards).mockResolvedValue(null)
    vi.mocked(upsertPaymentTransaction).mockResolvedValue("PT-1")
    vi.mocked(recordCTBPayment).mockResolvedValue({ id: "CTB-PT-1", orderReference: "R1", status: "PAID" })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it("charges the card exactly once and records the payment in CT Backend (default mode)", async () => {
    mockGatewayResult("AUTHORIZED")

    const res = await POST(makeRequest(VALID_BODY))
    const json = (await res.json()) as { data: { paymentStatus: string; paymentTransactionId: string } }

    expect(res.status).toBe(200)
    // the charge happens here, and only here (complete no longer calls updatePayment)
    expect(updatePayment).toHaveBeenCalledTimes(1)
    expect(recordCTBPayment).toHaveBeenCalledTimes(1)
    expect(recordCTBPayment).toHaveBeenCalledWith(
      expect.objectContaining({ orderReference: "R1", transactionId: "TXN-1" })
    )
    // dev_confinement is untouched in CT Backend mode
    expect(upsertPaymentTransaction).not.toHaveBeenCalled()
    expect(json.data.paymentStatus).toBe("AUTHORIZED")
    expect(json.data.paymentTransactionId).toBe("CTB-PT-1")
  })

  it("does not record non-authorized results in CT Backend (successful payments only)", async () => {
    mockGatewayResult("PENDING")

    const res = await POST(makeRequest(VALID_BODY))

    expect(res.status).toBe(200)
    expect(recordCTBPayment).not.toHaveBeenCalled()
    expect(upsertPaymentTransaction).not.toHaveBeenCalled()
  })

  it("retries the CT Backend write once before failing", async () => {
    mockGatewayResult("AUTHORIZED")
    vi.mocked(recordCTBPayment)
      .mockRejectedValueOnce(new Error("network blip"))
      .mockResolvedValueOnce({ id: "CTB-PT-1", orderReference: "R1", status: "PAID" })

    const res = await POST(makeRequest(VALID_BODY))

    expect(res.status).toBe(200)
    expect(recordCTBPayment).toHaveBeenCalledTimes(2)
  })

  it("persists locally instead when ORDER_BACKEND=bc", async () => {
    vi.stubEnv("ORDER_BACKEND", "bc")
    mockGatewayResult("AUTHORIZED")

    const res = await POST(makeRequest(VALID_BODY))
    const json = (await res.json()) as { data: { paymentStatus: string } }

    expect(res.status).toBe(200)
    expect(upsertPaymentTransaction).toHaveBeenCalledTimes(1)
    expect(recordCTBPayment).not.toHaveBeenCalled()
    expect(json.data.paymentStatus).toBe("AUTHORIZED")
  })

  describe("Stripe mode (PAYMENT_GATEWAY=stripe)", () => {
    beforeEach(() => {
      vi.stubEnv("PAYMENT_GATEWAY", "stripe")
    })

    it("rejects when the Checkout Session's orderReference does not match the request", async () => {
      retrieveCheckoutSessionMock.mockResolvedValue({
        metadata: { orderReference: "SOMEONE-ELSES-ORDER" },
        payment_intent: { id: "pi_1" },
        payment_status: "paid",
      })

      const res = await POST(makeRequest({ orderReference: "R1", stripeSessionId: "cs_1" }))

      expect(res.status).toBe(400)
      expect(recordCTBPayment).not.toHaveBeenCalled()
    })

    it("proceeds when the Checkout Session's orderReference matches the request", async () => {
      retrieveCheckoutSessionMock.mockResolvedValue({
        metadata: { orderReference: "R1" },
        payment_intent: { id: "pi_1" },
        payment_status: "paid",
      })

      const res = await POST(makeRequest({ orderReference: "R1", stripeSessionId: "cs_1" }))

      expect(res.status).toBe(200)
      expect(recordCTBPayment).toHaveBeenCalledWith(expect.objectContaining({ orderReference: "R1" }))
    })
  })
})

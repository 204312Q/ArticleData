import type { NextRequest } from "next/server"

import { it, vi, expect, describe, afterEach, beforeEach } from "vitest"

const constructEventMock = vi.fn()
const retrieveCheckoutSessionMock = vi.fn()
const storeVerifiedPaymentMock = vi.fn()
const loadVerifiedPaymentMock = vi.fn()
const hasStripeEventBeenProcessedMock = vi.fn()
const markStripeEventProcessedOnceMock = vi.fn()
const completeCheckoutOrderMock = vi.fn()
const decodeDraftMetadataMock = vi.fn()
const decodeGiftboxDraftMetadataMock = vi.fn()
const adaptGiftboxDraftToCheckoutDraftMock = vi.fn()
const buildOrderConfirmationEmailMock = vi.fn()
const sendMailMock = vi.fn()
const orderBackendMock = vi.fn()

vi.mock("@/lib/payment-gateway/stripe-client", () => ({
  getStripeClient: () => ({ webhooks: { constructEvent: constructEventMock } }),
  retrieveCheckoutSession: (sessionId: string) => retrieveCheckoutSessionMock(sessionId),
  toUpdatePaymentResponse: vi.fn((intent: { id: string }, orderReference: string) => ({
    status: "AUTHORIZED",
    orderReference,
    transactionId: intent.id,
  })),
}))
vi.mock("@/lib/payment-gateway/store-verified-payment", () => ({
  storeVerifiedPayment: (payment: unknown) => storeVerifiedPaymentMock(payment),
  loadVerifiedPayment: (orderReference: string) => loadVerifiedPaymentMock(orderReference),
}))
vi.mock("@/lib/payment-gateway/stripe-webhook-dedupe", () => ({
  hasStripeEventBeenProcessed: (eventId: string) => hasStripeEventBeenProcessedMock(eventId),
  markStripeEventProcessedOnce: (eventId: string) => markStripeEventProcessedOnceMock(eventId),
}))
vi.mock("@/lib/checkout/complete-order", () => ({
  completeCheckoutOrder: (options: unknown) => completeCheckoutOrderMock(options),
}))
vi.mock("@/lib/checkout/draft-metadata", () => ({
  decodeDraftMetadata: (metadata: unknown) => decodeDraftMetadataMock(metadata),
}))
vi.mock("@/lib/checkout/adapt-giftbox-draft", () => ({
  decodeGiftboxDraftMetadata: (metadata: unknown) => decodeGiftboxDraftMetadataMock(metadata),
  adaptGiftboxDraftToCheckoutDraft: (input: unknown) => adaptGiftboxDraftToCheckoutDraftMock(input),
}))
vi.mock("@/lib/email/order-confirmation", () => ({
  buildOrderConfirmationEmail: (options: unknown) => buildOrderConfirmationEmailMock(options),
}))
vi.mock("@/lib/email/graphMailer", () => ({
  sendMail: (options: unknown) => sendMailMock(options),
}))
vi.mock("@/lib/order-backend", () => ({
  orderBackend: () => orderBackendMock(),
}))

import { POST } from "./route"

function makeRequest(options: { body?: string; signature?: string | null } = {}): NextRequest {
  const headers: Record<string, string> = {}
  if (options.signature !== null) {
    headers["stripe-signature"] = options.signature ?? "t=1,v1=fake"
  }

  return new Request("https://localhost/api/payments/webhook", {
    body: options.body ?? "{}",
    headers,
    method: "POST",
  }) as unknown as NextRequest
}

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: "evt_123",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_123",
        metadata: { orderReference: "CONF-20260801-093000-A1B2" },
      },
    },
    ...overrides,
  }
}

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    id: "cs_123",
    payment_status: "paid",
    payment_intent: { id: "pi_123" },
    ...overrides,
  }
}

function makeDraft() {
  return { draftId: "CONF-20260801-093000-A1B2", delivery: { email: "customer@example.com" } }
}

function makeVerifiedPayment(overrides: Record<string, unknown> = {}) {
  return {
    amount: "100.00",
    currency: "SGD",
    orderReference: "CONF-20260801-093000-A1B2",
    paymentStatus: "PAID",
    paymentTransactionId: "pt_1",
    transactionId: "pi_123",
    ...overrides,
  }
}

describe("POST /api/payments/webhook", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test_secret")
    hasStripeEventBeenProcessedMock.mockResolvedValue(false)
    markStripeEventProcessedOnceMock.mockResolvedValue(true)
    retrieveCheckoutSessionMock.mockResolvedValue(makeSession())
    storeVerifiedPaymentMock.mockResolvedValue("pt_1")
    orderBackendMock.mockReturnValue("ctbackend")
    decodeDraftMetadataMock.mockReturnValue(makeDraft())
    decodeGiftboxDraftMetadataMock.mockReturnValue({ draftId: "GIFT-20260801-093000-A1B2", items: [] })
    adaptGiftboxDraftToCheckoutDraftMock.mockReturnValue(makeDraft())
    loadVerifiedPaymentMock.mockResolvedValue(makeVerifiedPayment())
    completeCheckoutOrderMock.mockResolvedValue({ duplicate: false, orderNo: "WEB-2026-00001" })
    buildOrderConfirmationEmailMock.mockReturnValue({ subject: "Order Confirmation", html: "<p>Hi</p>" })
    sendMailMock.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it("returns 400 when the stripe-signature header is missing", async () => {
    const res = await POST(makeRequest({ signature: null }))

    expect(res.status).toBe(400)
    expect(constructEventMock).not.toHaveBeenCalled()
  })

  it("returns 400 when STRIPE_WEBHOOK_SECRET is not configured", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "")

    const res = await POST(makeRequest())

    expect(res.status).toBe(400)
  })

  it("returns 400 when signature verification fails", async () => {
    constructEventMock.mockImplementation(() => {
      throw new Error("invalid signature")
    })

    const res = await POST(makeRequest())

    expect(res.status).toBe(400)
    expect(storeVerifiedPaymentMock).not.toHaveBeenCalled()
  })

  it("acknowledges without reprocessing a duplicate event", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    hasStripeEventBeenProcessedMock.mockResolvedValue(true)

    const res = await POST(makeRequest())
    const json = (await res.json()) as { duplicate?: boolean; received: boolean }

    expect(res.status).toBe(200)
    expect(json.duplicate).toBe(true)
    expect(storeVerifiedPaymentMock).not.toHaveBeenCalled()
  })

  it("records the payment, creates the backstop order, and emails the customer on checkout.session.completed", async () => {
    constructEventMock.mockReturnValue(makeEvent())

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(storeVerifiedPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({ orderReference: "CONF-20260801-093000-A1B2", transactionId: "pi_123" })
    )
    expect(completeCheckoutOrderMock).toHaveBeenCalledWith({
      draft: makeDraft(),
      payment: makeVerifiedPayment(),
    })
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({ to: "customer@example.com" }))
    expect(markStripeEventProcessedOnceMock).toHaveBeenCalledWith("evt_123")
  })

  it("also creates the backstop order on checkout.session.async_payment_succeeded", async () => {
    constructEventMock.mockReturnValue(makeEvent({ type: "checkout.session.async_payment_succeeded" }))

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(completeCheckoutOrderMock).toHaveBeenCalled()
  })

  it("skips order creation entirely in BC mode", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    orderBackendMock.mockReturnValue("bc")

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(completeCheckoutOrderMock).not.toHaveBeenCalled()
  })

  it("dispatches to the giftbox decoder/adapter when the session's draftKind is giftbox", async () => {
    constructEventMock.mockReturnValue(
      makeEvent({
        data: {
          object: {
            id: "cs_123",
            metadata: { orderReference: "GIFT-20260801-093000-A1B2", draftKind: "giftbox" },
          },
        },
      })
    )
    const giftboxInput = { draftId: "GIFT-20260801-093000-A1B2", items: [] }
    decodeGiftboxDraftMetadataMock.mockReturnValue(giftboxInput)

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(decodeGiftboxDraftMetadataMock).toHaveBeenCalledWith(
      expect.objectContaining({ draftKind: "giftbox" })
    )
    expect(adaptGiftboxDraftToCheckoutDraftMock).toHaveBeenCalledWith(giftboxInput)
    expect(decodeDraftMetadataMock).not.toHaveBeenCalled()
    expect(completeCheckoutOrderMock).toHaveBeenCalled()
  })

  it("falls back to the product decoder when draftKind is missing (sessions created before draftKind existed)", async () => {
    constructEventMock.mockReturnValue(
      makeEvent({
        data: {
          object: { id: "cs_123", metadata: { orderReference: "CONF-20260801-093000-A1B2" } },
        },
      })
    )

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(decodeDraftMetadataMock).toHaveBeenCalled()
    expect(decodeGiftboxDraftMetadataMock).not.toHaveBeenCalled()
    expect(adaptGiftboxDraftToCheckoutDraftMock).not.toHaveBeenCalled()
    expect(completeCheckoutOrderMock).toHaveBeenCalled()
  })

  it("fails loudly (500, retried, not marked processed) when the giftbox metadata fails to decode", async () => {
    constructEventMock.mockReturnValue(
      makeEvent({
        data: {
          object: {
            id: "cs_123",
            metadata: { orderReference: "GIFT-20260801-093000-A1B2", draftKind: "giftbox" },
          },
        },
      })
    )
    decodeGiftboxDraftMetadataMock.mockReturnValue(null)

    const res = await POST(makeRequest())

    expect(res.status).toBe(500)
    expect(adaptGiftboxDraftToCheckoutDraftMock).not.toHaveBeenCalled()
    expect(completeCheckoutOrderMock).not.toHaveBeenCalled()
    expect(markStripeEventProcessedOnceMock).not.toHaveBeenCalled()
  })

  it("fails loudly (500, retried, not marked processed) when no draft metadata can be decoded", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    decodeDraftMetadataMock.mockReturnValue(null)

    const res = await POST(makeRequest())

    expect(res.status).toBe(500)
    expect(completeCheckoutOrderMock).not.toHaveBeenCalled()
    expect(markStripeEventProcessedOnceMock).not.toHaveBeenCalled()
  })

  it("fails loudly (500, retried, not marked processed) when the payment does not re-read as PAID", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    loadVerifiedPaymentMock.mockResolvedValue(makeVerifiedPayment({ paymentStatus: "PENDING" }))

    const res = await POST(makeRequest())

    expect(res.status).toBe(500)
    expect(completeCheckoutOrderMock).not.toHaveBeenCalled()
    expect(markStripeEventProcessedOnceMock).not.toHaveBeenCalled()
  })

  it("does not send a confirmation email when the order was already created (duplicate)", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    completeCheckoutOrderMock.mockResolvedValue({ duplicate: true, orderNo: "WEB-2026-00001" })

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(sendMailMock).not.toHaveBeenCalled()
  })

  it("skips processing when the Checkout Session has no orderReference metadata", async () => {
    constructEventMock.mockReturnValue(makeEvent({ data: { object: { id: "cs_456", metadata: {} } } }))

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(retrieveCheckoutSessionMock).not.toHaveBeenCalled()
    expect(storeVerifiedPaymentMock).not.toHaveBeenCalled()
  })

  it("skips processing when the session's payment_intent is missing or unexpanded", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    retrieveCheckoutSessionMock.mockResolvedValue(makeSession({ payment_intent: "pi_123" }))

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(storeVerifiedPaymentMock).not.toHaveBeenCalled()
  })

  it("skips processing when the session isn't actually paid yet", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    retrieveCheckoutSessionMock.mockResolvedValue(makeSession({ payment_status: "unpaid" }))

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(storeVerifiedPaymentMock).not.toHaveBeenCalled()
  })

  it("ignores event types it doesn't act on", async () => {
    constructEventMock.mockReturnValue(makeEvent({ type: "charge.refunded" }))

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(storeVerifiedPaymentMock).not.toHaveBeenCalled()
  })

  it("returns 500 (so Stripe retries) and does not mark the event processed when storing the payment fails", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    storeVerifiedPaymentMock.mockRejectedValue(new Error("db down"))

    const res = await POST(makeRequest())

    expect(res.status).toBe(500)
    expect(markStripeEventProcessedOnceMock).not.toHaveBeenCalled()
  })

  it("returns 500 and does not mark the event processed when order creation fails", async () => {
    constructEventMock.mockReturnValue(makeEvent())
    completeCheckoutOrderMock.mockRejectedValue(new Error("CT Backend down"))

    const res = await POST(makeRequest())

    expect(res.status).toBe(500)
    expect(markStripeEventProcessedOnceMock).not.toHaveBeenCalled()
  })
})

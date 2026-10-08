import { createHash, createHmac, randomBytes } from "node:crypto"

// ----------------------------------------------------------------------
// Signed server-to-server client for CT Backend (the temporary BC stand-in).
// Auth contract: x-api-key + x-timestamp-ms + x-nonce + x-signature where the
// signature is HMAC-SHA256 hex over `METHOD\nPATH\nTIMESTAMP\nNONCE\nsha256(rawBody)`.
// See CTBackend/docs/order-intake-api.md. Server-side only — never expose the
// secrets to the browser.

export class CTBackendError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "CTBackendError"
    this.status = status
  }
}

type CTBackendEnvelope<T> = {
  status: number
  message: string
  data: T | null
}

function requireConfig(): { apiKey: string; baseUrl: string; secret: string } {
  const baseUrl = process.env.CTB_BASE_URL?.trim()
  const apiKey = process.env.CTB_API_KEY?.trim()
  const secret = process.env.CTB_HMAC_SECRET?.trim()

  if (!baseUrl || !apiKey || !secret) {
    throw new Error("CT Backend is not configured. Set CTB_BASE_URL, CTB_API_KEY and CTB_HMAC_SECRET.")
  }

  return { apiKey, baseUrl: baseUrl.replace(/\/+$/, ""), secret }
}

async function signedFetch<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<{ data: T; status: number }> {
  const { apiKey, baseUrl, secret } = requireConfig()

  const rawBody = body === undefined ? "" : JSON.stringify(body)
  const timestamp = Date.now().toString()
  const nonce = randomBytes(16).toString("base64url")
  const bodySha256Hex = createHash("sha256").update(rawBody).digest("hex")
  const canonicalString = `${method}\n${path}\n${timestamp}\n${nonce}\n${bodySha256Hex}`
  const signature = createHmac("sha256", secret).update(canonicalString).digest("hex")

  const response = await fetch(`${baseUrl}${path}`, {
    body: body === undefined ? undefined : rawBody,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "x-nonce": nonce,
      "x-signature": signature,
      "x-timestamp-ms": timestamp,
    },
    method,
  })

  const payload = (await response.json().catch(() => null)) as CTBackendEnvelope<T> | null

  if (!response.ok || !payload) {
    throw new CTBackendError(
      payload?.message || `CT Backend request failed (${method} ${path} → ${response.status})`,
      response.status
    )
  }

  return { data: payload.data as T, status: response.status }
}

// ----------------------------------------------------------------------
// POST /api/payments — record a gateway-verified (successful) payment.

export type CTBRecordPaymentInput = {
  amount?: string
  currency?: string
  customerEmail?: string
  gatewayResponse?: unknown
  orderReference: string
  reconciliationId?: string
  transactionId: string
}

export type CTBRecordedPayment = {
  duplicate?: boolean
  id: string
  orderReference: string
  status: string
}

export async function recordCTBPayment(input: CTBRecordPaymentInput): Promise<CTBRecordedPayment> {
  const { data } = await signedFetch<CTBRecordedPayment>("POST", "/api/payments", input)
  return data
}

// ----------------------------------------------------------------------
// GET /api/payments/{orderReference} — re-read a recorded payment.

export type CTBPayment = {
  amount: string | null
  createdAt: string
  currency: string | null
  customerEmail: string | null
  id: string
  method: string | null
  orderId: string | null
  orderNo: string | null
  orderReference: string
  reconciliationId: string | null
  status: "PAID" | "PENDING" | "REFUNDED" | "WRITTEN_OFF"
  transactionId: string
}

export async function getCTBPayment(orderReference: string): Promise<CTBPayment | null> {
  try {
    const { data } = await signedFetch<CTBPayment>("GET", `/api/payments/${encodeURIComponent(orderReference)}`)
    return data
  } catch (error) {
    if (error instanceof CTBackendError && error.status === 404) {
      return null
    }
    throw error
  }
}

// ----------------------------------------------------------------------
// POST /api/promo/validate — authoritative pre-payment promo check against
// CT Backend's promo module. Read-only: usage is only committed when the
// order is recorded (recordOrder creates the redemption + increments usage).

export type CTBPromoLine = {
  lineAmount: number
  productNo?: string
}

export type CTBPromoValidation =
  | {
      appliedToProductNos: string[]
      code: string
      discountAmount: number
      discountType: "FIXED" | "PERCENT"
      discountValue: number
      eligibleSubtotal: number
      scope: "ENTIRE_ORDER" | "SPECIFIC_ITEMS"
      valid: true
    }
  | { reason: string; valid: false }

export async function validateCTBPromo(input: {
  code: string
  customerEmail?: string
  customerPhone?: string
  lines: CTBPromoLine[]
}): Promise<CTBPromoValidation> {
  const { data } = await signedFetch<CTBPromoValidation>("POST", "/api/promo/validate", input)
  return data
}

// ----------------------------------------------------------------------
// POST /api/orders — push the paid order. orderNo omitted on purpose:
// CT Backend assigns the next WEB-YYYY-NNNNN running number.

export type CTBOrderLine = {
  description: string
  lineAmount: number
  productNo?: string
  quantity: number
  selections?: Record<string, unknown>
  unitPrice: number
}

export type CTBCreateOrderInput = {
  customer?: {
    email?: string
    name?: string
    no?: string
    phone?: string
  }
  dateType?: "CONFIRMED" | "DELIVERY" | "EDD"
  delivery?: {
    address?: string
    contactName?: string
    phone?: string
    postalCode?: string
    unitNo?: string
  }
  deliveryDate?: string
  externalDocumentNo?: string
  lines: CTBOrderLine[]
  notes?: string
  /** Standing rule for meal packages: skip Saturday/Sunday deliveries. */
  noWeekendDelivery?: boolean
  payment: {
    amount?: string
    currency?: string
    gatewayResponse?: unknown
    orderReference: string
    reconciliationId?: string
    status: string
    transactionId: string
  }
  promoCode?: string
  totals?: {
    discountAmount?: number
    gstAmount?: number
    // Tiered shipping fee (see src/lib/checkout/shipping-fee.ts). totalAmount
    // above stays items-only — shippingAmount is always separate/additive.
    shippingAmount?: number
    shippingMethod?: "FREE" | "SMALL_ORDER" | "STANDARD"
    subtotal?: number
    totalAmount?: number
  }
}

export type CTBCreatedOrder = {
  duplicate?: boolean
  id: string
  orderNo: string
}

export async function createCTBOrder(input: CTBCreateOrderInput): Promise<CTBCreatedOrder> {
  const { data } = await signedFetch<CTBCreatedOrder>("POST", "/api/orders", input)
  return data
}

// ----------------------------------------------------------------------
// GET /api/non-operating-days — public, unsigned. Kitchen/delivery closure
// dates so the website calendar pickers (giftbox + package) can disable them.

export type CTBNonOperatingDay = {
  date: string
  reason: string | null
}

export async function listCTBNonOperatingDays(): Promise<CTBNonOperatingDay[]> {
  const baseUrl = process.env.CTB_BASE_URL?.trim()
  if (!baseUrl) {
    throw new Error("CT Backend is not configured. Set CTB_BASE_URL.")
  }

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/non-operating-days`, {
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as CTBackendEnvelope<{
    dates: CTBNonOperatingDay[]
  }> | null

  if (!response.ok || !payload) {
    throw new CTBackendError(
      payload?.message || `CT Backend request failed (GET /api/non-operating-days → ${response.status})`,
      response.status
    )
  }

  return payload.data?.dates ?? []
}

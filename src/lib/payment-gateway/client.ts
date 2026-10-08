import { createHmac, randomUUID } from "node:crypto"

const PG_URL = process.env.PG_URL?.trim() ?? ""
const PG_MERCHANT_ID = process.env.PG_MERCHANT_ID?.trim() ?? ""
const PG_API_SECRET = process.env.PG_API_SECRET?.trim() ?? ""

const IDEMPOTENCY_HEADER = "idempotency-key"
const CORRELATION_HEADER = "x-correlation-id"
const SKIP_IDEMPOTENCY_PATHS = new Set<string>(["/v1/api/cybersource/capture-context"])
const MUTATING_METHODS = new Set<string>(["POST", "PUT", "PATCH", "DELETE"])

type PaymentGatewayConfig = {
  apiSecret: string
  baseUrl: string
  merchantId: string
}

type PaymentGatewayRequestInit = {
  body?: unknown
  method?: string
  path: string
}

export type PaymentGatewayMeta = {
  correlationId: string
  timestamp: string
}

export type PaymentGatewayErrorBody = {
  code: string
  details?: Record<string, unknown>
  message: string
  provider?: {
    code?: string
    message?: string
    name: string
  }
}

export type PaymentGatewayEnvelope<T> = {
  data: T | null
  error: PaymentGatewayErrorBody | null
  meta: PaymentGatewayMeta
}

export class PaymentGatewayError extends Error {
  readonly correlationId?: string
  readonly details?: Record<string, unknown>
  readonly envelope: PaymentGatewayEnvelope<unknown> | null
  readonly status: number

  constructor(status: number, envelope: PaymentGatewayEnvelope<unknown> | null) {
    super(envelope?.error?.message ?? `Payment gateway error ${status}`)
    this.name = "PaymentGatewayError"
    this.status = status
    this.details = envelope?.error?.details
    this.correlationId = envelope?.meta?.correlationId
    this.envelope = envelope
  }
}

export type CaptureContextAppearanceVariables = {
  backgroundColor: string
  buttonBackground: string
  buttonBorderRadius: string
  buttonForeground: string
  fontFamily: string
  headerBackground: string
  headerForeground: string
  paymentSelectionBackground: string
  textColor: string
}

export type CaptureContextCompleteMandate = {
  tms: { tokenCreate: boolean }
  type: "AUTH" | "CAPTURE" | "PREFER_AUTH"
}

export type CaptureContextSession = {
  allowedCardNetworks: Array<
    "AMEX" | "CARTESBANCAIRES" | "CUP" | "DINERSCLUB" | "DISCOVER" | "ELO" | "JCB" | "MAESTRO" | "MASTERCARD" | "VISA"
  >
  allowedPaymentTypes: Array<"APPLEPAY" | "CLICKTOPAY" | "GOOGLEPAY" | "PANENTRY" | "SAMSUNGPAY">
  appearance: { variables: CaptureContextAppearanceVariables }
  buttonType:
    | "ADD_CARD"
    | "CARD_PAYMENT"
    | "CHECKOUT"
    | "DEBIT_CREDIT"
    | "DONATE"
    | "PAY"
    | "PAY_WITH_CARD"
    | "SAVE_CARD"
    | "SUBSCRIBE_WITH_CARD"
  completeMandate: CaptureContextCompleteMandate
  data: {
    clientReferenceInformation: { code: string }
    orderInformation: {
      amountDetails: { currency: string; totalAmount: string }
      billTo: { email: string; phoneNumber: string }
    }
  }
  targetOrigins: string[]
}

export type GenerateCaptureContextResponse = {
  captureContext: string
}

export type UpdatePaymentInput = {
  expectedOrderReference: string
  resultJwt: string
  transientToken: string
}

export type UpdatePaymentResponse = {
  amount?: {
    authorized?: string
    currency?: string
    total?: string
  }
  billingAddress?: {
    address1?: string
    address2?: string
    administrativeArea?: string
    country?: string
    email?: string
    firstName?: string
    lastName?: string
    locality?: string
    phoneNumber?: string
    postalCode?: string
  }
  card?: {
    expirationMonth?: string
    expirationYear?: string
    number?: string
    type?: string
  }
  errorReason?: string | null
  orderReference: string
  processorInformation?: {
    approvalCode?: string
    networkTransactionId?: string
    responseCode?: string
  }
  reconciliationId?: string
  shippingAddress?: {
    address1?: string
    address2?: string
    administrativeArea?: string
    country?: string
    email?: string
    firstName?: string
    lastName?: string
    locality?: string
    phoneNumber?: string
    postalCode?: string
  }
  status: string
  submitTimeUtc?: string
  transactionId: string
}

function requireConfig(): PaymentGatewayConfig {
  if (!PG_URL) {
    throw new Error("PG_URL environment variable is not set")
  }

  if (!PG_MERCHANT_ID) {
    throw new Error("PG_MERCHANT_ID environment variable is not set")
  }

  if (!PG_API_SECRET) {
    throw new Error("PG_API_SECRET environment variable is not set")
  }

  return {
    apiSecret: PG_API_SECRET,
    baseUrl: PG_URL.replace(/\/$/, ""),
    merchantId: PG_MERCHANT_ID,
  }
}

async function paymentGatewayFetch<T>(init: PaymentGatewayRequestInit): Promise<PaymentGatewayEnvelope<T>> {
  const { apiSecret, baseUrl, merchantId } = requireConfig()
  const method = (init.method ?? "POST").toUpperCase()
  const path = init.path.split("?")[0] ?? "/"
  const rawBody = init.body === undefined ? "" : JSON.stringify(init.body)
  const timestamp = new Date().toISOString()
  const shouldSendIdempotencyKey = MUTATING_METHODS.has(method) && !SKIP_IDEMPOTENCY_PATHS.has(path)
  const idempotencyKey = shouldSendIdempotencyKey ? randomUUID() : ""
  const canonical = `${method}\n${path}\n${timestamp}\n${idempotencyKey}\n${rawBody}`
  const signature = createHmac("sha256", apiSecret).update(canonical).digest("hex")

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    [CORRELATION_HEADER]: randomUUID(),
    "x-merchant-id": merchantId,
    "x-signature": signature,
    "x-timestamp": timestamp,
  }

  if (idempotencyKey) {
    headers[IDEMPOTENCY_HEADER] = idempotencyKey
  }

  const response = await fetch(`${baseUrl}${init.path}`, {
    body: init.body === undefined ? undefined : rawBody,
    cache: "no-store",
    headers,
    method,
  })

  const text = await response.text()
  let envelope: PaymentGatewayEnvelope<T> | null = null

  try {
    envelope = JSON.parse(text) as PaymentGatewayEnvelope<T>
  } catch {
    envelope = null
  }

  if (!response.ok) {
    throw new PaymentGatewayError(response.status, envelope as PaymentGatewayEnvelope<unknown> | null)
  }

  if (!envelope) {
    throw new Error("Payment gateway returned invalid JSON")
  }

  return envelope
}

export async function generateCaptureContext(
  input: CaptureContextSession
): Promise<PaymentGatewayEnvelope<GenerateCaptureContextResponse>> {
  return paymentGatewayFetch<GenerateCaptureContextResponse>({
    body: input,
    path: "/v1/api/cybersource/capture-context",
  })
}

export async function updatePayment(
  input: UpdatePaymentInput
): Promise<PaymentGatewayEnvelope<UpdatePaymentResponse>> {
  return paymentGatewayFetch<UpdatePaymentResponse>({
    body: input,
    path: "/v1/api/cybersource/update-payment",
  })
}

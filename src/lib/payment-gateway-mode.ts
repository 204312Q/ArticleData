export type PaymentGatewayMode = "cybersource" | "stripe"

export function paymentGateway(): PaymentGatewayMode {
  return process.env.PAYMENT_GATEWAY?.trim().toLowerCase() === "stripe" ? "stripe" : "cybersource"
}

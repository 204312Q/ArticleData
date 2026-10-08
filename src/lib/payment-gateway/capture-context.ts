import type {
  CaptureContextSession,
  CaptureContextCompleteMandate,
  CaptureContextAppearanceVariables,
} from "./client"

type CaptureContextOptions = {
  /** Narrows the wallets offered on this session. Defaults to every supported type. */
  allowedPaymentTypes?: CaptureContextSession["allowedPaymentTypes"]
  amount: string
  currency: string
  email: string
  orderReference: string
  origin: string
  phoneNumber: string
}

// Mirrors the site palette/typography in src/theme/theme-config.ts (primary.main,
// primary.contrastText, grey.900, fontFamily.primary) and the button radius from
// src/theme/create-theme.ts (shape.borderRadius: 8), so the hosted widget reads as
// part of the storefront rather than a generic CyberSource default.
const defaultAppearance: CaptureContextAppearanceVariables = {
  backgroundColor: "#FFFFFF",
  buttonBackground: "#F27B96",
  buttonBorderRadius: "8px",
  buttonForeground: "#FFFFFF",
  fontFamily: "Avenir LT Std, Public Sans Variable, Arial, sans-serif",
  headerBackground: "#F27B96",
  headerForeground: "#FFFFFF",
  paymentSelectionBackground: "#FFFFFF",
  textColor: "#2C2D2F",
}

const defaultCompleteMandate: CaptureContextCompleteMandate = {
  tms: { tokenCreate: false },
  type: "CAPTURE",
}

const allowedCardNetworks: CaptureContextSession["allowedCardNetworks"] = ["VISA", "MASTERCARD", "JCB"]
const allowedPaymentTypes: CaptureContextSession["allowedPaymentTypes"] = [
  "PANENTRY",
  "CLICKTOPAY",
  "GOOGLEPAY",
  "APPLEPAY",
]

export function buildCaptureContextPayload(options: CaptureContextOptions): CaptureContextSession {
  return {
    allowedCardNetworks: [...allowedCardNetworks],
    allowedPaymentTypes: [...(options.allowedPaymentTypes ?? allowedPaymentTypes)],
    appearance: { variables: { ...defaultAppearance } },
    buttonType: "CHECKOUT",
    completeMandate: { ...defaultCompleteMandate },
    data: {
      clientReferenceInformation: {
        code: options.orderReference,
      },
      orderInformation: {
        amountDetails: {
          currency: options.currency,
          totalAmount: options.amount,
        },
        billTo: {
          email: options.email,
          phoneNumber: options.phoneNumber,
        },
      },
    },
    targetOrigins: [options.origin],
  }
}

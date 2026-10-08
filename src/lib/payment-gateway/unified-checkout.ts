/**
 * Browser-side driver for CyberSource Unified Checkout.
 *
 * Lifted verbatim from the inline flow in `product-order-flow.tsx` so the
 * payment lab exercises the same sequence the storefront runs: load the SDK
 * named by the capture context, hand it the two containers, collect the
 * transient token, then exchange it for the result JWT.
 *
 * Deliberately knows nothing about orders, drafts or Business Central — it
 * starts at a capture context and stops at `{ transientToken, resultJwt }`.
 */

type UnifiedPaymentInstance = {
  complete: (transientToken: string) => Promise<string>
  show: (args: {
    containers: {
      paymentScreen: string
      paymentSelection: string
    }
  }) => Promise<string>
}

type AcceptInstance = {
  unifiedPayments: (sidebar: boolean) => Promise<UnifiedPaymentInstance>
}

type AcceptFactory = (captureContext: string) => Promise<AcceptInstance>

/**
 * `window.Accept` is also declared globally by `product-order-flow.tsx`. Reading it
 * through a local cast instead of a second `declare global` keeps the two
 * declarations from colliding during type-check.
 */
function readAcceptFactory(): AcceptFactory | undefined {
  return (window as unknown as { Accept?: AcceptFactory }).Accept
}

/** Phases surfaced to the caller so it can drive its own UI state. */
export type UnifiedCheckoutPhase = 'loading-sdk' | 'awaiting-input' | 'verifying'

export type UnifiedCheckoutResult = {
  resultJwt: string
  transientToken: string
}

export type RunUnifiedCheckoutOptions = {
  captureContext: string
  /** CSS selector for the container Unified Checkout renders the payment screen into. */
  paymentScreenSelector: string
  /** CSS selector for the container Unified Checkout renders the method picker into. */
  paymentSelectionSelector: string
  onPhase?: (phase: UnifiedCheckoutPhase) => void
  /** Render the method picker as a sidebar rather than inline. */
  sidebar?: boolean
}

const SDK_SCRIPT_ATTRIBUTE = 'data-cp-cybersource-sdk'

export function decodeJwtPayload<T extends Record<string, unknown>>(jwt: string): T {
  const base64Url = jwt.split('.')[1]

  if (!base64Url) {
    throw new Error('Invalid JWT payload')
  }

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

  return JSON.parse(atob(padded)) as T
}

/**
 * The capture context names the exact SDK build and its SRI hash. Loading anything
 * else — a pinned CDN URL, a cached copy — risks a hash mismatch against the
 * context CyberSource issued, so the URL always comes from the JWT.
 */
export async function loadCyberSourceSdk(captureContext: string): Promise<void> {
  if (typeof readAcceptFactory() === 'function') {
    return
  }

  const jwtPayload = decodeJwtPayload<{
    ctx?: Array<{ data?: { clientLibrary?: string; clientLibraryIntegrity?: string } }>
  }>(captureContext)

  const clientLibrary = jwtPayload.ctx?.[0]?.data?.clientLibrary
  const clientLibraryIntegrity = jwtPayload.ctx?.[0]?.data?.clientLibraryIntegrity

  if (!clientLibrary || !clientLibraryIntegrity) {
    throw new Error('Unable to load the CyberSource payment library from captureContext.')
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[${SDK_SCRIPT_ATTRIBUTE}="true"]`
    )

    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.async = false
    script.crossOrigin = 'anonymous'
    script.setAttribute(SDK_SCRIPT_ATTRIBUTE, 'true')
    script.integrity = clientLibraryIntegrity
    script.src = clientLibrary
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load the CyberSource payment SDK.'))
    document.head.appendChild(script)
  })
}

/**
 * Drives Unified Checkout to completion. Resolves once the shopper has submitted a
 * payment method and CyberSource has returned the result JWT — which still has to
 * be exchanged server-side for an actual authorization.
 */
export async function runUnifiedCheckout(
  options: RunUnifiedCheckoutOptions
): Promise<UnifiedCheckoutResult> {
  const {
    captureContext,
    onPhase,
    paymentScreenSelector,
    paymentSelectionSelector,
    sidebar = false,
  } = options

  onPhase?.('loading-sdk')
  await loadCyberSourceSdk(captureContext)

  const acceptFactory = readAcceptFactory()

  if (typeof acceptFactory !== 'function') {
    throw new Error('The CyberSource payment library loaded, but window.Accept is unavailable.')
  }

  const accept = await acceptFactory(captureContext)
  const unifiedPayments = await accept.unifiedPayments(sidebar)

  onPhase?.('awaiting-input')

  const transientToken = await unifiedPayments.show({
    containers: {
      paymentScreen: paymentScreenSelector,
      paymentSelection: paymentSelectionSelector,
    },
  })

  onPhase?.('verifying')
  const resultJwt = await unifiedPayments.complete(transientToken)

  return { resultJwt, transientToken }
}

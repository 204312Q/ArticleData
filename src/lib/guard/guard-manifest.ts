import type { RateLimitConfig } from './rate-limit';

/**
 * Per-route flags consumed by `runRequestGuards` (merged with optional handler overrides).
 * Omit a flag or set it `false` to skip that validator.
 *
 * Manifest **keys** are always the HTTP path (`/api/...`). Next.js folders `(public)` and
 * `(s2s)` are omitted from URLs - e.g. a file under `app/api/(public)/contact/route.ts` is
 * still registered as `'/api/contact'`.
 *
 * @example **`(public)`** mutating handler (no `requireCustomer` / no BC `x-api-key`): abuse
 * control via IP rate limit and optional User-Agent checks - Peppercorn-style `/api/contact`:
 * ```ts
 * {
 *   useRateLimit: true,
 *   useUserAgent: true,
 *   rateLimitConfig: { maxAttempts: 3, windowMinutes: 5, retentionDays: 1 },
 * }
 * ```
 *
 * @example **`customer`** (after `requireCustomer()` in the route): same guard stack as many
 * Peppercorn customer routes - no `useApiKey` / `useHmac` unless you intentionally mirror S2S:
 * ```ts
 * {
 *   useRateLimit: true,
 *   useUserAgent: true,
 *   rateLimitConfig: { maxAttempts: 200, windowMinutes: 1, retentionDays: 1 },
 * }
 * ```
 *
 * Full S2S signing (`useTimestamp`, `useNonce`, `useHmac`, `useApiKey`, ...) is the default
 * for **`(s2s)/bc/**`** - see `BC_S2S` below.
 */
export type GuardManifestEntry = {
  useTimestamp?: boolean;
  useNonce?: boolean;
  useHmac?: boolean;
  useRateLimit?: boolean;
  useApiKey?: boolean;
  useInternalSession?: boolean;
  useUserAgent?: boolean;
  rateLimitConfig?: RateLimitConfig;
  logFailures?: boolean;
};

/** Default S2S stack for Business Central integration routes */
const BC_S2S: GuardManifestEntry = {
  useTimestamp: true,
  useNonce: true,
  useHmac: true,
  useRateLimit: true,
  useApiKey: true,
  rateLimitConfig: {
    maxAttempts: 10,
    windowMinutes: 1,
    retentionDays: 1,
  },
};

/** Active routes only. Do not add commented-out `/api/...` keys here - `guard-audit.mjs` parses this object. */
export const GUARD_MANIFEST: Record<string, GuardManifestEntry> = {
  '/api/payments/session': {
    useRateLimit: true,
    useUserAgent: true,
    rateLimitConfig: {
      maxAttempts: 10,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/payments/giftbox/session': {
    useRateLimit: true,
    useUserAgent: true,
    rateLimitConfig: {
      maxAttempts: 10,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/payments/confirm': {
    useRateLimit: true,
    useUserAgent: true,
    rateLimitConfig: {
      maxAttempts: 10,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/checkout/complete': {
    useRateLimit: true,
    rateLimitConfig: {
      maxAttempts: 10,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/checkout/giftbox/complete': {
    useRateLimit: true,
    rateLimitConfig: {
      maxAttempts: 10,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/banners': {
    useRateLimit: true,
    rateLimitConfig: {
      maxAttempts: 30,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/items': {
    useRateLimit: true,
    rateLimitConfig: {
      maxAttempts: 30,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/special-request-presets': {
    useRateLimit: true,
    rateLimitConfig: {
      maxAttempts: 30,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/customers': {
    useRateLimit: true,
    useUserAgent: true,
    rateLimitConfig: {
      maxAttempts: 20,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/orders/:orderNo/details': {
    useRateLimit: true,
    useUserAgent: true,
    rateLimitConfig: {
      maxAttempts: 30,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/promo-codes/validate': {
    useRateLimit: true,
    useUserAgent: true,
    rateLimitConfig: {
      maxAttempts: 20,
      windowMinutes: 1,
      retentionDays: 1,
    },
  },
  '/api/bc/upload-image': BC_S2S,
  '/api/bc/upload-pdf': BC_S2S,
  '/api/bc/customers': BC_S2S,
  '/api/bc/items': BC_S2S,
  '/api/bc/orders': BC_S2S,
  '/api/bc/giftbox/orders': BC_S2S,
  '/api/bc/special-request-presets': BC_S2S,
  '/api/bc/orders/:orderNo/details': BC_S2S,
};

const DYNAMIC_SEGMENT = '[^/]+';
const DYNAMIC_WILDCARD_SEGMENT = '.+';

export function normalizeGuardEndpoint(endpoint: string): string {
  const trimmedEndpoint = endpoint.trim();
  if (!trimmedEndpoint) return '/';

  const [pathOnly] = trimmedEndpoint.split('?');
  const normalizedLeadingSlash = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;

  if (normalizedLeadingSlash === '/') return normalizedLeadingSlash;

  return normalizedLeadingSlash.replace(/\/+$/, '');
}

function endpointPatternToRegex(endpointPattern: string): RegExp {
  const regexSource = endpointPattern
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':') && segment.endsWith('*')) {
        return DYNAMIC_WILDCARD_SEGMENT;
      }
      if (segment.startsWith(':')) {
        return DYNAMIC_SEGMENT;
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return new RegExp(`^${regexSource}$`);
}

export function getGuardConfig(endpoint: string): GuardManifestEntry | null {
  const normalizedEndpoint = normalizeGuardEndpoint(endpoint);

  const exactConfig = GUARD_MANIFEST[normalizedEndpoint];
  if (exactConfig) return exactConfig;

  for (const [pattern, config] of Object.entries(GUARD_MANIFEST)) {
    if (!pattern.includes(':')) continue;
    if (endpointPatternToRegex(pattern).test(normalizedEndpoint)) {
      return config;
    }
  }

  return null;
}

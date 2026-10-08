import { NextResponse, type NextRequest } from 'next/server';

import { validateApiKey } from './auth-api-key';
import { validateHmac } from './hmac-validation';
import { validateTimestamp } from './timestamp-validation';
import { validateUserAgent } from './user-agent-validation';
import { validateAndConsumeNonce } from './nonce-validation';
import { getGuardConfig, normalizeGuardEndpoint } from './guard-manifest';
import { getInternalSessionState, isInternalViewerSessionConfigured } from './internal-session';
import { getClientIp, logApiAttempt, checkRateLimit, type RateLimitConfig } from './rate-limit';

/** JSON envelope for guard failure responses (Peppercorn-compatible). */
export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T | null;
};

function failure(message: string, status = 400) {
  return NextResponse.json({ status, message, data: null }, { status });
}

/** Same envelope as Peppercorn `success()`; use from route handlers if you want `{ status, message, data }` on success. */
export function success<T>(data: T, message = 'OK', status = 200) {
  return NextResponse.json({ status, message, data }, { status });
}

export type RequestGuardContext = {
  endpoint: string;
  ipAddress: string;
  method: string;
  userAgent: string | null;
};

export type RequestGuardResult =
  | { ok: true; context: RequestGuardContext }
  | {
      ok: false;
      context: RequestGuardContext;
      response: ReturnType<typeof failure>;
    };

export type RequestGuardOptions = {
  useTimestamp?: boolean;
  useNonce?: boolean;
  useHmac?: boolean;
  useRateLimit?: boolean;
  useApiKey?: boolean;
  useInternalSession?: boolean;
  useUserAgent?: boolean;
  endpoint?: string;
  rateLimitConfig?: RateLimitConfig;
  logFailures?: boolean;
};

function shouldBypassGuardsForLocalSwagger(request: NextRequest): boolean {
  if (process.env.BC_SWAGGER_LOCAL_BYPASS !== 'true') return false;

  const host = request.headers.get('host')?.toLowerCase() ?? '';
  const referer = request.headers.get('referer')?.toLowerCase() ?? '';
  const isLocalHost = host.startsWith('localhost:') || host.startsWith('127.0.0.1:');
  const isSwaggerReferer = referer.includes('/cpnr-order-swagger.html');

  return isLocalHost && isSwaggerReferer;
}

async function logFailureAttemptIfNeeded(
  shouldLog: boolean,
  context: RequestGuardContext
): Promise<void> {
  if (!shouldLog) return;

  await logApiAttempt({
    endpoint: context.endpoint,
    method: context.method,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    success: false,
  });
}

export async function runRequestGuards(
  request: NextRequest,
  options: RequestGuardOptions = {}
): Promise<RequestGuardResult> {
  const endpoint = normalizeGuardEndpoint(options.endpoint ?? request.nextUrl.pathname);

  const context: RequestGuardContext = {
    endpoint,
    ipAddress: getClientIp(request),
    method: request.method,
    userAgent: request.headers.get('user-agent'),
  };

  if (shouldBypassGuardsForLocalSwagger(request)) {
    return {
      ok: true,
      context,
    };
  }

  const manifestConfig = getGuardConfig(context.endpoint);
  if (!manifestConfig) {
    console.error('[REQUEST GUARD] Missing guard manifest config', {
      endpoint: context.endpoint,
      method: context.method,
    });
    return {
      ok: false,
      context,
      response: failure(`Guard configuration missing for ${context.endpoint}`, 500),
    };
  }

  const effectiveOptions: RequestGuardOptions = { ...manifestConfig, ...options };
  const logFailures = effectiveOptions.logFailures ?? true;

  if (effectiveOptions.useTimestamp) {
    const timestampValidation = validateTimestamp(request);
    if (!timestampValidation.valid) {
      console.error('[REQUEST GUARD] Timestamp validation failed', {
        endpoint: context.endpoint,
        method: context.method,
      });
      await logFailureAttemptIfNeeded(logFailures, context);
      return {
        ok: false,
        context,
        response: failure(timestampValidation.error || 'Invalid timestamp', 400),
      };
    }
  }

  if (effectiveOptions.useNonce) {
    const nonceValidation = await validateAndConsumeNonce(request, context.endpoint);
    if (!nonceValidation.valid) {
      console.error('[REQUEST GUARD] Nonce validation failed', {
        endpoint: context.endpoint,
        method: context.method,
      });
      await logFailureAttemptIfNeeded(logFailures, context);
      return {
        ok: false,
        context,
        response: failure(nonceValidation.error || 'Unauthorized', 401),
      };
    }
  }

  if (effectiveOptions.useUserAgent) {
    const userAgentValidation = validateUserAgent(context.userAgent);
    if (!userAgentValidation.valid) {
      console.error('[REQUEST GUARD] User-Agent anomaly detected', {
        endpoint: context.endpoint,
        method: context.method,
        ipAddress: context.ipAddress,
      });
      await logFailureAttemptIfNeeded(logFailures, context);
      return {
        ok: false,
        context,
        response: failure(userAgentValidation.error, 403),
      };
    }
  }

  if (effectiveOptions.useRateLimit) {
    const rateLimitCheck = await checkRateLimit(
      context.endpoint,
      context.ipAddress,
      effectiveOptions.rateLimitConfig
    );
    if (!rateLimitCheck.allowed) {
      console.error('[REQUEST GUARD] Rate limit exceeded', {
        endpoint: context.endpoint,
        method: context.method,
        ipAddress: context.ipAddress,
      });
      await logFailureAttemptIfNeeded(logFailures, context);
      return {
        ok: false,
        context,
        response: failure('Too many requests. Please try again later.', 429),
      };
    }
  }

  if (effectiveOptions.useInternalSession) {
    if (!isInternalViewerSessionConfigured()) {
      console.error('[REQUEST GUARD] Internal session auth is not configured', {
        endpoint: context.endpoint,
        method: context.method,
      });
      await logFailureAttemptIfNeeded(logFailures, context);
      return {
        ok: false,
        context,
        response: failure('Internal API session is not configured', 500),
      };
    }

    const sessionState = getInternalSessionState(request);
    if (!sessionState.authenticated) {
      console.error('[REQUEST GUARD] Internal session validation failed', {
        endpoint: context.endpoint,
        method: context.method,
        ipAddress: context.ipAddress,
      });
      await logFailureAttemptIfNeeded(logFailures, context);
      return {
        ok: false,
        context,
        response: failure('Internal API session required', 401),
      };
    }
  }

  if (effectiveOptions.useApiKey && !validateApiKey(request)) {
    console.error('[REQUEST GUARD] API key validation failed', {
      endpoint: context.endpoint,
      method: context.method,
    });
    await logFailureAttemptIfNeeded(logFailures, context);
    return {
      ok: false,
      context,
      response: failure('Unauthorized', 401),
    };
  }

  if (effectiveOptions.useHmac) {
    const hmacValidation = await validateHmac(request);
    if (!hmacValidation.valid) {
      console.error('[REQUEST GUARD] HMAC validation failed', {
        endpoint: context.endpoint,
        method: context.method,
      });
      await logFailureAttemptIfNeeded(logFailures, context);
      return {
        ok: false,
        context,
        response: failure(hmacValidation.error || 'Unauthorized', 401),
      };
    }
  }

  return {
    ok: true,
    context,
  };
}

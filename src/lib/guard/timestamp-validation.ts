import type { NextRequest } from 'next/server';

export type TimestampValidationResult = {
  valid: boolean;
  error?: string;
  requestAge?: number; // milliseconds
};
const TIMESTAMP_HEADER_NAME = 'x-timestamp-ms';
const MAX_AGE_MS = Number(process.env.BC_REQUEST_MAX_AGE_MS ?? 30 * 1000); // 30 seconds
const CLOCK_SKEW_MS = Number(process.env.BC_REQUEST_CLOCK_SKEW_MS ?? 10 * 1000); // 10 seconds
const ERROR_MESSAGE = 'Connection timeout.';

/**
 * Parse strict epoch-millisecond timestamp (13-digit integer).
 */
export function parseEpochTimestampMs(rawTimestamp: string): number | null {
  const trimmed = rawTimestamp.trim();
  if (!/^\d{13}$/.test(trimmed)) {
    return null;
  }

  const numericValue = Number(trimmed);
  return Number.isFinite(numericValue) ? numericValue : null;
}

/**
 * Validate request timestamp to prevent delayed replay attacks.
 * Uses standardized header and timing window:
 * - Header: x-timestamp-ms
 * - Max age: BC_REQUEST_MAX_AGE_MS (default 30 seconds)
 * - Clock skew: BC_REQUEST_CLOCK_SKEW_MS (default 10 seconds)
 */
export function validateTimestamp(request: NextRequest): TimestampValidationResult {
  const timestamp = request.headers.get(TIMESTAMP_HEADER_NAME);
  const requestPath = request.nextUrl.pathname;

  if (!timestamp) {
    console.error('[TIMESTAMP GUARD] Missing timestamp header', {
      requestPath,
      headerName: TIMESTAMP_HEADER_NAME,
    });
    return {
      valid: false,
      error: ERROR_MESSAGE,
    };
  }

  const requestTime = parseEpochTimestampMs(timestamp);
  if (requestTime === null) {
    console.error('[TIMESTAMP GUARD] Invalid timestamp format', {
      requestPath,
      headerValue: timestamp,
    });
    return {
      valid: false,
      error: ERROR_MESSAGE,
    };
  }

  const now = Date.now();
  const age = now - requestTime;

  if (age < -CLOCK_SKEW_MS) {
    console.error('[TIMESTAMP GUARD] Timestamp too far in the future', {
      requestPath,
      age,
      threshold: -CLOCK_SKEW_MS,
    });
    return {
      valid: false,
      error: ERROR_MESSAGE,
      requestAge: age,
    };
  }

  if (age > MAX_AGE_MS) {
    console.error('[TIMESTAMP GUARD] Timestamp expired', {
      requestPath,
      age,
      threshold: MAX_AGE_MS,
    });
    return {
      valid: false,
      error: ERROR_MESSAGE,
      requestAge: age,
    };
  }

  return {
    valid: true,
    requestAge: age,
  };
}

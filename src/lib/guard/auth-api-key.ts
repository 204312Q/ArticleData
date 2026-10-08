import type { NextRequest } from 'next/server';

import { timingSafeEqual } from 'node:crypto';

/**
 * Validate API key from request headers using timing-safe comparison.
 * Defaults:
 * - Header: x-api-key
 * - Env var: BC_EXTENSION_API_KEY
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey) {
    return false;
  }

  const expectedApiKey = process.env.BC_EXTENSION_API_KEY;

  if (!expectedApiKey) {
    console.error('[API KEY AUTH] BC_EXTENSION_API_KEY not configured');
    return false;
  }

  try {
    const apiKeyBuffer = Buffer.from(apiKey, 'utf-8');
    const expectedKeyBuffer = Buffer.from(expectedApiKey, 'utf-8');

    if (apiKeyBuffer.length !== expectedKeyBuffer.length) {
      return false;
    }

    return timingSafeEqual(apiKeyBuffer, expectedKeyBuffer);
  } catch (error) {
    console.error('[API KEY AUTH] Error comparing API keys:', error);
    return false;
  }
}

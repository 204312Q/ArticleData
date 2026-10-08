import type { NextRequest } from 'next/server';

import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

export type NonceValidationResult = {
  valid: boolean;
  error?: string;
};

const NONCE_HEADER_NAME = 'x-nonce';
const DEFAULT_NONCE_TTL_MS = Number(process.env.BC_NONCE_TTL_MS ?? 10 * 60 * 1000); // 10 minutes
const NONCE_PATTERN = /^[A-Za-z0-9_-]{22}$/; // 16-byte base64url output
const NONCE_ERROR_MESSAGE = 'Unauthorized';

function parseNonce(rawNonce: string): string | null {
  const trimmed = rawNonce.trim();
  if (!NONCE_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export async function validateAndConsumeNonce(
  request: NextRequest,
  endpoint: string
): Promise<NonceValidationResult> {
  const rawNonce = request.headers.get(NONCE_HEADER_NAME);

  if (!rawNonce) {
    return {
      valid: false,
      error: NONCE_ERROR_MESSAGE,
    };
  }

  const nonce = parseNonce(rawNonce);
  if (!nonce) {
    return {
      valid: false,
      error: NONCE_ERROR_MESSAGE,
    };
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + DEFAULT_NONCE_TTL_MS);

  try {
    await prisma.$executeRawUnsafe(`DELETE FROM "api_request_nonces" WHERE "expires_at" < $1`, now);
  } catch (cleanupError) {
    console.error('[NONCE GUARD] Failed to cleanup expired nonces', cleanupError);
  }

  try {
    const insertedRows = await prisma.$queryRawUnsafe<Array<{ inserted: number }>>(
      `INSERT INTO "api_request_nonces" ("id", "endpoint", "nonce", "created_at", "expires_at")
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT ("endpoint", "nonce") DO NOTHING
       RETURNING 1 AS inserted`,
      randomUUID(),
      endpoint,
      nonce,
      now,
      expiresAt
    );

    if (insertedRows.length === 0) {
      return {
        valid: false,
        error: NONCE_ERROR_MESSAGE,
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('[NONCE GUARD] Failed to store nonce', error);
    return {
      valid: false,
      error: 'Nonce validation unavailable',
    };
  }
}

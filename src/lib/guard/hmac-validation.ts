import type { NextRequest } from 'next/server';

import { createHash, createHmac, timingSafeEqual } from 'crypto';

import { normalizeGuardEndpoint } from './guard-manifest';

export type HmacValidationResult = {
  valid: boolean;
  error?: string;
};

const SIGNATURE_HEADER_NAME = 'x-signature';
const TIMESTAMP_HEADER_NAME = 'x-timestamp-ms';
const NONCE_HEADER_NAME = 'x-nonce';
const SIGNATURE_PATTERN = /^[a-f0-9]{64}$/i;
const HMAC_ERROR_MESSAGE = 'Unauthorized';

function hashBodySha256Hex(body: string): string {
  return createHash('sha256').update(body).digest('hex');
}

function buildCanonicalString(params: {
  method: string;
  path: string;
  timestamp: string;
  nonce: string;
  bodySha256Hex: string;
}): string {
  return `${params.method.toUpperCase()}\n${params.path}\n${params.timestamp}\n${params.nonce}\n${params.bodySha256Hex}`;
}

function signCanonicalHex(secret: string, canonicalString: string): string {
  return createHmac('sha256', secret).update(canonicalString).digest('hex');
}

function safeCompareHex(expectedHex: string, actualHex: string): boolean {
  if (expectedHex.length !== actualHex.length) return false;

  return timingSafeEqual(Buffer.from(expectedHex, 'hex'), Buffer.from(actualHex, 'hex'));
}

export async function validateHmac(request: NextRequest): Promise<HmacValidationResult> {
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)?.trim().toLowerCase();
  const timestamp = request.headers.get(TIMESTAMP_HEADER_NAME)?.trim();
  const nonce = request.headers.get(NONCE_HEADER_NAME)?.trim();
  const currentSecret = process.env.HMAC_SECRET_CURRENT?.trim();
  const previousSecret = process.env.HMAC_SECRET_PREVIOUS?.trim();
  const requestPath = normalizeGuardEndpoint(request.nextUrl.pathname);
  const requestMethod = request.method;

  if (!currentSecret) {
    console.error('[HMAC GUARD] HMAC_SECRET_CURRENT is not configured');
    return {
      valid: false,
      error: 'HMAC configuration missing',
    };
  }

  if (!signature || !timestamp || !nonce || !SIGNATURE_PATTERN.test(signature)) {
    console.error('[HMAC GUARD] Missing or invalid HMAC headers', {
      requestPath,
      requestMethod,
      hasSignature: Boolean(signature),
      hasTimestamp: Boolean(timestamp),
      hasNonce: Boolean(nonce),
      signatureFormatValid: Boolean(signature && SIGNATURE_PATTERN.test(signature)),
    });
    return {
      valid: false,
      error: HMAC_ERROR_MESSAGE,
    };
  }

  const body = await request.clone().text();
  const bodySha256Hex = hashBodySha256Hex(body);
  const canonicalString = buildCanonicalString({
    method: requestMethod,
    path: requestPath,
    timestamp,
    nonce,
    bodySha256Hex,
  });

  const candidateSignatures = [currentSecret, previousSecret]
    .filter((secret): secret is string => Boolean(secret))
    .map((secret) => signCanonicalHex(secret, canonicalString));

  const isValid = candidateSignatures.some((expectedSignature) =>
    safeCompareHex(expectedSignature, signature)
  );

  if (!isValid) {
    console.error('[HMAC GUARD] Signature verification failed', {
      requestPath,
      requestMethod,
    });
    return {
      valid: false,
      error: HMAC_ERROR_MESSAGE,
    };
  }

  return { valid: true };
}

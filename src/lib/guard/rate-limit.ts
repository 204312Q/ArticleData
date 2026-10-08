import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

// Default rate limiting configuration
const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_ATTEMPT_WINDOW_MINUTES = 10;
const DEFAULT_RETENTION_DAYS = 30;

export interface RateLimitConfig {
  maxAttempts?: number;
  windowMinutes?: number;
  retentionDays?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts?: number;
  resetAt?: Date;
}

/**
 * Get client IP address from request
 */
export const getClientIp = (req: NextRequest): string => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown';
};

/**
 * Check rate limit for an endpoint
 * Returns whether the request is allowed and rate limit info
 */
export const checkRateLimit = async (
  endpoint: string,
  ipAddress: string,
  config: RateLimitConfig = {}
): Promise<RateLimitResult> => {
  const maxAttempts = config.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const windowMinutes = config.windowMinutes ?? DEFAULT_ATTEMPT_WINDOW_MINUTES;
  const retentionDays = config.retentionDays ?? DEFAULT_RETENTION_DAYS;

  console.log('[RATE LIMIT] Checking request', {
    endpoint,
    ipAddress,
    maxAttempts,
    windowMinutes,
    retentionDays,
  });

  // Cleanup old attempts (retention policy)
  const retentionCutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  try {
    await prisma.apiAttempt.deleteMany({
      where: {
        createdAt: {
          lt: retentionCutoff,
        },
      },
    });
  } catch (cleanupError) {
    console.error('[RATE LIMIT] Failed to cleanup old api attempts', {
      endpoint,
      ipAddress,
      retentionCutoff: retentionCutoff.toISOString(),
      error: cleanupError,
    });
  }

  // Count recent attempts from this IP for this endpoint
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
  let recentAttempts: number;
  try {
    recentAttempts = await prisma.apiAttempt.count({
      where: {
        endpoint,
        ipAddress,
        createdAt: {
          gte: windowStart,
        },
      },
    });
  } catch (countError) {
    console.error('[RATE LIMIT] Failed to count recent api attempts', {
      endpoint,
      ipAddress,
      windowStart: windowStart.toISOString(),
      error: countError,
    });
    throw countError;
  }

  console.log('[RATE LIMIT] Recent attempts counted', {
    endpoint,
    ipAddress,
    recentAttempts,
  });

  const allowed = recentAttempts < maxAttempts;
  const remainingAttempts = allowed ? maxAttempts - recentAttempts - 1 : 0;
  const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000);

  return {
    allowed,
    remainingAttempts,
    resetAt,
  };
};

/**
 * Log an API attempt (success or failure)
 */
export const logApiAttempt = async (params: {
  endpoint: string;
  method: string;
  ipAddress: string;
  userAgent: string | null;
  email?: string;
  success: boolean;
}): Promise<void> => {
  try {
    await prisma.apiAttempt.create({
      data: {
        endpoint: params.endpoint,
        method: params.method,
        email: params.email,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        success: params.success,
      },
    });
  } catch (logError) {
    console.error('Failed to log api attempt:', logError);
  }
};

/**
 * Rate limit middleware helper
 * Checks rate limit and returns error response if exceeded
 * Use this in your API route handlers
 */
export const withRateLimit = async (
  req: NextRequest,
  config: RateLimitConfig = {}
): Promise<{ allowed: boolean; error?: Response }> => {
  const endpoint = req.nextUrl.pathname;
  const ipAddress = getClientIp(req);

  const rateLimitResult = await checkRateLimit(endpoint, ipAddress, config);

  if (!rateLimitResult.allowed) {
    return {
      allowed: false,
      error: new Response(
        JSON.stringify({
          status: 429,
          message: 'Too many requests. Please try again later.',
          data: null,
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    };
  }

  return { allowed: true };
};

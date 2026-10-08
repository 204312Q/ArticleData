import type { NextRequest, NextResponse } from 'next/server';

import { runRequestGuards } from './request-guard';

/** Returns a JSON response to short-circuit the handler, or `null` when guards pass. */
export async function assertRequestGuards(request: NextRequest): Promise<NextResponse | null> {
  const result = await runRequestGuards(request);
  if (!result.ok) {
    return result.response;
  }
  return null;
}

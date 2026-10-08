import type { Mock } from "vitest";

export function buildGuardFailureResponse(status = 401, message = "Unauthorized"): Response {
  return Response.json({ status, message, data: null }, { status });
}

export function mockGuardPass(assertGuardMock: Mock): void {
  assertGuardMock.mockResolvedValue(null);
}

export function mockGuardFail(assertGuardMock: Mock, status = 401, message = "Unauthorized"): void {
  assertGuardMock.mockResolvedValue(buildGuardFailureResponse(status, message));
}

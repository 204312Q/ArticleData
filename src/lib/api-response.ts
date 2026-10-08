import type { ZodError } from "zod";

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T | null;
};

export function success<T>(data: T, message = "OK", status = 200): Response {
  const payload: ApiResponse<T> = { status, message, data };
  return Response.json(payload, { status });
}

export function failure(message: string, status = 400, data: null = null): Response {
  const payload: ApiResponse<null> = { status, message, data };
  return Response.json(payload, { status });
}

export function firstZodErrorMessage(error: ZodError, fallback = "Request Param Invalid"): string {
  return error.issues[0]?.message ?? fallback;
}

import type { NextRequest } from "next/server";

type CreateRequestOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
};

export function createRequest(url: string, options: CreateRequestOptions = {}): NextRequest {
  const request = new Request(url, {
    method: options.method ?? "GET",
    headers: options.headers,
    body: options.body,
  });

  return request as unknown as NextRequest;
}

export function createJsonRequest(
  url: string,
  method: string,
  payload?: unknown,
  headers: HeadersInit = {}
): NextRequest {
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has("content-type")) {
    requestHeaders.set("content-type", "application/json");
  }

  const body = payload === undefined ? undefined : JSON.stringify(payload);

  return createRequest(url, {
    method,
    headers: requestHeaders,
    body,
  });
}

export async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

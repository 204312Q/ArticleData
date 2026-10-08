import type { NextRequest } from "next/server"

import { createHmac, timingSafeEqual } from "node:crypto"

export const INTERNAL_API_SESSION_COOKIE = "cpnr_internal_api_session"

type InternalSessionPayload = {
  exp: number
  sub: string
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function getSessionSecret(): string {
  return getRequiredEnv("INTERNAL_API_SESSION_SECRET")
}

function getSessionUsername(): string {
  return getRequiredEnv("INTERNAL_API_VIEWER_USERNAME")
}

export function getInternalSessionTtlSeconds(): number {
  const raw = Number.parseInt(process.env.INTERNAL_API_SESSION_TTL_SECONDS ?? "28800", 10)
  return Number.isFinite(raw) && raw > 0 ? raw : 28800
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url")
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url")
}

function parsePayload(token: string): InternalSessionPayload | null {
  const [encodedPayload, signature] = token.split(".")
  if (!encodedPayload || !signature) return null

  const expectedSignature = sign(encodedPayload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(decodeBase64Url(encodedPayload))
  } catch {
    return null
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof (parsed as InternalSessionPayload).sub !== "string" ||
    typeof (parsed as InternalSessionPayload).exp !== "number"
  ) {
    return null
  }

  return parsed as InternalSessionPayload
}

export function createInternalSessionToken(): { expiresAt: string; token: string; username: string } {
  const username = getSessionUsername()
  const exp = Math.floor(Date.now() / 1000) + getInternalSessionTtlSeconds()
  const payload: InternalSessionPayload = {
    exp,
    sub: username,
  }

  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signature = sign(encodedPayload)

  return {
    expiresAt: new Date(exp * 1000).toISOString(),
    token: `${encodedPayload}.${signature}`,
    username,
  }
}

export function verifyInternalViewerCredentials(username: string, password: string): boolean {
  const expectedUsername = getSessionUsername()
  const expectedPassword = getRequiredEnv("INTERNAL_API_VIEWER_PASSWORD")

  return username === expectedUsername && password === expectedPassword
}

export function getInternalSessionState(
  request: NextRequest,
): { authenticated: boolean; expiresAt: string | null; username: string | null } {
  const token = request.cookies.get(INTERNAL_API_SESSION_COOKIE)?.value
  if (!token) {
    return {
      authenticated: false,
      expiresAt: null,
      username: null,
    }
  }

  const payload = parsePayload(token)
  if (!payload) {
    return {
      authenticated: false,
      expiresAt: null,
      username: null,
    }
  }

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp <= now) {
    return {
      authenticated: false,
      expiresAt: null,
      username: null,
    }
  }

  return {
    authenticated: true,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    username: payload.sub,
  }
}

export function isInternalViewerSessionConfigured(): boolean {
  return Boolean(
    process.env.INTERNAL_API_VIEWER_USERNAME?.trim() &&
      process.env.INTERNAL_API_VIEWER_PASSWORD?.trim() &&
      process.env.INTERNAL_API_SESSION_SECRET?.trim(),
  )
}

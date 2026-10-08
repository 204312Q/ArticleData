import type { NextRequest } from "next/server";

import { auth } from "@/auth"
import { NextResponse } from "next/server"

const PUBLIC_PREFIXES = [
  "/api/auth/",
  "/api/bc/",
  "/api/checkout/",
  "/api/docs/",
  "/api/payments/",
  "/api/promo-codes/",
]

const PUBLIC_EXACT = new Set([
  "/api/banners",
  "/api/items",
  "/api/blocked-dates",
  "/api/special-request-presets",
])

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

type ExtendedNextRequest = NextRequest & { auth?: any }

export default auth((req: ExtendedNextRequest) => {
  const { pathname } = req.nextUrl
  if (isPublicPath(pathname)) return NextResponse.next()
  if (!req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", req.url)
    return NextResponse.redirect(signInUrl)
  }
  return NextResponse.next()
})

export const config = {
  // /pay-lab is listed explicitly as well as by wildcard so the bare path is
  // covered. Its API routes live under /api/paylab/ — deliberately outside the
  // PUBLIC_PREFIXES list above, so they inherit the same Entra ID requirement.
  matcher: ["/api/:path*", "/pay-lab", "/pay-lab/:path*"],
}

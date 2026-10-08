export const runtime = "nodejs"

// Temporarily disabled: this public wrapper re-exported the same handler as
// the properly HMAC-guarded /api/bc/customers, but only had rate-limit +
// user-agent checks — no auth — exposing customer PII (email/phone/address)
// to unauthenticated callers. Flagged to Isaac (authored in 148f255, which
// called these "internal session-protected", but the manifest never set
// useInternalSession). Short-circuited here rather than deleted so it's a
// one-line revert once the real fix (useInternalSession, or removal) lands.
export async function GET() {
  return Response.json({ error: "Not found" }, { status: 404 })
}

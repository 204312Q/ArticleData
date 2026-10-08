export const runtime = "nodejs"

// Temporarily disabled — same issue and same fix as
// src/app/api/(public)/customers/route.ts: this wrapper exposed full order +
// delivery details to unauthenticated callers via the same handler that
// /api/bc/orders/:orderNo/details already serves behind a full HMAC guard.
// See that file's comment for context; short-circuited rather than deleted
// pending Isaac's confirmation.
export async function GET() {
  return Response.json({ error: "Not found" }, { status: 404 })
}

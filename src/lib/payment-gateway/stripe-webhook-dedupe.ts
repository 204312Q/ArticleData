import { prisma } from "@/lib/prisma"
import { randomUUID } from "node:crypto"

const STRIPE_WEBHOOK_ENDPOINT = "stripe-webhook"
// Stripe can retry the same event for days if it doesn't see a 2xx — keep the
// dedupe record around well past that window.
const DEDUPE_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

// Plain existence check — no insert. Used up front so a thrown error further
// down never gets a chance to have already marked the event as processed;
// see markStripeEventProcessedOnce below for when the insert actually happens.
export async function hasStripeEventBeenProcessed(eventId: string): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<Array<{ found: number }>>(
    `SELECT 1 AS found FROM "api_request_nonces" WHERE "endpoint" = $1 AND "nonce" = $2`,
    STRIPE_WEBHOOK_ENDPOINT,
    eventId
  )

  return rows.length > 0
}

// Reuses the same api_request_nonces table the HMAC/nonce request guard uses,
// keyed by Stripe's event id instead of a request header — Stripe delivers
// webhooks at-least-once, so the same event.id can arrive more than once.
// Call this only after the event has been fully and successfully processed —
// calling it beforehand would mark a failed attempt as done, so a genuine
// Stripe retry would be silently skipped instead of reprocessed.
export async function markStripeEventProcessedOnce(eventId: string): Promise<boolean> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + DEDUPE_TTL_MS)

  const insertedRows = await prisma.$queryRawUnsafe<Array<{ inserted: number }>>(
    `INSERT INTO "api_request_nonces" ("id", "endpoint", "nonce", "created_at", "expires_at")
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT ("endpoint", "nonce") DO NOTHING
     RETURNING 1 AS inserted`,
    randomUUID(),
    STRIPE_WEBHOOK_ENDPOINT,
    eventId,
    now,
    expiresAt
  )

  return insertedRows.length > 0
}

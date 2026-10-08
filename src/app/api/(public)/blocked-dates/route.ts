import type { NextRequest } from "next/server"

import { orderBackend } from "@/lib/order-backend"
import { BCRequestError, listCPNRBlockedDates } from "@/lib/bcClient"
import { CTBackendError, listCTBNonOperatingDays } from "@/lib/ct-backend/client"

export const runtime = "nodejs"

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function GET(_request: NextRequest): Promise<Response> {
  try {
    const records =
      orderBackend() === "bc"
        ? (await listCPNRBlockedDates()).map((r) => ({
            date: normalizeString(r.blockedDate),
            description: normalizeString(r.description),
          }))
        : (await listCTBNonOperatingDays()).map((r) => ({
            date: normalizeString(r.date),
            description: normalizeString(r.reason),
          }))

    const dates = records
      .filter((r): r is { date: string; description: string | null } => r.date !== null)
      .sort((a, b) => a.date.localeCompare(b.date))

    return Response.json({
      success: true,
      count: dates.length,
      dates,
    })
  } catch (error) {
    if (error instanceof BCRequestError) {
      return Response.json(
        {
          error: "BC request failed",
          status: error.status,
          details: error.body,
        },
        { status: error.status },
      )
    }

    if (error instanceof CTBackendError) {
      return Response.json(
        {
          error: "CT Backend request failed",
          status: error.status,
        },
        { status: error.status },
      )
    }

    const message = error instanceof Error ? error.message : "Failed to load blocked dates"
    return Response.json({ error: message }, { status: 500 })
  }
}

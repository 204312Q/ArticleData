import type { NextRequest } from "next/server"

import { listBCCustomers } from "@/lib/bcClient"
import { assertRequestGuards } from "@/lib/guard/assert"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  try {
    const url = new URL(request.url)
    const topRaw = url.searchParams.get("top")
    const top = topRaw ? Number.parseInt(topRaw, 10) : 50
    const safeTop = Number.isFinite(top) && top > 0 ? Math.min(top, 200) : 50

    const customers = await listBCCustomers(safeTop)

    return Response.json({
      success: true,
      count: customers.length,
      customers,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load BC customers"
    return Response.json({ error: message }, { status: 500 })
  }
}

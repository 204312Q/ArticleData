import type { NextRequest } from "next/server"

import { assertRequestGuards } from "@/lib/guard/assert"
import { listCPNRSpecialReqPresets } from "@/lib/bcClient"

export const runtime = "nodejs"

function parseBoolean(raw: string | null, defaultValue: boolean): boolean {
  if (!raw) return defaultValue

  const value = raw.trim().toLowerCase()
  if (value === "1" || value === "true" || value === "yes") return true
  if (value === "0" || value === "false" || value === "no") return false

  return defaultValue
}

export async function GET(request: NextRequest) {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  try {
    const url = new URL(request.url)

    const topRaw = url.searchParams.get("top")
    const top = topRaw ? Number.parseInt(topRaw, 10) : 200
    const safeTop = Number.isFinite(top) && top > 0 ? Math.min(top, 1000) : 200

    const includeBlocked = parseBoolean(url.searchParams.get("includeBlocked"), false)
    const presets = await listCPNRSpecialReqPresets(safeTop)

    const filtered = includeBlocked ? presets : presets.filter((preset) => preset.blocked !== true)
    const sorted = [...filtered].sort((a, b) => {
      const aSort = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER
      const bSort = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER
      if (aSort !== bSort) return aSort - bSort

      const aCode = typeof a.code === "string" ? a.code : ""
      const bCode = typeof b.code === "string" ? b.code : ""
      return aCode.localeCompare(bCode)
    })

    return Response.json({
      success: true,
      count: sorted.length,
      presets: sorted,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load special request presets"
    return Response.json({ error: message }, { status: 500 })
  }
}

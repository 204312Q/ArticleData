import type { NextRequest } from "next/server"

import { assertRequestGuards } from "@/lib/guard/assert"
import { GET as handleGET, POST as handlePOST, DELETE as handleDELETE } from "@/lib/uploadHandler"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  return handlePOST(request)
}

export async function GET(request: NextRequest) {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  return handleGET(request)
}

export async function DELETE(request: NextRequest) {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  return handleDELETE(request)
}

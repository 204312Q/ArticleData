import { auth } from "@/auth"
import { type NextRequest } from "next/server"
import { cpnrBcS2sOpenApiV1 } from "@/lib/openapi/cpnrBcS2sV1"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  const origin = new URL(request.url).origin
  const existingServers = cpnrBcS2sOpenApiV1.servers ?? []
  const dedupedServers = existingServers.filter((server) => server.url !== origin)

  return Response.json({
    ...cpnrBcS2sOpenApiV1,
    servers: [{ url: origin, description: "Current origin" }, ...dedupedServers],
  })
}

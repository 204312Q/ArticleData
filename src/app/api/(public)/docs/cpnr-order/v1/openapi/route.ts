import { auth } from "@/auth"
import { type NextRequest } from "next/server"
import { cpnrOrderOpenApiV1 } from "@/lib/openapi/cpnrOrderV1"

export const runtime = "nodejs"

const PROTECTED_PATHS = new Set([
  "/api/bc/orders",
  "/api/bc/giftbox/orders",
  "/api/customers",
  "/api/orders/{orderNo}/details",
])

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin
  const existingServers = cpnrOrderOpenApiV1.servers ?? []
  const dedupedServers = existingServers.filter((server) => server.url !== origin)
  const session = await auth()
  const allPaths = cpnrOrderOpenApiV1.paths ?? {}
  const visiblePaths = Object.fromEntries(
    Object.entries(allPaths).filter(([path]) => !!session || !PROTECTED_PATHS.has(path)),
  )
  const visibleTagNames = new Set<string>()

  for (const pathItem of Object.values(visiblePaths)) {
    for (const operation of Object.values(pathItem ?? {})) {
      if (!operation || typeof operation !== "object" || !("tags" in operation)) continue
      const tags = (operation as { tags?: string[] }).tags ?? []
      for (const tag of tags) {
        visibleTagNames.add(tag)
      }
    }
  }

  return Response.json({
    ...cpnrOrderOpenApiV1,
    paths: visiblePaths,
    servers: [{ url: origin, description: "Current origin" }, ...dedupedServers],
    tags: (cpnrOrderOpenApiV1.tags ?? []).filter((tag) => visibleTagNames.has(tag.name)),
  })
}

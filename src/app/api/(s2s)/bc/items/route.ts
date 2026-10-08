import type { NextRequest } from "next/server"

import { assertRequestGuards } from "@/lib/guard/assert"
import { listBCItems, type BCItem } from "@/lib/bcClient"

export const runtime = "nodejs"
const BC_ITEMS_REVALIDATE_SECONDS = 300

type ProductGroup = "Addon" | "Package" | "PartnerProduct" | "Bundle" | "Giftbox"

interface GroupedItem {
  number: string
  displayName: string | null
  description: string | null
  type: string | null
  unitPrice: number | null
  blocked: boolean | null
  productGroup: ProductGroup
  inAddonSection: boolean
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function resolveProductGroup(itemNo: string): ProductGroup | null {
  const upper = itemNo.toUpperCase()
  if (upper.startsWith("CFM-ADN-")) return "Addon"
  if (upper.startsWith("CFM-PCP-")) return "Package"
  if (upper.startsWith("CFM-PPD-")) return "PartnerProduct"
  if (upper.startsWith("CFM-BND-")) return "Bundle"
  if (upper.startsWith("CFM-GFT-")) return "Giftbox"
  return null
}

function toGroupedItem(item: BCItem): GroupedItem | null {
  const number = normalizeString(item.number)
  if (!number) return null

  const upper = number.toUpperCase()
  if (!upper.startsWith("CFM-")) return null
  if (upper.startsWith("CFM-DCP-")) return null

  const productGroup = resolveProductGroup(number)
  if (!productGroup) return null

  return {
    number,
    displayName: normalizeString(item.displayName),
    description: normalizeString(item.description),
    type: normalizeString(item.type),
    unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : null,
    blocked: typeof item.blocked === "boolean" ? item.blocked : null,
    productGroup,
    inAddonSection: productGroup === "Addon" || productGroup === "PartnerProduct",
  }
}

export async function GET(request: NextRequest) {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  try {
    const url = new URL(request.url)
    const topRaw = url.searchParams.get("top")
    const top = topRaw ? Number.parseInt(topRaw, 10) : 1000
    const safeTop = Number.isFinite(top) && top > 0 ? Math.min(top, 5000) : 1000

    const bcItems = await listBCItems(safeTop, "startswith(number,'CFM-')", {
      next: {
        revalidate: BC_ITEMS_REVALIDATE_SECONDS,
        tags: ["bc-items"],
      },
    })
    const groupedItems = bcItems
      .map((item) => toGroupedItem(item))
      .filter((item): item is GroupedItem => Boolean(item))
      .sort((a, b) => a.number.localeCompare(b.number))

    const addons = groupedItems.filter((item) => item.productGroup === "Addon")
    const partnerProducts = groupedItems.filter((item) => item.productGroup === "PartnerProduct")
    const packages = groupedItems.filter((item) => item.productGroup === "Package")
    const bundles = groupedItems.filter((item) => item.productGroup === "Bundle")
    const giftboxes = groupedItems.filter((item) => item.productGroup === "Giftbox")

    return Response.json({
      success: true,
      count: groupedItems.length,
      groups: {
        addons,
        packages,
        partnerProducts,
        bundles,
        giftboxes,
        addonSection: [...addons, ...partnerProducts],
      },
      items: groupedItems,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load BC items"
    return Response.json({ error: message }, { status: 500 })
  }
}

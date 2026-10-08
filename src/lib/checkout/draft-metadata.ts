import type { CheckoutDraft } from "./complete-order"

// Stashes a draft object in a Stripe Checkout Session's own metadata so the
// payment webhook can create the order even if the customer's browser never
// returns to read the draft back out of sessionStorage.
//
// Fixed-shape sections (delivery, pricing, etc.) get one metadata key each via
// encodeSectionedMetadata — safe as long as a single instance of that section
// stays under Stripe's ~500-character-per-metadata-value limit. Sections that
// repeat per line item (addOns, giftbox items) do NOT have a bounded size — a
// customer can add an arbitrary number of them — so those go through
// encodeRepeatedMetadata instead, one metadata key per entry, so the limit
// only ever has to fit a single entry, not the whole list.
export function encodeSectionedMetadata<T extends Record<string, unknown>>(
  draft: T,
  sections: readonly (keyof T & string)[],
  prefix: string
): Record<string, string> {
  const metadata: Record<string, string> = {}

  for (const section of sections) {
    metadata[`${prefix}_${section}`] = JSON.stringify(draft[section])
  }

  return metadata
}

export function decodeSectionedMetadata<T>(
  metadata: Record<string, string | undefined | null>,
  sections: readonly string[],
  prefix: string
): T | null {
  try {
    const parsed: Record<string, unknown> = {}

    for (const section of sections) {
      const raw = metadata[`${prefix}_${section}`]
      if (!raw) {
        return null
      }
      parsed[section] = JSON.parse(raw)
    }

    return parsed as T
  } catch {
    return null
  }
}

// One metadata key per array entry (plus a `${key}_count` key) instead of one
// key for the whole array, so an individual value's size never depends on how
// many entries the customer added.
export function encodeRepeatedMetadata<T>(
  items: readonly T[],
  key: string,
  prefix: string
): Record<string, string> {
  const metadata: Record<string, string> = {
    [`${prefix}_${key}_count`]: String(items.length),
  }

  items.forEach((item, index) => {
    metadata[`${prefix}_${key}_${index}`] = JSON.stringify(item)
  })

  return metadata
}

export function decodeRepeatedMetadata<T>(
  metadata: Record<string, string | undefined | null>,
  key: string,
  prefix: string
): T[] | null {
  const countRaw = metadata[`${prefix}_${key}_count`]
  if (!countRaw) {
    return null
  }

  const count = Number(countRaw)
  if (!Number.isInteger(count) || count < 0) {
    return null
  }

  try {
    const items: T[] = []

    for (let index = 0; index < count; index += 1) {
      const raw = metadata[`${prefix}_${key}_${index}`]
      if (!raw) {
        return null
      }
      items.push(JSON.parse(raw) as T)
    }

    return items
  } catch {
    return null
  }
}

const DRAFT_METADATA_PREFIX = "draft"
const DRAFT_METADATA_SECTIONS = [
  "draftId",
  "summary",
  "packageSelection",
  "bundles",
  "specialRequests",
  "delivery",
  "pricing",
] as const

export function encodeDraftMetadata(draft: CheckoutDraft): Record<string, string> {
  return {
    ...encodeSectionedMetadata(draft, DRAFT_METADATA_SECTIONS, DRAFT_METADATA_PREFIX),
    ...encodeRepeatedMetadata(draft.addOns, "addOns", DRAFT_METADATA_PREFIX),
  }
}

export function decodeDraftMetadata(metadata: Record<string, string | undefined | null>): CheckoutDraft | null {
  const base = decodeSectionedMetadata<Omit<CheckoutDraft, "addOns">>(
    metadata,
    DRAFT_METADATA_SECTIONS,
    DRAFT_METADATA_PREFIX
  )
  if (!base) {
    return null
  }

  const addOns = decodeRepeatedMetadata<CheckoutDraft["addOns"][number]>(metadata, "addOns", DRAFT_METADATA_PREFIX)
  if (!addOns) {
    return null
  }

  return { ...base, addOns }
}

import type { NextRequest } from "next/server"

import { assertRequestGuards } from "@/lib/guard/assert"
import {
  BCRequestError,
  findCPNROrderByOrderNo,
  getCPNROrderLineProfile,
  type CPNROrderLineRecord,
  listCPNROrderLineReqPresets,
  listBCSalesOrderLinesByOrderNo,
  type CPNROrderLineProfileRecord,
  findCPNROrderHeaderCtrlByOrderNo,
} from "@/lib/bcClient"

export const runtime = "nodejs"

interface ConsolidatedHeader {
  externalDocumentNo: string | null
  dateType: string | null
  eddDate: string | null
  confirmedStartDate: string | null
  orderSource: string | null
  noWeekendDeliveries: boolean | null
}

interface ConsolidatedLine {
  salesLineNo: number | null
  itemNo: string | null
  description: string | null
  quantity: number | null
  unitPrice: number | null
}

interface ConsolidatedLineProfile {
  portion: string | null
  session: string | null
  firstMealSession: string | null
  riceOption: string | null
  specialRequestPresets: string[]
  specialRequestNote: string | null
}

interface CalendarEligibility {
  isCalendarEligible: boolean
  eligibilityReason: string
  packageDays: number | null
  startDate: string | null
  endDate: string | null
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function normalizeDateLiteral(value: unknown): string | null {
  const raw = normalizeString(value)
  if (!raw) return null

  if (raw === "0001-01-01") return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null

  return raw
}

function toConsolidatedLine(line: CPNROrderLineRecord): ConsolidatedLine {
  return {
    salesLineNo: typeof line.salesLineNo === "number" ? line.salesLineNo : null,
    itemNo: normalizeString(line.itemNo),
    description: normalizeString(line.description),
    quantity: typeof line.quantity === "number" ? line.quantity : null,
    unitPrice: typeof line.unitPrice === "number" ? line.unitPrice : null,
  }
}

function extractPackageDays(packageLine: CPNROrderLineRecord | null): number | null {
  if (!packageLine) return null

  const description = normalizeString(packageLine.description) ?? ""
  const itemNo = normalizeString(packageLine.itemNo) ?? ""
  const candidates = [description, itemNo]

  for (const candidate of candidates) {
    const fromDays = candidate.match(/(\d+)\s*days?/i)
    if (fromDays) {
      const parsed = Number.parseInt(fromDays[1], 10)
      if (Number.isInteger(parsed) && parsed > 0) return parsed
    }

    const fromShortCode = candidate.match(/(?:^|[^0-9])(\d{1,3})\s*D(?:[^A-Z]|$)/i)
    if (fromShortCode) {
      const parsed = Number.parseInt(fromShortCode[1], 10)
      if (Number.isInteger(parsed) && parsed > 0) return parsed
    }
  }

  return null
}

function addDaysToIsoDate(isoDate: string, daysToAdd: number): string {
  const [year, month, day] = isoDate.split("-").map((part) => Number.parseInt(part, 10))
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + daysToAdd)
  return date.toISOString().slice(0, 10)
}

function buildCalendarEligibility(
  dateType: string | null,
  confirmedStartDate: string | null,
  packageLine: CPNROrderLineRecord | null,
): CalendarEligibility {
  const packageDays = extractPackageDays(packageLine)

  if (!dateType || dateType.toLowerCase() !== "confirmed") {
    return {
      isCalendarEligible: false,
      eligibilityReason: "date_type_not_confirmed",
      packageDays,
      startDate: null,
      endDate: null,
    }
  }

  if (!confirmedStartDate) {
    return {
      isCalendarEligible: false,
      eligibilityReason: "confirmed_start_date_missing",
      packageDays,
      startDate: null,
      endDate: null,
    }
  }

  if (!packageLine) {
    return {
      isCalendarEligible: false,
      eligibilityReason: "package_line_missing",
      packageDays,
      startDate: confirmedStartDate,
      endDate: null,
    }
  }

  if (!packageDays) {
    return {
      isCalendarEligible: false,
      eligibilityReason: "package_days_missing",
      packageDays: null,
      startDate: confirmedStartDate,
      endDate: null,
    }
  }

  return {
    isCalendarEligible: true,
    eligibilityReason: "eligible",
    packageDays,
    startDate: confirmedStartDate,
    endDate: addDaysToIsoDate(confirmedStartDate, packageDays - 1),
  }
}

function buildLineProfile(
  profile: CPNROrderLineProfileRecord | null,
  specialRequestPresets: string[],
): ConsolidatedLineProfile | null {
  if (!profile && specialRequestPresets.length === 0) return null

  return {
    portion: normalizeString(profile?.portion),
    session: normalizeString(profile?.session),
    firstMealSession: normalizeString(profile?.firstMealSession),
    riceOption: normalizeString(profile?.riceOption),
    specialRequestPresets,
    specialRequestNote: normalizeString(profile?.specialRequestNote),
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderNo: string }> },
) {
  const guardResponse = await assertRequestGuards(request)
  if (guardResponse) return guardResponse

  try {
    const params = await context.params
    const orderNo = params.orderNo?.trim()

    if (!orderNo) {
      return Response.json({ error: "Missing orderNo path parameter" }, { status: 400 })
    }

    const [orderHeaderCtrl, orderHeaderSnapshot] = await Promise.all([
      findCPNROrderHeaderCtrlByOrderNo(orderNo),
      findCPNROrderByOrderNo(orderNo),
    ])

    if (!orderHeaderCtrl && !orderHeaderSnapshot) {
      return Response.json({ error: `Sales order ${orderNo} not found` }, { status: 404 })
    }

    const lines = await listBCSalesOrderLinesByOrderNo(orderNo)
    const itemLines = lines.filter((line) => (normalizeString(line.itemNo) ?? "") !== "")
    const packageLine = itemLines[0] ?? null
    const addonLines = itemLines.slice(1)

    let lineProfile: CPNROrderLineProfileRecord | null = null
    let presetCodes: string[] = []

    if (packageLine && typeof packageLine.salesLineNo === "number") {
      lineProfile = await getCPNROrderLineProfile("Order", orderNo, packageLine.salesLineNo)

      const presetRows = await listCPNROrderLineReqPresets("Order", orderNo, packageLine.salesLineNo)
      presetCodes = presetRows
        .map((row) => normalizeString(row.presetCode))
        .filter((code): code is string => Boolean(code))

      if (presetCodes.length === 0) {
        const fallbackPreset = normalizeString(lineProfile?.specialRequestPreset)
        if (fallbackPreset) presetCodes = [fallbackPreset]
      }
    }

    const header: ConsolidatedHeader = {
      externalDocumentNo: normalizeString(orderHeaderSnapshot?.externalDocumentNo),
      dateType: normalizeString(orderHeaderCtrl?.dateType ?? orderHeaderSnapshot?.dateType),
      eddDate: normalizeDateLiteral(orderHeaderCtrl?.eddDate ?? orderHeaderSnapshot?.eddDate),
      confirmedStartDate: normalizeDateLiteral(
        orderHeaderCtrl?.confirmedStartDate ?? orderHeaderSnapshot?.confirmedStartDate,
      ),
      orderSource: normalizeString(orderHeaderCtrl?.orderSource ?? orderHeaderSnapshot?.orderSource),
      noWeekendDeliveries:
        typeof orderHeaderCtrl?.noWeekendDeliveries === "boolean" ? orderHeaderCtrl.noWeekendDeliveries : null,
    }

    const calendar = buildCalendarEligibility(header.dateType, header.confirmedStartDate, packageLine)

    return Response.json({
      success: true,
      orderNo,
      header,
      packageLine: packageLine ? toConsolidatedLine(packageLine) : null,
      addons: addonLines.map((line) => toConsolidatedLine(line)),
      lineProfile: buildLineProfile(lineProfile, presetCodes),
      calendar,
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

    if (error instanceof Error) {
      if (error.message.startsWith("Sales order ") && error.message.endsWith(" not found")) {
        return Response.json({ error: error.message }, { status: 404 })
      }

      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ error: "Failed to load consolidated order details" }, { status: 500 })
  }
}



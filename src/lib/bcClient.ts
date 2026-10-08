import { getBCToken } from "./bcAuth"

type JsonRecord = Record<string, unknown>
type BCFetchInit = RequestInit & {
  next?: {
    revalidate?: number
    tags?: string[]
  }
}

export interface BCPagedResponse<T> {
  value: T[]
}

export interface BCCustomer extends JsonRecord {
  address?: string
  address2?: string
  id?: string
  number?: string
  displayName?: string
  email?: string
  phoneNumber?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  country?: string
  postalCode?: string
  postCode?: string
  name?: string
  genBusPostingGroup?: string
  customerPostingGroup?: string
  vatBusPostingGroup?: string
}

export interface BCCustomerCreateInput {
  displayName: string
  email?: string
  phoneNumber?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  country?: string
  postalCode?: string
  customerPostingGroup?: string
  genBusPostingGroup?: string
  vatBusPostingGroup?: string
}

export interface BCItem extends JsonRecord {
  id?: string
  number?: string
  displayName?: string
  description?: string
  type?: string
  unitPrice?: number
  blocked?: boolean
}

export interface BCFileRecord extends JsonRecord {
  id?: string
}

export interface CPNRBannerLineRecord extends JsonRecord {
  id?: number
  bannerNo?: number
  bannerName?: string
  sequence?: number
  desktopImageUrl?: string
  desktopStorageObjectKey?: string
  mobileImageUrl?: string
  mobileStorageObjectKey?: string
  targetUrl?: string
  targetLabel?: string
  openInNewTab?: boolean
  blocked?: boolean
}

export interface BCFileRecordInput {
  fileUrl: string
  storageObjectKey: string
  fileName: string
  mimeType?: string
  customerNo?: string
  title?: string
  description?: string
  extraFields?: JsonRecord
}

export interface CPNRCreateSalesOrderInput {
  sellToCustomerNo: string
  billToCustomerNo?: string
  currencyCode?: string
  shipToCode?: string
  shipToName?: string
  shipToAddress?: string
  shipToAddress2?: string
  shipToPostCode?: string
  shipToContact?: string
  shipToPhoneNo?: string
  requestedDeliveryDate?: string
  promisedDeliveryDate?: string
  externalDocumentNo: string
  dateType: "EDD" | "Confirmed"
  eddDate?: string
  confirmedStartDate?: string
  orderSource?: "Undefined" | "Website" | "Salesperson" | "EventOrder"
  noWeekendDeliveries?: boolean
}

export interface CPNRCreateSalesOrderRecord extends JsonRecord {
  orderNo?: string
  systemId?: string
  externalDocumentNo?: string
  dateType?: string
  eddDate?: string
  confirmedStartDate?: string
  orderSource?: string
}

export interface CPNROrderHeaderCtrlRecord extends JsonRecord {
  documentType?: string
  documentNo?: string
  dateType?: string
  eddDate?: string
  confirmedStartDate?: string
  orderSource?: string
  noWeekendDeliveries?: boolean
}

export interface CPNRCreateSalesOrderWithLinesInput extends CPNRCreateSalesOrderInput {
  requestId?: string
  orderLinesJson: string
  promoCode?: string
}

export interface CPNRCreateSalesOrderWithLinesRecord extends JsonRecord {
  requestId?: string
  orderNo?: string
  orderSystemId?: string
  createdLineNos?: string
  responseJson?: string
}

export interface CPNRGiftboxLineOptionInput {
  groupCode: string
  valueCode: string
  freeText?: string
}

export interface CPNRGiftboxLineInput {
  itemNo: string
  quantity: number
  unitPrice?: number
  options?: CPNRGiftboxLineOptionInput[]
}

export interface CPNRCreateGiftboxOrderInput {
  requestId?: string
  sellToCustomerNo: string
  billToCustomerNo?: string
  externalDocumentNo?: string
  requestedDeliveryDate?: string
  giftboxLinesJson: string
  promoCode?: string
}

export interface CPNRCreateGiftboxOrderRecord extends JsonRecord {
  requestId?: string
  orderNo?: string
  orderSystemId?: string
  createdLineNos?: string
  responseJson?: string
}

export interface CPNRBlockedDateRecord extends JsonRecord {
  blockedDate?: string
  description?: string
}

export interface CPNRPromoCodeRecord extends JsonRecord {
  code?: string
  description?: string
  discountType?: "Amount" | "Percent"
  discountValue?: number
  minSpend?: number
  maxCap?: number
  maxUses?: number
  blocked?: boolean
  startTime?: string | null
  endTime?: string | null
  itemCategoryCode?: string
  usageCount?: number
}

interface CPNRPromoCodeApiConfig extends BCCustomApiConfig {
  promoCodeEntitySet: string
}

export interface CPNROrderLineProfileInput {
  documentType?: "Order"
  documentNo: string
  salesLineNo: number
  portion?: "Undefined" | "Dual" | "Single" | "Trial"
  session?: "Undefined" | "Lunch" | "Dinner" | "LunchAndDinner"
  firstMealSession?: "Undefined" | "Lunch" | "Dinner"
  riceOption?: "Undefined" | "Brown" | "White" | "Mixed"
  specialRequestPreset?: string
  specialRequestPresets?: string[]
  specialRequestNote?: string
}

export interface CPNROrderLineProfileRecord extends JsonRecord {
  documentType?: string
  documentNo?: string
  salesLineNo?: number
  portion?: string
  session?: string
  firstMealSession?: string
  riceOption?: string
  specialRequestPreset?: string
  specialRequestPresets?: string[]
  specialRequestNote?: string
}

export interface CPNROrderLineReqPresetInput {
  documentType?: "Order"
  documentNo: string
  salesLineNo: number
  presetCode: string
}

export interface CPNROrderLineReqPresetRecord extends JsonRecord {
  documentType?: string
  documentNo?: string
  salesLineNo?: number
  presetCode?: string
  presetDescription?: string
}

export interface CPNROrderLineInput {
  itemNo: string
  quantity: number
  description?: string
  unitPrice?: number
  sequence?: number
}

export interface CPNROrderLineRecord extends JsonRecord {
  orderNo?: string
  lineId?: string
  salesLineNo?: number
  sequence?: number
  itemNo?: string
  description?: string
  quantity?: number
  unitPrice?: number
}

export interface CPNRSpecReqPresetRecord extends JsonRecord {
  code?: string
  description?: string
  sortOrder?: number
  blocked?: boolean
}

interface BCConfig {
  baseUrl: string
  tenantId: string
  environment: string
  companyId: string
}

interface BCFileApiConfig {
  publisher: string
  apiGroup: string
  apiVersion: string
  entitySet: string
  fileUrlField: string
  storageObjectKeyField: string
  fileNameField: string
  mimeTypeField: string
  customerNoField: string
  titleField: string
  descriptionField: string
}

interface BCCustomApiConfig {
  publisher: string
  apiGroup: string
  apiVersion: string
}

interface CPNRBannerApiConfig extends BCCustomApiConfig {
  bannerLineEntitySet: string
}

interface CPNROrderApiConfig extends BCCustomApiConfig {
  createSalesOrderEntitySet: string
  createSalesOrderWithLinesEntitySet: string
  orderHeaderCtrlEntitySet: string
  orderLineProfileEntitySet: string
  orderLineReqPresetEntitySet: string
  specialReqPresetEntitySet: string
}

interface CPNRGiftboxApiConfig extends BCCustomApiConfig {
  createGiftboxOrderEntitySet: string
}

interface CPNRBlockedDateApiConfig extends BCCustomApiConfig {
  blockedDateEntitySet: string
}

interface BCCustomerApiConfig extends BCCustomApiConfig {
  customerEntitySet: string
}

interface BCSalesOrder extends JsonRecord {
  id?: string
  number?: string
}

interface BCSalesOrderLine extends JsonRecord {
  id?: string
  sequence?: number
  lineType?: string
  lineObjectNumber?: string
  description?: string
  quantity?: number
  unitPrice?: number
}

export class BCRequestError extends Error {
  readonly status: number
  readonly statusText: string
  readonly body: string

  constructor(status: number, statusText: string, body: string) {
    super(`BC request failed (${status} ${statusText}): ${body}`)
    this.status = status
    this.statusText = statusText
    this.body = body
  }
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''")
}

function getBCConfig(): BCConfig {
  const baseUrlRaw = getRequiredEnv("BC_BASE_URL")

  return {
    baseUrl: baseUrlRaw.replace(/\/$/, ""),
    tenantId: getRequiredEnv("BC_TENANT_ID"),
    environment: getRequiredEnv("BC_ENVIRONMENT"),
    companyId: getRequiredEnv("BC_CPNR_COMPANY_ID"),
  }
}

function getBCFileApiConfig(): BCFileApiConfig {
  return {
    publisher: getRequiredEnv("BC_IMAGE_PUBLISHER"),
    apiGroup: getRequiredEnv("BC_IMAGE_API_GROUP"),
    apiVersion: process.env.BC_IMAGE_API_VERSION ?? "v1.0",
    entitySet: getRequiredEnv("BC_IMAGE_ENTITY_SET"),
    fileUrlField: process.env.BC_FILE_URL_FIELD ?? process.env.BC_IMAGE_URL_FIELD ?? "imageUrl",
    storageObjectKeyField:
      process.env.BC_STORAGE_OBJECT_KEY_FIELD ?? process.env.BC_IMAGE_CF_ID_FIELD ?? "storageObjectKey",
    fileNameField: process.env.BC_FILE_NAME_FIELD ?? process.env.BC_IMAGE_FILE_NAME_FIELD ?? "fileName",
    mimeTypeField: process.env.BC_MIME_TYPE_FIELD ?? "mimeType",
    customerNoField: process.env.BC_CUSTOMER_NO_FIELD ?? process.env.BC_IMAGE_CUSTOMER_NO_FIELD ?? "customerNo",
    titleField: process.env.BC_TITLE_FIELD ?? process.env.BC_IMAGE_TITLE_FIELD ?? "title",
    descriptionField: process.env.BC_DESCRIPTION_FIELD ?? process.env.BC_IMAGE_DESCRIPTION_FIELD ?? "description",
  }
}

function getCPNRBannerApiConfig(): CPNRBannerApiConfig {
  return {
    publisher: process.env.BC_CPNR_BANNER_API_PUBLISHER ?? "cpnr",
    apiGroup: process.env.BC_CPNR_BANNER_API_GROUP ?? "banners",
    apiVersion: process.env.BC_CPNR_BANNER_API_VERSION ?? "v1.0",
    bannerLineEntitySet: process.env.BC_CPNR_BANNER_LINE_ENTITY_SET ?? "bannerLines",
  }
}

function getCPNROrderApiConfig(): CPNROrderApiConfig {
  return {
    publisher: process.env.BC_CPNR_ORDER_API_PUBLISHER ?? "cpnr",
    apiGroup: process.env.BC_CPNR_ORDER_API_GROUP ?? "order",
    apiVersion: process.env.BC_CPNR_ORDER_API_VERSION ?? "v1.0",
    createSalesOrderEntitySet: process.env.BC_CPNR_CREATE_SO_ENTITY_SET ?? "createSalesOrders",
    createSalesOrderWithLinesEntitySet:
      process.env.BC_CPNR_CREATE_SO_WITH_LINES_ENTITY_SET ?? "createSalesOrdersWithLines",
    orderHeaderCtrlEntitySet: process.env.BC_CPNR_ORDER_HEADER_CTRL_ENTITY_SET ?? "orderHeaderControls",
    orderLineProfileEntitySet: process.env.BC_CPNR_LINE_PROFILE_ENTITY_SET ?? "orderLineProfiles",
    orderLineReqPresetEntitySet: process.env.BC_CPNR_LINE_REQ_PRESET_ENTITY_SET ?? "orderLineReqPresets",
    specialReqPresetEntitySet: process.env.BC_CPNR_SPECIAL_REQ_PRESET_ENTITY_SET ?? "specialRequestPresets",
  }
}

function getCPNRGiftboxApiConfig(): CPNRGiftboxApiConfig {
  return {
    publisher: process.env.BC_CPNR_GIFTBOX_API_PUBLISHER ?? "cpnr",
    apiGroup: process.env.BC_CPNR_GIFTBOX_API_GROUP ?? "giftbox",
    apiVersion: process.env.BC_CPNR_GIFTBOX_API_VERSION ?? "v1.0",
    createGiftboxOrderEntitySet:
      process.env.BC_CPNR_CREATE_GIFTBOX_ORDER_ENTITY_SET ?? "createGiftboxSalesOrders",
  }
}

function getCPNRBlockedDateApiConfig(): CPNRBlockedDateApiConfig {
  return {
    publisher: process.env.BC_CPNR_BLOCKED_DATE_API_PUBLISHER ?? "cpnr",
    apiGroup: process.env.BC_CPNR_BLOCKED_DATE_API_GROUP ?? "blocked",
    apiVersion: process.env.BC_CPNR_BLOCKED_DATE_API_VERSION ?? "v1.0",
    blockedDateEntitySet: process.env.BC_CPNR_BLOCKED_DATE_ENTITY_SET ?? "blockedDates",
  }
}

function getCPNRPromoCodeApiConfig(): CPNRPromoCodeApiConfig {
  return {
    publisher: process.env.BC_CPNR_PROMO_CODE_API_PUBLISHER ?? "cpnr",
    apiGroup: process.env.BC_CPNR_PROMO_CODE_API_GROUP ?? "promo",
    apiVersion: process.env.BC_CPNR_PROMO_CODE_API_VERSION ?? "v1.0",
    promoCodeEntitySet: process.env.BC_CPNR_PROMO_CODE_ENTITY_SET ?? "promoCodes",
  }
}

function buildCPNRPromoCodeApiPath(entitySet: string, query = ""): string {
  const cfg = getCPNRPromoCodeApiConfig()
  return buildCustomApiPath(cfg, entitySet, query)
}

function getBCCustomerApiConfig(): BCCustomerApiConfig {
  return {
    publisher: process.env.BC_CUSTOMER_API_PUBLISHER ?? "peppercorn",
    apiGroup: process.env.BC_CUSTOMER_API_GROUP ?? "peppercorn",
    apiVersion: process.env.BC_CUSTOMER_API_VERSION ?? "v1.0",
    customerEntitySet: process.env.BC_CUSTOMER_ENTITY_SET ?? "customers",
  }
}

function buildStandardCompanyPath(resource: string, query = ""): string {
  const { tenantId, environment, companyId } = getBCConfig()
  const cleanResource = resource.replace(/^\/+/, "")

  return `/${tenantId}/${environment}/api/v2.0/companies(${companyId})/${cleanResource}${query}`
}

function buildCustomApiPath(config: BCCustomApiConfig, entitySet: string, query = ""): string {
  const { tenantId, environment, companyId } = getBCConfig()

  return `/${tenantId}/${environment}/api/${config.publisher}/${config.apiGroup}/${config.apiVersion}/companies(${companyId})/${entitySet}${query}`
}

function buildCustomFileApiPath(query = ""): string {
  const cfg = getBCFileApiConfig()
  return buildCustomApiPath(cfg, cfg.entitySet, query)
}

function buildCPNRBannerApiPath(entitySet: string, query = ""): string {
  const cfg = getCPNRBannerApiConfig()
  return buildCustomApiPath(cfg, entitySet, query)
}

function buildCPNROrderApiPath(entitySet: string, query = ""): string {
  const cfg = getCPNROrderApiConfig()
  return buildCustomApiPath(cfg, entitySet, query)
}

function buildCPNRGiftboxApiPath(entitySet: string, query = ""): string {
  const cfg = getCPNRGiftboxApiConfig()
  return buildCustomApiPath(cfg, entitySet, query)
}

function buildCPNRBlockedDateApiPath(entitySet: string, query = ""): string {
  const cfg = getCPNRBlockedDateApiConfig()
  return buildCustomApiPath(cfg, entitySet, query)
}

function buildBCCustomerApiPath(query = ""): string {
  const cfg = getBCCustomerApiConfig()
  return buildCustomApiPath(cfg, cfg.customerEntitySet, query)
}

function buildCPNROrderLineProfileEntityPath(documentType: string, documentNo: string, salesLineNo: number): string {
  const cfg = getCPNROrderApiConfig()
  const keyPath = `(documentType='${escapeODataString(documentType)}',documentNo='${escapeODataString(documentNo)}',salesLineNo=${salesLineNo})`
  return buildCPNROrderApiPath(`${cfg.orderLineProfileEntitySet}${keyPath}`)
}

function buildCPNROrderLineReqPresetEntityPath(
  documentType: string,
  documentNo: string,
  salesLineNo: number,
  presetCode: string,
): string {
  const cfg = getCPNROrderApiConfig()
  const keyPath =
    `(documentType='${escapeODataString(documentType)}',documentNo='${escapeODataString(documentNo)}',` +
    `salesLineNo=${salesLineNo},presetCode='${escapeODataString(presetCode)}')`
  return buildCPNROrderApiPath(`${cfg.orderLineReqPresetEntitySet}${keyPath}`)
}

function normalizePresetCodes(values: string[]): string[] {
  const seen = new Set<string>()
  const normalized: string[] = []
  for (const value of values) {
    const code = value.trim()
    if (!code) continue

    const key = code.toUpperCase()
    if (seen.has(key)) continue

    seen.add(key)
    normalized.push(code)
  }

  return normalized
}

export async function bcFetch<T>(path: string, init: BCFetchInit = {}): Promise<T> {
  const { baseUrl } = getBCConfig()
  const token = await getBCToken()

  const headers = new Headers(init.headers)
  headers.set("Authorization", `Bearer ${token}`)
  headers.set("Accept", "application/json")

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
  const fetchInit: BCFetchInit = {
    ...init,
    headers,
  }

  // Default BC requests to uncached unless a caller explicitly opts into Next.js caching.
  if (fetchInit.cache === undefined && fetchInit.next === undefined) {
    fetchInit.cache = "no-store"
  }

  const res = await fetch(url, fetchInit)

  if (!res.ok) {
    const text = await res.text()
    throw new BCRequestError(res.status, res.statusText, text)
  }

  if (res.status === 204) {
    return null as T
  }

  return (await res.json()) as T
}

export async function listBCCustomers(top = 50, filter?: string): Promise<BCCustomer[]> {
  const params = new URLSearchParams({
    "$top": String(top),
    "$orderby": "number asc",
  })

  if (filter) {
    params.set("$filter", filter)
  }

  const query = `?${params.toString()}`
  const data = await bcFetch<BCPagedResponse<BCCustomer>>(buildBCCustomerApiPath(query))

  return data.value ?? []
}

export async function findBCCustomerByEmail(email: string): Promise<BCCustomer | null> {
  const trimmedEmail = email.trim()
  if (!trimmedEmail) return null
  const customers = await listBCCustomers(1, `email eq '${escapeODataString(trimmedEmail)}'`)
  return customers[0] ?? null
}

export async function findBCCustomerByPhone(phone: string): Promise<BCCustomer | null> {
  const trimmedPhone = phone.trim()
  if (!trimmedPhone) return null
  const customers = await listBCCustomers(1, `phoneNumber eq '${escapeODataString(trimmedPhone)}'`)
  return customers[0] ?? null
}

export async function createBCCustomer(input: BCCustomerCreateInput): Promise<BCCustomer> {
  const payload: JsonRecord = {
    name: input.displayName,
  }

  if (input.email) payload.email = input.email
  if (input.phoneNumber) payload.phoneNumber = input.phoneNumber
  if (input.addressLine1) payload.address = input.addressLine1
  if (input.addressLine2) payload.address2 = input.addressLine2
  if (input.country) payload.countryRegionCode = input.country
  if (input.postalCode) payload.postCode = input.postalCode

  if (input.genBusPostingGroup) payload.genBusPostingGroup = input.genBusPostingGroup
  if (input.customerPostingGroup) payload.customerPostingGroup = input.customerPostingGroup
  if (input.vatBusPostingGroup) payload.vatBusPostingGroup = input.vatBusPostingGroup

  return bcFetch<BCCustomer>(buildBCCustomerApiPath(), {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function listBCItems(top = 200, filter?: string, init?: BCFetchInit): Promise<BCItem[]> {
  const params = new URLSearchParams({
    "$top": String(top),
    "$orderby": "number asc",
  })

  if (filter) {
    params.set("$filter", filter)
  }

  const query = `?${params.toString()}`
  const data = await bcFetch<BCPagedResponse<BCItem>>(buildStandardCompanyPath("items", query), init)

  return data.value ?? []
}

export async function createBCFileRecord(input: BCFileRecordInput): Promise<BCFileRecord> {
  const cfg = getBCFileApiConfig()

  const payload: JsonRecord = {
    [cfg.fileUrlField]: input.fileUrl,
    [cfg.storageObjectKeyField]: input.storageObjectKey,
    [cfg.fileNameField]: input.fileName,
  }

  if (input.mimeType) {
    payload[cfg.mimeTypeField] = input.mimeType
  }

  if (input.customerNo) {
    payload[cfg.customerNoField] = input.customerNo
  }

  if (input.title) {
    payload[cfg.titleField] = input.title
  }

  if (input.description) {
    payload[cfg.descriptionField] = input.description
  }

  if (input.extraFields) {
    Object.assign(payload, input.extraFields)
  }

  return bcFetch<BCFileRecord>(buildCustomFileApiPath(), {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function listBCFileRecords(top = 50): Promise<BCFileRecord[]> {
  const query = `?$top=${top}`
  const data = await bcFetch<BCPagedResponse<BCFileRecord>>(buildCustomFileApiPath(query))

  return data.value ?? []
}

export async function findCPNROrderByExternalDocumentNo(
  externalDocumentNo: string,
): Promise<CPNRCreateSalesOrderRecord | null> {
  const cfg = getCPNROrderApiConfig()
  const params = new URLSearchParams({
    "$top": "1",
    "$filter": `externalDocumentNo eq '${escapeODataString(externalDocumentNo)}'`,
  })
  const query = `?${params.toString()}`

  const data = await bcFetch<BCPagedResponse<CPNRCreateSalesOrderRecord>>(
    buildCPNROrderApiPath(cfg.createSalesOrderEntitySet, query),
  )

  return data.value?.[0] ?? null
}

export async function createCPNROrder(input: CPNRCreateSalesOrderInput): Promise<CPNRCreateSalesOrderRecord> {
  const cfg = getCPNROrderApiConfig()
  return bcFetch<CPNRCreateSalesOrderRecord>(buildCPNROrderApiPath(cfg.createSalesOrderEntitySet), {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function createCPNROrderWithLines(
  input: CPNRCreateSalesOrderWithLinesInput,
): Promise<CPNRCreateSalesOrderWithLinesRecord> {
  const cfg = getCPNROrderApiConfig()
  return bcFetch<CPNRCreateSalesOrderWithLinesRecord>(buildCPNROrderApiPath(cfg.createSalesOrderWithLinesEntitySet), {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function createCPNRGiftboxOrder(
  input: CPNRCreateGiftboxOrderInput,
): Promise<CPNRCreateGiftboxOrderRecord> {
  const cfg = getCPNRGiftboxApiConfig()
  return bcFetch<CPNRCreateGiftboxOrderRecord>(buildCPNRGiftboxApiPath(cfg.createGiftboxOrderEntitySet), {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function getCPNROrderLineProfile(
  documentType: string,
  documentNo: string,
  salesLineNo: number,
): Promise<CPNROrderLineProfileRecord | null> {
  const cfg = getCPNROrderApiConfig()
  const params = new URLSearchParams({
    "$top": "1",
    "$filter": `documentType eq '${escapeODataString(documentType)}' and documentNo eq '${escapeODataString(documentNo)}' and salesLineNo eq ${salesLineNo}`,
  })
  const query = `?${params.toString()}`

  const data = await bcFetch<BCPagedResponse<CPNROrderLineProfileRecord>>(
    buildCPNROrderApiPath(cfg.orderLineProfileEntitySet, query),
  )

  return data.value?.[0] ?? null
}

export async function findCPNROrderByOrderNo(orderNo: string): Promise<CPNRCreateSalesOrderRecord | null> {
  const cfg = getCPNROrderApiConfig()
  const params = new URLSearchParams({
    "$top": "1",
    "$filter": `orderNo eq '${escapeODataString(orderNo)}'`,
  })
  const query = `?${params.toString()}`

  const data = await bcFetch<BCPagedResponse<CPNRCreateSalesOrderRecord>>(
    buildCPNROrderApiPath(cfg.createSalesOrderEntitySet, query),
  )

  return data.value?.[0] ?? null
}

export async function findCPNROrderHeaderCtrlByOrderNo(orderNo: string): Promise<CPNROrderHeaderCtrlRecord | null> {
  const cfg = getCPNROrderApiConfig()
  const params = new URLSearchParams({
    "$top": "1",
    "$filter": `documentType eq 'Order' and documentNo eq '${escapeODataString(orderNo)}'`,
  })
  const query = `?${params.toString()}`

  const data = await bcFetch<BCPagedResponse<CPNROrderHeaderCtrlRecord>>(
    buildCPNROrderApiPath(cfg.orderHeaderCtrlEntitySet, query),
  )

  return data.value?.[0] ?? null
}

export async function listCPNROrderLineReqPresets(
  documentType: string,
  documentNo: string,
  salesLineNo: number,
): Promise<CPNROrderLineReqPresetRecord[]> {
  const cfg = getCPNROrderApiConfig()
  const params = new URLSearchParams({
    "$filter":
      `documentType eq '${escapeODataString(documentType)}' and ` +
      `documentNo eq '${escapeODataString(documentNo)}' and salesLineNo eq ${salesLineNo}`,
    "$orderby": "presetCode asc",
  })
  const query = `?${params.toString()}`

  const data = await bcFetch<BCPagedResponse<CPNROrderLineReqPresetRecord>>(
    buildCPNROrderApiPath(cfg.orderLineReqPresetEntitySet, query),
  )

  return data.value ?? []
}

async function createCPNROrderLineReqPreset(input: CPNROrderLineReqPresetInput): Promise<CPNROrderLineReqPresetRecord> {
  const cfg = getCPNROrderApiConfig()
  const payload: JsonRecord = {
    documentType: input.documentType ?? "Order",
    documentNo: input.documentNo,
    salesLineNo: input.salesLineNo,
    presetCode: input.presetCode,
  }

  return bcFetch<CPNROrderLineReqPresetRecord>(buildCPNROrderApiPath(cfg.orderLineReqPresetEntitySet), {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

async function deleteCPNROrderLineReqPreset(
  documentType: string,
  documentNo: string,
  salesLineNo: number,
  presetCode: string,
): Promise<void> {
  await bcFetch<null>(buildCPNROrderLineReqPresetEntityPath(documentType, documentNo, salesLineNo, presetCode), {
    method: "DELETE",
    headers: {
      "If-Match": "*",
    },
  })
}

async function syncCPNROrderLineReqPresets(
  documentType: string,
  documentNo: string,
  salesLineNo: number,
  presetCodes: string[],
): Promise<string[]> {
  const targetCodes = normalizePresetCodes(presetCodes)
  const existing = await listCPNROrderLineReqPresets(documentType, documentNo, salesLineNo)

  const targetSet = new Set(targetCodes.map((code) => code.toUpperCase()))
  const existingByKey = new Map<string, string>()

  for (const row of existing) {
    if (typeof row.presetCode !== "string") continue
    const code = row.presetCode.trim()
    if (!code) continue
    existingByKey.set(code.toUpperCase(), code)
  }

  for (const [key, existingCode] of existingByKey.entries()) {
    if (!targetSet.has(key)) {
      await deleteCPNROrderLineReqPreset(documentType, documentNo, salesLineNo, existingCode)
    }
  }

  for (const code of targetCodes) {
    if (existingByKey.has(code.toUpperCase())) continue
    await createCPNROrderLineReqPreset({
      documentType: documentType as "Order",
      documentNo,
      salesLineNo,
      presetCode: code,
    })
  }

  const synced = await listCPNROrderLineReqPresets(documentType, documentNo, salesLineNo)
  return synced
    .map((row) => (typeof row.presetCode === "string" ? row.presetCode.trim() : ""))
    .filter((code): code is string => code.length > 0)
}

export async function upsertCPNROrderLineProfile(input: CPNROrderLineProfileInput): Promise<CPNROrderLineProfileRecord> {
  const documentType = input.documentType ?? "Order"
  const normalizedPresetList =
    input.specialRequestPresets === undefined ? undefined : normalizePresetCodes(input.specialRequestPresets)
  const payload: JsonRecord = {
    documentType,
    documentNo: input.documentNo,
    salesLineNo: input.salesLineNo,
  }

  if (input.portion !== undefined) payload.portion = input.portion
  if (input.session !== undefined) payload.session = input.session
  if (input.firstMealSession !== undefined) payload.firstMealSession = input.firstMealSession
  if (input.riceOption !== undefined) payload.riceOption = input.riceOption
  if (normalizedPresetList !== undefined) {
    payload.specialRequestPreset = normalizedPresetList[0] ?? ""
  } else if (input.specialRequestPreset !== undefined) {
    payload.specialRequestPreset = input.specialRequestPreset
  }
  if (input.specialRequestNote !== undefined) payload.specialRequestNote = input.specialRequestNote

  let updatedProfile: CPNROrderLineProfileRecord | null = null
  try {
    await bcFetch<null>(buildCPNROrderLineProfileEntityPath(documentType, input.documentNo, input.salesLineNo), {
      method: "PATCH",
      headers: {
        "If-Match": "*",
      },
      body: JSON.stringify(payload),
    })

    const updated = await getCPNROrderLineProfile(documentType, input.documentNo, input.salesLineNo)
    if (updated) {
      updatedProfile = updated
    }
  } catch (error) {
    if (!(error instanceof BCRequestError) || error.status !== 404) {
      throw error
    }
  }

  if (!updatedProfile) {
    const cfg = getCPNROrderApiConfig()
    updatedProfile = await bcFetch<CPNROrderLineProfileRecord>(buildCPNROrderApiPath(cfg.orderLineProfileEntitySet), {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  if (normalizedPresetList !== undefined) {
    const syncedPresetCodes = await syncCPNROrderLineReqPresets(
      documentType,
      input.documentNo,
      input.salesLineNo,
      normalizedPresetList,
    )
    updatedProfile.specialRequestPresets = syncedPresetCodes
    if (updatedProfile.specialRequestPreset === undefined) {
      updatedProfile.specialRequestPreset = syncedPresetCodes[0] ?? ""
    }
  }

  return updatedProfile
}

async function findBCSalesOrderByNumber(orderNo: string): Promise<BCSalesOrder | null> {
  const params = new URLSearchParams({
    "$top": "1",
    "$filter": `number eq '${escapeODataString(orderNo)}'`,
  })
  const query = `?${params.toString()}`

  const data = await bcFetch<BCPagedResponse<BCSalesOrder>>(buildStandardCompanyPath("salesOrders", query))
  return data.value?.[0] ?? null
}

function mapSalesOrderLineToRecord(orderNo: string, line: BCSalesOrderLine): CPNROrderLineRecord {
  return {
    orderNo,
    lineId: line.id,
    salesLineNo: typeof line.sequence === "number" ? line.sequence : undefined,
    sequence: typeof line.sequence === "number" ? line.sequence : undefined,
    itemNo: typeof line.lineObjectNumber === "string" ? line.lineObjectNumber : undefined,
    description: typeof line.description === "string" ? line.description : undefined,
    quantity: typeof line.quantity === "number" ? line.quantity : undefined,
    unitPrice: typeof line.unitPrice === "number" ? line.unitPrice : undefined,
  }
}

export async function listBCSalesOrderLinesByOrderNo(orderNo: string): Promise<CPNROrderLineRecord[]> {
  const salesOrder = await findBCSalesOrderByNumber(orderNo)
  if (!salesOrder?.id) {
    throw new Error(`Sales order ${orderNo} not found`)
  }

  const data = await bcFetch<BCPagedResponse<BCSalesOrderLine>>(
    buildStandardCompanyPath(`salesOrders(${salesOrder.id})/salesOrderLines`),
  )

  return (data.value ?? [])
    .map((line) => mapSalesOrderLineToRecord(orderNo, line))
    .sort((a, b) => (a.sequence ?? Number.MAX_SAFE_INTEGER) - (b.sequence ?? Number.MAX_SAFE_INTEGER))
}

export async function createBCSalesOrderLineByOrderNo(
  orderNo: string,
  input: CPNROrderLineInput,
): Promise<CPNROrderLineRecord> {
  const salesOrder = await findBCSalesOrderByNumber(orderNo)
  if (!salesOrder?.id) {
    throw new Error(`Sales order ${orderNo} not found`)
  }

  const payload: JsonRecord = {
    lineType: "Item",
    lineObjectNumber: input.itemNo,
    quantity: input.quantity,
  }

  if (input.description !== undefined) {
    payload.description = input.description
  }

  if (input.unitPrice !== undefined) {
    payload.unitPrice = input.unitPrice
  }

  if (input.sequence !== undefined) {
    payload.sequence = input.sequence
  }

  const created = await bcFetch<BCSalesOrderLine>(buildStandardCompanyPath(`salesOrders(${salesOrder.id})/salesOrderLines`), {
    method: "POST",
    body: JSON.stringify(payload),
  })

  return mapSalesOrderLineToRecord(orderNo, created)
}

export async function listCPNRBannerLines(top = 200, bannerNo?: number): Promise<CPNRBannerLineRecord[]> {
  const cfg = getCPNRBannerApiConfig()
  const params = new URLSearchParams({
    "$top": String(top),
    "$orderby": "bannerNo asc,sequence asc,id asc",
  })

  if (bannerNo !== undefined) {
    params.set("$filter", `bannerNo eq ${bannerNo}`)
  }

  const query = `?${params.toString()}`
  const data = await bcFetch<BCPagedResponse<CPNRBannerLineRecord>>(
    buildCPNRBannerApiPath(cfg.bannerLineEntitySet, query),
  )

  return data.value ?? []
}

export async function listCPNRSpecialReqPresets(top = 200): Promise<CPNRSpecReqPresetRecord[]> {
  const cfg = getCPNROrderApiConfig()
  const params = new URLSearchParams({
    "$top": String(top),
    "$orderby": "sortOrder asc,code asc",
  })
  const query = `?${params.toString()}`

  const data = await bcFetch<BCPagedResponse<CPNRSpecReqPresetRecord>>(
    buildCPNROrderApiPath(cfg.specialReqPresetEntitySet, query),
  )

  return data.value ?? []
}

export async function listCPNRBlockedDates(): Promise<CPNRBlockedDateRecord[]> {
  const cfg = getCPNRBlockedDateApiConfig()
  const data = await bcFetch<BCPagedResponse<CPNRBlockedDateRecord>>(
    buildCPNRBlockedDateApiPath(cfg.blockedDateEntitySet),
  )

  return data.value ?? []
}

export async function getCPNRPromoCode(code: string): Promise<CPNRPromoCodeRecord | null> {
  const cfg = getCPNRPromoCodeApiConfig()
  const keyPath = `('${escapeODataString(code.trim().toUpperCase())}')`
  const path = buildCPNRPromoCodeApiPath(`${cfg.promoCodeEntitySet}${keyPath}`)
  console.log("[getCPNRPromoCode] BC path:", path)
  try {
    const result = await bcFetch<CPNRPromoCodeRecord>(path)
    console.log("[getCPNRPromoCode] result:", JSON.stringify(result))
    return result
  } catch (err) {
    console.log("[getCPNRPromoCode] error:", err instanceof BCRequestError ? `${err.status} ${err.body}` : err)
    if (err instanceof BCRequestError && err.status === 404) return null
    throw err
  }
}

// Backward-compatible aliases for existing imports.
export const createBCImageRecord = createBCFileRecord
export const listBCImageRecords = listBCFileRecords


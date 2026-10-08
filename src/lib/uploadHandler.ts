import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto"

import { listBCFileRecords } from "./bcClient"

export const runtime = "nodejs"

interface R2UploadResult {
  bucket: string
  key: string
  publicUrl: string
  etag?: string
}

interface UploadInput {
  file: File
  customerNo?: string
  title?: string
  description?: string
  targetUrl?: string
  targetLabel?: string
  openInNewTab?: boolean
}

class UploadRequestError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function getOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function normalizeOptionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value
  if (typeof value !== "string") return undefined

  const normalized = value.trim().toLowerCase()
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true
  if (normalized === "false" || normalized === "0" || normalized === "no") return false
  return undefined
}

function sha256Hex(data: string | Buffer): string {
  return createHash("sha256").update(data).digest("hex")
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest()
}

function toAmzDate(date: Date): { amzDate: string; shortDate: string } {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, "")
  const amzDate = iso.slice(0, 15) + "Z"
  const shortDate = amzDate.slice(0, 8)

  return { amzDate, shortDate }
}

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment).replace(/[!*'()]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
}

function encodeObjectKey(key: string): string {
  return key
    .split("/")
    .map((segment) => encodePathSegment(segment))
    .join("/")
}

function sanitizeFileName(fileName: string): string {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
  return cleaned || "file"
}

function resolveFolderByMimeType(mimeType: string): string {
  if (mimeType.startsWith("image/")) {
    return "images"
  }

  if (mimeType === "application/pdf") {
    return "documents/pdf"
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return "documents/word"
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-excel"
  ) {
    return "documents/excel"
  }

  return "documents/other"
}

function buildObjectKey(file: File): string {
  const now = new Date()
  const yyyy = String(now.getUTCFullYear())
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(now.getUTCDate()).padStart(2, "0")
  const folder = resolveFolderByMimeType(file.type || "application/octet-stream")
  const safeName = sanitizeFileName(file.name)

  return `${folder}/${yyyy}/${mm}/${dd}/${randomUUID()}-${safeName}`
}

function buildPublicUrl(baseUrl: string, objectKey: string): string {
  return `${baseUrl.replace(/\/$/, "")}/${encodeObjectKey(objectKey)}`
}

function buildR2Authorization(params: {
  method: "PUT" | "DELETE"
  accessKeyId: string
  secretAccessKey: string
  region: string
  host: string
  canonicalUri: string
  amzDate: string
  shortDate: string
  payloadHash: string
}): string {
  const { method, accessKeyId, secretAccessKey, region, host, canonicalUri, amzDate, shortDate, payloadHash } = params
  const service = "s3"
  const credentialScope = `${shortDate}/${region}/${service}/aws4_request`
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date"

  const canonicalRequest = [
    method,
    canonicalUri,
    "",
    `host:${host}\n` + `x-amz-content-sha256:${payloadHash}\n` + `x-amz-date:${amzDate}\n`,
    signedHeaders,
    payloadHash,
  ].join("\n")

  const canonicalRequestHash = sha256Hex(canonicalRequest)

  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, canonicalRequestHash].join("\n")

  const kDate = hmacSha256(`AWS4${secretAccessKey}`, shortDate)
  const kRegion = hmacSha256(kDate, region)
  const kService = hmacSha256(kRegion, service)
  const kSigning = hmacSha256(kService, "aws4_request")
  const signature = createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex")

  return `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
}

function isApiKeyValid(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

function isPathByteEqual(left: Buffer, right: Buffer): boolean {
  return left.length === right.length && timingSafeEqual(left, right)
}

function verifyHmacRequest(request: Request, rawBody: Buffer): void {
  const hmacSecret = process.env.INTERNAL_UPLOAD_HMAC_SECRET
  if (!hmacSecret) return

  const pathname = new URL(request.url).pathname
  const isBcRoute = pathname.startsWith("/api/bc/")

  const timestampHeader = request.headers.get("x-timestamp-ms")
  const nonceHeader = request.headers.get("x-nonce")
  const signatureHeader = request.headers.get("x-signature")
  const hasAnyHmacHeader = Boolean(timestampHeader || nonceHeader || signatureHeader)

  if (!hasAnyHmacHeader) {
    if (isBcRoute) {
      throw new UploadRequestError(401, "Missing required HMAC headers")
    }
    return
  }

  if (!timestampHeader || !nonceHeader || !signatureHeader) {
    throw new UploadRequestError(401, "Missing required HMAC headers")
  }

  const timestamp = Number(timestampHeader)
  if (!Number.isFinite(timestamp)) {
    throw new UploadRequestError(401, "Invalid x-timestamp-ms header")
  }

  const maxSkewMs = Number(process.env.INTERNAL_UPLOAD_HMAC_MAX_SKEW_MS ?? 5 * 60 * 1000)
  const now = Date.now()
  if (Math.abs(now - timestamp) > maxSkewMs) {
    throw new UploadRequestError(401, "Expired HMAC timestamp")
  }

  const bodyHash = sha256Hex(rawBody)
  const canonical = [request.method.toUpperCase(), pathname, timestampHeader, nonceHeader, bodyHash].join("\n")
  const expectedSignature = createHmac("sha256", hmacSecret).update(canonical, "utf8").digest("hex").toLowerCase()
  const providedSignature = signatureHeader.toLowerCase()

  const expectedBytes = Buffer.from(expectedSignature)
  const providedBytes = Buffer.from(providedSignature)
  if (!isPathByteEqual(expectedBytes, providedBytes)) {
    throw new UploadRequestError(401, "Invalid HMAC signature")
  }
}

async function uploadToCloudflareObjectStorage(file: File): Promise<R2UploadResult> {
  const accountId = getRequiredEnv("R2_ACCOUNT_ID")
  const bucket = getRequiredEnv("R2_BUCKET_NAME")
  const accessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID")
  const secretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY")
  const publicBaseUrl = getRequiredEnv("R2_PUBLIC_BASE_URL")
  const region = process.env.R2_REGION ?? "auto"

  const objectKey = buildObjectKey(file)
  const encodedKey = encodeObjectKey(objectKey)
  const host = `${accountId}.r2.cloudflarestorage.com`
  const canonicalUri = `/${encodePathSegment(bucket)}/${encodedKey}`

  const bodyBuffer = Buffer.from(await file.arrayBuffer())
  const payloadHash = sha256Hex(bodyBuffer)
  const { amzDate, shortDate } = toAmzDate(new Date())

  const authorization = buildR2Authorization({
    method: "PUT",
    accessKeyId,
    secretAccessKey,
    region,
    host,
    canonicalUri,
    amzDate,
    shortDate,
    payloadHash,
  })

  const contentType = file.type || "application/octet-stream"

  const res = await fetch(`https://${host}${canonicalUri}`, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      "Content-Type": contentType,
    },
    body: bodyBuffer,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudflare object storage upload failed (${res.status} ${res.statusText}): ${text}`)
  }

  return {
    bucket,
    key: objectKey,
    publicUrl: buildPublicUrl(publicBaseUrl, objectKey),
    etag: res.headers.get("etag") ?? undefined,
  }
}

async function deleteFromCloudflareObjectStorage(objectKey: string): Promise<void> {
  const accountId = getRequiredEnv("R2_ACCOUNT_ID")
  const bucket = getRequiredEnv("R2_BUCKET_NAME")
  const accessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID")
  const secretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY")
  const region = process.env.R2_REGION ?? "auto"

  const encodedKey = encodeObjectKey(objectKey)
  const host = `${accountId}.r2.cloudflarestorage.com`
  const canonicalUri = `/${encodePathSegment(bucket)}/${encodedKey}`
  const payloadHash = sha256Hex("")
  const { amzDate, shortDate } = toAmzDate(new Date())

  const authorization = buildR2Authorization({
    method: "DELETE",
    accessKeyId,
    secretAccessKey,
    region,
    host,
    canonicalUri,
    amzDate,
    shortDate,
    payloadHash,
  })

  const res = await fetch(`https://${host}${canonicalUri}`, {
    method: "DELETE",
    headers: {
      Authorization: authorization,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
    },
  })

  if (!res.ok && res.status !== 404) {
    const text = await res.text()
    throw new Error(`Cloudflare object delete failed (${res.status} ${res.statusText}): ${text}`)
  }
}

async function readRawBodyWithFallback(request: Request): Promise<Buffer> {
  const bodyClone = request.clone()
  let rawBuffer = Buffer.from(await bodyClone.arrayBuffer())

  if (rawBuffer.byteLength > 0) {
    return rawBuffer
  }

  try {
    const textFallback = await request.text()
    if (textFallback.length > 0) {
      rawBuffer = Buffer.from(textFallback, "utf8")
    }
  } catch {
    // Ignore fallback parsing errors and return empty body for explicit validation below.
  }

  return rawBuffer
}

function parseBase64Payload(value: string, kind: "image" | "pdf"): Buffer {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new UploadRequestError(400, `Missing ${kind} payload`)
  }

  const payload = trimmed.includes(",") ? trimmed.split(",").pop() ?? "" : trimmed
  const compact = payload.replace(/\s+/g, "")
  if (!compact) {
    throw new UploadRequestError(400, `Invalid ${kind} payload`)
  }

  const buffer = Buffer.from(compact, "base64")
  if (buffer.byteLength === 0) {
    throw new UploadRequestError(400, `Invalid ${kind} payload`)
  }

  return buffer
}

function parseJsonUpload(rawBody: Buffer): UploadInput {
  if (rawBody.byteLength === 0) {
    throw new UploadRequestError(400, "Missing JSON request body")
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(rawBody.toString("utf8")) as Record<string, unknown>
  } catch {
    throw new UploadRequestError(400, "Invalid JSON body")
  }

  const base64Image = normalizeOptionalString(parsed.image)
  const base64Pdf = normalizeOptionalString(parsed.pdf)

  let payloadBuffer: Buffer | undefined
  let mimeType = normalizeOptionalString(parsed.mimeType)
  let fileName = normalizeOptionalString(parsed.fileName)

  if (base64Image) {
    payloadBuffer = parseBase64Payload(base64Image, "image")
    mimeType = mimeType ?? "image/webp"
    fileName = fileName ?? `upload-${randomUUID()}.webp`
  } else if (base64Pdf) {
    payloadBuffer = parseBase64Payload(base64Pdf, "pdf")
    mimeType = mimeType ?? "application/pdf"
    fileName = fileName ?? `upload-${randomUUID()}.pdf`
  }

  if (!payloadBuffer) {
    throw new UploadRequestError(400, "JSON body must contain image or pdf field")
  }

  const safeFileName = sanitizeFileName(fileName ?? `upload-${randomUUID()}`)

  return {
    file: new File([new Uint8Array(payloadBuffer)], safeFileName, { type: mimeType ?? "application/octet-stream" }),
    customerNo: normalizeOptionalString(parsed.customerNo),
    title: normalizeOptionalString(parsed.title),
    description: normalizeOptionalString(parsed.description),
    targetUrl: normalizeOptionalString(parsed.targetUrl),
    targetLabel: normalizeOptionalString(parsed.targetLabel),
    openInNewTab: normalizeOptionalBoolean(parsed.openInNewTab),
  }
}

async function readUploadFromRequest(request: Request): Promise<UploadInput> {
  const contentTypeHeader = request.headers.get("content-type") ?? ""
  const normalizedContentType = contentTypeHeader.toLowerCase()

  if (normalizedContentType.includes("multipart/form-data")) {
    const formData = await request.formData()
    const fileValue = formData.get("file")

    if (!(fileValue instanceof File)) {
      throw new UploadRequestError(400, "Missing file in form-data (key: file)")
    }

    return {
      file: fileValue,
      customerNo: getOptionalString(formData, "customerNo"),
      title: getOptionalString(formData, "title"),
      description: getOptionalString(formData, "description"),
      targetUrl: getOptionalString(formData, "targetUrl"),
      targetLabel: getOptionalString(formData, "targetLabel"),
      openInNewTab: normalizeOptionalBoolean(formData.get("openInNewTab")),
    }
  }

  const rawBody = await readRawBodyWithFallback(request)

  if (normalizedContentType.includes("application/json")) {
    return parseJsonUpload(rawBody)
  }

  const fileNameHeader = request.headers.get("x-file-name")
  if (rawBody.byteLength === 0) {
    const contentLength = request.headers.get("content-length") ?? "n/a"
    const transferEncoding = request.headers.get("transfer-encoding") ?? "n/a"

    throw new UploadRequestError(
      400,
      `Missing request body (content-type: ${contentTypeHeader || "n/a"}, content-length: ${contentLength}, transfer-encoding: ${transferEncoding})`,
    )
  }

  const mimeType = contentTypeHeader.split(";")[0]?.trim() || "application/octet-stream"
  const safeFileName = sanitizeFileName(fileNameHeader?.trim() || `upload-${randomUUID()}`)

  return {
    file: new File([new Uint8Array(rawBody)], safeFileName, { type: mimeType }),
  }
}

function parseAssetIdFromJson(rawBody: Buffer): string | undefined {
  if (rawBody.byteLength === 0) return undefined

  try {
    const parsed = JSON.parse(rawBody.toString("utf8")) as Record<string, unknown>
    const assetId = normalizeOptionalString(parsed.assetId) ?? normalizeOptionalString(parsed.objectKey)
    return assetId
  } catch {
    return undefined
  }
}

function buildUploadResponse(input: UploadInput, storageResult: R2UploadResult) {
  const data = {
    url: storageResult.publicUrl,
    publicUrl: storageResult.publicUrl,
    assetId: storageResult.key,
    objectKey: storageResult.key,
    fileName: input.file.name,
    mimeType: input.file.type || "application/octet-stream",
  }

  return {
    success: true,
    data,
    assetId: data.assetId,
    objectKey: data.objectKey,
    url: data.url,
    publicUrl: data.publicUrl,
    fileName: data.fileName,
    mimeType: data.mimeType,
    customerNo: input.customerNo,
    title: input.title,
    description: input.description,
    targetUrl: input.targetUrl,
    targetLabel: input.targetLabel,
    openInNewTab: input.openInNewTab,
    storage: storageResult,
  }
}

function ensureAuthorized(request: Request): void {
  const expectedApiKey = process.env.INTERNAL_UPLOAD_API_KEY
  if (!expectedApiKey) {
    throw new UploadRequestError(500, "Server missing INTERNAL_UPLOAD_API_KEY")
  }

  const providedApiKey = request.headers.get("x-api-key")
  if (!isApiKeyValid(providedApiKey, expectedApiKey)) {
    throw new UploadRequestError(401, "Unauthorized")
  }
}

export async function POST(request: Request) {
  try {
    ensureAuthorized(request)

    const rawBody = await readRawBodyWithFallback(request)
    verifyHmacRequest(request, rawBody)

    const uploadInput = await readUploadFromRequest(request)
    const storageResult = await uploadToCloudflareObjectStorage(uploadInput.file)

    return Response.json(buildUploadResponse(uploadInput, storageResult))
  } catch (error) {
    if (error instanceof UploadRequestError) {
      return Response.json({ error: error.message }, { status: error.status })
    }

    const message = error instanceof Error ? error.message : "Upload failed"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const topRaw = url.searchParams.get("top")
    const top = topRaw ? Number.parseInt(topRaw, 10) : 50
    const safeTop = Number.isFinite(top) && top > 0 ? Math.min(top, 200) : 50

    const records = await listBCFileRecords(safeTop)

    return Response.json({
      success: true,
      count: records.length,
      records,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load BC file records"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    ensureAuthorized(request)

    const rawBody = await readRawBodyWithFallback(request)
    verifyHmacRequest(request, rawBody)

    const url = new URL(request.url)
    const assetIdFromQuery = url.searchParams.get("assetId")?.trim()
    const assetIdFromJson = parseAssetIdFromJson(rawBody)
    const assetId = assetIdFromQuery || assetIdFromJson

    if (!assetId) {
      return Response.json({ error: "Missing assetId (query or JSON body)" }, { status: 400 })
    }

    await deleteFromCloudflareObjectStorage(assetId)

    return Response.json({
      success: true,
      data: {
        assetId,
        objectKey: assetId,
      },
      assetId,
      objectKey: assetId,
    })
  } catch (error) {
    if (error instanceof UploadRequestError) {
      return Response.json({ error: error.message }, { status: error.status })
    }

    const message = error instanceof Error ? error.message : "Delete failed"
    return Response.json({ error: message }, { status: 500 })
  }
}


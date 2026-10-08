/**
 * Internal-only OpenAPI spec for the Business Central server-to-server (S2S) write APIs.
 *
 * This is a SEPARATE spec from cpnrOrderV1.ts. It documents the raw /api/bc/** create
 * endpoints that BC (and only BC) calls server-to-server. It is served by a hard-gated
 * route (src/app/api/(public)/docs/bc-s2s/v1/openapi/route.ts) that returns 401 unless an
 * internal viewer session is present, so the internal BC contract is never exposed publicly.
 *
 * The value of this doc is the "before -> after serialization" view: each endpoint shows the
 * clean camelCase JSON a caller sends ("before") AND the exact payload the backend forwards to
 * BC's OData API ("after") — most importantly that line arrays are JSON.stringify'd into a
 * single string field (orderLinesJson / giftboxLinesJson) before BC will accept them.
 *
 * NOTE: maintained by hand — keep in sync with the Zod schemas in
 * src/app/api/(s2s)/bc/orders/schema.ts and src/app/api/(s2s)/bc/giftbox/orders/schema.ts.
 */
export const cpnrBcS2sOpenApiV1 = {
  openapi: "3.0.3",
  info: {
    title: "CPNR Internal — Business Central S2S API",
    version: "1.0.0",
    description:
      "**Internal documentation — not for public/customer use.**\n\n" +
      "These are the raw server-to-server (S2S) routes that Business Central calls to create orders. " +
      "The frontend never calls them.\n\n" +
      "### Request signing (required on every /api/bc/** request)\n" +
      "All requests must carry four headers:\n" +
      "- `x-api-key` — shared API key (`BC_API_KEY`)\n" +
      "- `x-timestamp-ms` — Unix epoch **milliseconds**; must be within ±5 minutes of server time\n" +
      "- `x-nonce` — unique random string per request (replay protection)\n" +
      "- `x-signature` — lowercase-hex `HMAC-SHA256` over the canonical string:\n\n" +
      "```\nMETHOD\\n<path>\\n<x-timestamp-ms>\\n<x-nonce>\\n<sha256hex(rawRequestBody)>\n```\n\n" +
      "signed with `HMAC_SECRET_CURRENT` (rotation: `HMAC_SECRET_PREVIOUS` also accepted).\n\n" +
      "### About \"Try it out\"\n" +
      "Swagger runs in the browser and **cannot produce a valid `x-signature`** (the HMAC secret must never reach a browser), " +
      "so Try-it-out will fail in production — treat this page as a **contract reference**. " +
      "Live testing is only possible on localhost with `BC_SWAGGER_LOCAL_BYPASS=true`.\n\n" +
      "### Serialization (\"before\" vs \"after\")\n" +
      "Each endpoint documents the clean payload you send (**before**) and the exact payload BC receives (**after**). " +
      "The critical rule: **line arrays are sent to BC as a JSON-stringified STRING** " +
      "(`orderLinesJson` / `giftboxLinesJson`), not as nested JSON.",
  },
  servers: [
    { url: "https://chilliapi.vercel.app", description: "Production" },
    { url: "http://localhost:3000", description: "Local" },
  ],
  tags: [
    {
      name: "BC Write APIs",
      description: "Server-to-server order-creation endpoints proxied to Business Central.",
    },
  ],
  security: [
    { ApiKeyAuth: [], TimestampHeader: [], NonceHeader: [], SignatureHeader: [] },
  ],
  paths: {
    "/api/bc/orders": {
      post: {
        tags: ["BC Write APIs"],
        summary: "Create CPNR sales order (with lines)",
        description:
          "Creates a confirmation/EDD sales order with lines in BC (`createSalesOrdersWithLines`).\n\n" +
          "#### Compulsory fields\n" +
          "- `sellToCustomerNo`\n" +
          "- `dateType` (`EDD` | `Confirmed`)\n" +
          "- exactly one of `orderLines` (array) **or** `orderLinesJson` (pre-stringified string); at least one line\n" +
          "- each line: `no` + `quantity` (> 0)\n" +
          "- **conditional:** `eddDate` required when `dateType=EDD`; `confirmedStartDate` **and** `orderSource` (non-`Undefined`) required when `dateType=Confirmed`\n" +
          "- per line: `firstMealSession` required when `portion=Dual`; `session` must be `Lunch`/`Dinner` when `portion=Single`/`Trial`\n\n" +
          "#### Backend serialization (what changes before BC sees it)\n" +
          "- `orderLines` (array) → **`orderLinesJson`** = `JSON.stringify(lines)` (a STRING; BC parses it AL-side)\n" +
          "- `requestId` → auto `randomUUID()` if omitted\n" +
          "- `externalDocumentNo` → auto `CP-CFM-YYMMDD-HHMMSS-XXXX` (or `CP-EDD-…`) if omitted\n" +
          "- `billToCustomerNo` → defaults to `sellToCustomerNo`\n" +
          "- `portion=Dual` → `session` forced to `LunchAndDinner` and `firstMealSession` set\n" +
          "- `paymentTransactionId` → used for the local orders table only; **NOT** sent to BC\n\n" +
          "#### After serialization — exact payload sent to BC\n" +
          "```json\n" +
          "{\n" +
          '  "requestId": "3f2a…(auto-uuid)",\n' +
          '  "sellToCustomerNo": "C00010",\n' +
          '  "billToCustomerNo": "C00010",\n' +
          '  "externalDocumentNo": "CP-CFM-260713-101501-9F3A",\n' +
          '  "dateType": "Confirmed",\n' +
          '  "confirmedStartDate": "2026-07-13",\n' +
          '  "orderSource": "Website",\n' +
          '  "orderLinesJson": "[{\\"no\\":\\"CFM-PCP-28D\\",\\"quantity\\":1,\\"portion\\":\\"Dual\\",\\"session\\":\\"LunchAndDinner\\",\\"firstMealSession\\":\\"LunchAndDinner\\",\\"riceOption\\":\\"Brown\\"}]"\n' +
          "}\n" +
          "```\n" +
          "(See the `BcOrderPayload` schema below for the after-shape.)",
        operationId: "createBcSalesOrder",
        requestBody: {
          required: true,
          description: "The clean payload you send (the **before** shape).",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" },
              examples: {
                confirmedDualPackage: {
                  summary: "Confirmed order, Dual package (before serialization)",
                  value: {
                    sellToCustomerNo: "C00010",
                    dateType: "Confirmed",
                    confirmedStartDate: "2026-07-13",
                    orderSource: "Website",
                    orderLines: [
                      {
                        no: "CFM-PCP-28D",
                        quantity: 1,
                        portion: "Dual",
                        session: "LunchAndDinner",
                        firstMealSession: "LunchAndDinner",
                        riceOption: "Brown",
                      },
                    ],
                  },
                },
                eddPreStringified: {
                  summary: "EDD order using orderLinesJson (already stringified)",
                  value: {
                    sellToCustomerNo: "C00010",
                    dateType: "EDD",
                    eddDate: "2026-07-13",
                    orderLinesJson:
                      '[{"no":"CFM-PCP-14D","quantity":1,"portion":"Single","session":"Dinner"}]',
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created in BC",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateOrderSuccess" } },
            },
          },
          "400": {
            description: "Validation error (Zod) or BC business-rule rejection surfaced as a message",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          "401": {
            description: "Signing/guard failure (missing or invalid x-api-key / x-signature / timestamp / nonce)",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          "4XX": {
            description: "BC OData error passthrough (status + details from BC)",
            content: { "application/json": { schema: { $ref: "#/components/schemas/BCErrorResponse" } } },
          },
        },
      },
    },
    "/api/bc/giftbox/orders": {
      post: {
        tags: ["BC Write APIs"],
        summary: "Create CPNR giftbox sales order",
        description:
          "Creates a giftbox sales order in BC (`createGiftboxSalesOrders`).\n\n" +
          "#### Compulsory fields\n" +
          "- `sellToCustomerNo`\n" +
          "- `lines` (array, at least one)\n" +
          "- each line: `itemNo` + `quantity` (> 0)\n" +
          "- each option: `groupCode` + `valueCode`\n" +
          "- **conditional:** option `freeText` required only when `groupCode=CARDMSG` and `valueCode=PERSONALISED`\n\n" +
          "#### BC-side rules (enforced in AL)\n" +
          "- Currency is hardcoded to **SGD** (no `currencyCode` field accepted)\n" +
          "- Item must be in category `GFT`, have a `CPNR GFT Item Setup`, meet its minimum quantity, and satisfy all `Required=true` option groups\n" +
          "- `requestedDeliveryDate`, if given, must not be a blocked date\n\n" +
          "#### Backend serialization\n" +
          "- `lines` (array, incl. nested `options`) → **`giftboxLinesJson`** = `JSON.stringify(lines)` (a STRING)\n" +
          "- `requestId` → auto `randomUUID()` if omitted\n" +
          "- `externalDocumentNo` → auto `CP-GFT-YYMMDD-HHMMSS-XXXX` if omitted\n\n" +
          "#### After serialization — exact payload sent to BC\n" +
          "```json\n" +
          "{\n" +
          '  "requestId": "7c1b…(auto-uuid)",\n' +
          '  "sellToCustomerNo": "C00010",\n' +
          '  "externalDocumentNo": "CP-GFT-260713-101501-2B7E",\n' +
          '  "giftboxLinesJson": "[{\\"itemNo\\":\\"CFM-GFT-001\\",\\"quantity\\":2,\\"options\\":[{\\"groupCode\\":\\"CARDMSG\\",\\"valueCode\\":\\"PERSONALISED\\",\\"freeText\\":\\"Congrats!\\"}]}]"\n' +
          "}\n" +
          "```\n" +
          "(See the `BcGiftboxPayload` schema below for the after-shape.)",
        operationId: "createBcGiftboxOrder",
        requestBody: {
          required: true,
          description: "The clean payload you send (the **before** shape).",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateGiftboxRequest" },
              examples: {
                personalisedCard: {
                  summary: "Giftbox with a personalised card message (before serialization)",
                  value: {
                    sellToCustomerNo: "C00010",
                    requestedDeliveryDate: "2026-07-13",
                    lines: [
                      {
                        itemNo: "CFM-GFT-001",
                        quantity: 2,
                        options: [
                          { groupCode: "CARDMSG", valueCode: "PERSONALISED", freeText: "Congrats!" },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Giftbox order created in BC",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateGiftboxSuccess" } },
            },
          },
          "400": {
            description: "Validation error (Zod) or BC business-rule rejection surfaced as a message",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          "401": {
            description: "Signing/guard failure",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          "4XX": {
            description: "BC OData error passthrough",
            content: { "application/json": { schema: { $ref: "#/components/schemas/BCErrorResponse" } } },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description: "Shared API key (BC_API_KEY).",
      },
      TimestampHeader: {
        type: "apiKey",
        in: "header",
        name: "x-timestamp-ms",
        description: "Unix epoch milliseconds at request time. Must be within ±5 minutes of server time.",
      },
      NonceHeader: {
        type: "apiKey",
        in: "header",
        name: "x-nonce",
        description: "Unique random string per request (replay protection).",
      },
      SignatureHeader: {
        type: "apiKey",
        in: "header",
        name: "x-signature",
        description:
          "Lowercase-hex HMAC-SHA256 over: METHOD\\npath\\nx-timestamp-ms\\nx-nonce\\nsha256hex(body), keyed by HMAC_SECRET_CURRENT.",
      },
    },
    schemas: {
      OrderLineInput: {
        type: "object",
        required: ["no", "quantity"],
        properties: {
          no: { type: "string", description: "BC item No., e.g. CFM-PCP-28D" },
          quantity: { type: "number", description: "Must be greater than 0", example: 1 },
          unitPrice: { type: "number" },
          description: { type: "string" },
          description2: { type: "string" },
          portion: { type: "string", enum: ["Undefined", "Dual", "Single", "Trial"] },
          session: { type: "string", enum: ["Undefined", "Lunch", "Dinner", "LunchAndDinner"] },
          firstMealSession: {
            type: "string",
            enum: ["Undefined", "Lunch", "Dinner"],
            description: "Required when portion = Dual.",
          },
          riceOption: { type: "string", enum: ["Undefined", "Brown", "White", "Mixed"] },
          specialRequestPreset: { type: "string" },
          specialRequestPresetCodes: { type: "array", items: { type: "string" } },
          specialRequestNote: { type: "string" },
        },
      },
      CreateOrderRequest: {
        type: "object",
        required: ["sellToCustomerNo", "dateType"],
        description:
          "BEFORE serialization — the clean payload you POST. Provide EITHER orderLines OR orderLinesJson (at least one line).",
        properties: {
          sellToCustomerNo: { type: "string", description: "Required. BC customer No." },
          dateType: { type: "string", enum: ["EDD", "Confirmed"], description: "Required." },
          orderLines: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderLineInput" },
            description: "Provide this OR orderLinesJson.",
          },
          orderLinesJson: {
            type: "string",
            description: "Pre-stringified JSON array of lines. Provide this OR orderLines.",
          },
          eddDate: { type: "string", format: "date", description: "Required when dateType=EDD. YYYY-MM-DD." },
          confirmedStartDate: {
            type: "string",
            format: "date",
            description: "Required when dateType=Confirmed. Must be today or future and not a blocked date.",
          },
          orderSource: {
            type: "string",
            enum: ["Undefined", "Website", "Salesperson", "EventOrder"],
            description: "Required (non-Undefined) when dateType=Confirmed.",
          },
          requestId: { type: "string", description: "Optional. Auto-generated UUID if omitted." },
          paymentTransactionId: {
            type: "string",
            format: "uuid",
            description: "Optional. From /api/payments/confirm. Used for the local orders table only; NOT sent to BC.",
          },
          billToCustomerNo: { type: "string", description: "Optional. Defaults to sellToCustomerNo." },
          currencyCode: { type: "string" },
          shipToCode: { type: "string" },
          requestedDeliveryDate: { type: "string", format: "date" },
          promisedDeliveryDate: { type: "string", format: "date" },
          externalDocumentNo: {
            type: "string",
            description: "Optional. Auto-generated CP-CFM-/CP-EDD- value if omitted.",
          },
          noWeekendDeliveries: { type: "boolean" },
          promoCode: { type: "string" },
        },
      },
      BcOrderPayload: {
        type: "object",
        description: "AFTER serialization — the exact payload the backend forwards to BC's createSalesOrdersWithLines.",
        required: [
          "requestId",
          "sellToCustomerNo",
          "billToCustomerNo",
          "externalDocumentNo",
          "dateType",
          "orderLinesJson",
        ],
        properties: {
          requestId: { type: "string" },
          sellToCustomerNo: { type: "string" },
          billToCustomerNo: { type: "string" },
          externalDocumentNo: { type: "string" },
          dateType: { type: "string", enum: ["EDD", "Confirmed"] },
          orderLinesJson: {
            type: "string",
            description: "JSON.stringify'd array of line objects — a STRING, not nested JSON.",
          },
          eddDate: { type: "string", format: "date" },
          confirmedStartDate: { type: "string", format: "date" },
          orderSource: { type: "string" },
          currencyCode: { type: "string" },
          shipToCode: { type: "string" },
          requestedDeliveryDate: { type: "string", format: "date" },
          promisedDeliveryDate: { type: "string", format: "date" },
          noWeekendDeliveries: { type: "boolean" },
          promoCode: { type: "string" },
        },
      },
      GiftboxOptionInput: {
        type: "object",
        required: ["groupCode", "valueCode"],
        properties: {
          groupCode: { type: "string", description: "Option group code, e.g. CARDMSG. Must be allowed for the item." },
          valueCode: { type: "string", description: "Option value code, e.g. PERSONALISED. Must be defined for the group." },
          freeText: {
            type: "string",
            description: "Required only when groupCode=CARDMSG and valueCode=PERSONALISED.",
          },
        },
      },
      GiftboxLineInput: {
        type: "object",
        required: ["itemNo", "quantity"],
        properties: {
          itemNo: { type: "string", description: "BC giftbox item No. (category GFT)." },
          quantity: { type: "number", description: "Must be greater than 0 and meet the item's minimum quantity." },
          unitPrice: { type: "number" },
          options: { type: "array", items: { $ref: "#/components/schemas/GiftboxOptionInput" } },
        },
      },
      CreateGiftboxRequest: {
        type: "object",
        required: ["sellToCustomerNo", "lines"],
        description: "BEFORE serialization — the clean giftbox payload you POST.",
        properties: {
          sellToCustomerNo: { type: "string", description: "Required." },
          lines: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/GiftboxLineInput" },
            description: "Required. At least one line.",
          },
          requestId: { type: "string", description: "Optional. Auto-generated UUID if omitted." },
          billToCustomerNo: { type: "string" },
          externalDocumentNo: { type: "string", description: "Optional. Auto-generated CP-GFT- value if omitted." },
          requestedDeliveryDate: {
            type: "string",
            format: "date",
            description: "Optional. Must not be a blocked date.",
          },
          promoCode: { type: "string" },
        },
      },
      BcGiftboxPayload: {
        type: "object",
        description: "AFTER serialization — the exact payload forwarded to BC's createGiftboxSalesOrders.",
        required: ["requestId", "sellToCustomerNo", "externalDocumentNo", "giftboxLinesJson"],
        properties: {
          requestId: { type: "string" },
          sellToCustomerNo: { type: "string" },
          externalDocumentNo: { type: "string" },
          giftboxLinesJson: {
            type: "string",
            description: "JSON.stringify'd array of giftbox lines (incl. nested options) — a STRING.",
          },
          billToCustomerNo: { type: "string" },
          requestedDeliveryDate: { type: "string", format: "date" },
          promoCode: { type: "string" },
        },
      },
      CreateOrderSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          source: { type: "string", example: "created_new" },
          submitted: {
            type: "object",
            properties: {
              externalDocumentNo: { type: "string" },
              requestId: { type: "string" },
            },
          },
          order: { type: "object", description: "BC create response (includes orderNo)." },
        },
      },
      CreateGiftboxSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          submitted: {
            type: "object",
            properties: {
              externalDocumentNo: { type: "string" },
              requestId: { type: "string" },
            },
          },
          order: { type: "object", description: "BC create response." },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: { error: { type: "string" } },
      },
      BCErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "BC request failed" },
          status: { type: "integer" },
          details: { type: "string" },
        },
      },
    },
  },
} as const

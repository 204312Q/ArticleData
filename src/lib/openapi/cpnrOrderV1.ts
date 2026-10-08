export const cpnrOrderOpenApiV1 = {
  openapi: "3.1.0",
  info: {
    title: "CPNR Order Backend API",
    version: "1.6.0",
    description:
      "Browser-safe backend contract for CPNR frontend integrations over banners, reference data, and selected BC-backed wrapper routes. Protected wrapper routes require an internal auth session created through /api/internal-auth/login.",
  },
  servers: [
    {
      url: "https://confinement-khaki.vercel.app",
      description: "Production",
    },
    {
      url: "http://localhost:3000",
      description: "Local",
    },
  ],
  tags: [
    {
      name: "Public APIs",
      description: "Frontend-callable APIs that can be used without internal auth.",
    },
    {
      name: "S2S / Internal BC APIs",
      description:
        "Browser-safe wrappers over BC-backed internal capabilities. These appear only after internal auth is done and the Swagger page is refreshed.",
    },
    {
      name: "Internal Access",
      description: "Internal session endpoints used to unlock protected browser-safe wrapper APIs.",
    },
  ],
  paths: {
    "/api/banners": {
      get: {
        tags: ["Public APIs"],
        summary: "List active CPNR banners",
        description:
          "Returns non-blocked CPNR banners for frontend display in both grouped and flat forms, with explicit desktop and mobile image URLs.",
        parameters: [
          {
            name: "top",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 1000,
              default: 200,
            },
            description: "Maximum banner rows fetched from BC before backend sorting and filtering.",
          },
          {
            name: "bannerNo",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Optional BC banner number filter.",
          },
        ],
        responses: {
          "200": {
            description: "Banner list loaded",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BannerListResponse",
                },
                examples: {
                  default: {
                    summary: "Grouped and flat banner payload",
                    value: {
                      success: true,
                      count: 2,
                      banners: [
                        {
                          bannerNo: 3,
                          bannerName: "HB1",
                          images: [
                            {
                              id: 3,
                              sequence: 10,
                              desktopImageUrl: "https://cdn.example.com/images/banner-3-desktop.jpg",
                              mobileImageUrl: "https://cdn.example.com/images/banner-3-mobile.jpg",
                              targetUrl: "https://confinement.example.com/promo/early-bird",
                              targetLabel: "Early Bird Special",
                              openInNewTab: false,
                              blocked: false,
                            },
                          ],
                        },
                      ],
                      items: [
                        {
                          id: 3,
                          bannerNo: 3,
                          bannerName: "HB1",
                          sequence: 10,
                          desktopImageUrl: "https://cdn.example.com/images/banner-3-desktop.jpg",
                          mobileImageUrl: "https://cdn.example.com/images/banner-3-mobile.jpg",
                          targetUrl: "https://confinement.example.com/promo/early-bird",
                          targetLabel: "Early Bird Special",
                          openInNewTab: false,
                          blocked: false,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "4XX": {
            description: "BC/auth error passthrough",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BCErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Backend error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/special-request-presets": {
      get: {
        tags: ["Public APIs"],
        summary: "List special request presets",
        description:
          "Returns CPNR special request presets sorted by sortOrder. By default blocked presets are excluded.",
        parameters: [
          {
            name: "top",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 1000,
              default: 200,
            },
          },
          {
            name: "includeBlocked",
            in: "query",
            required: false,
            schema: {
              type: "boolean",
              default: false,
            },
          },
        ],
        responses: {
          "200": {
            description: "Preset list loaded",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SpecialRequestPresetListResponse",
                },
              },
            },
          },
          "500": {
            description: "Backend error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/blocked-dates": {
      get: {
        tags: ["Public APIs"],
        summary: "List blocked delivery dates",
        description:
          "Returns current and future blocked delivery dates (>= today) so the website calendar picker can disable them.",
        responses: {
          "200": {
            description: "Blocked dates loaded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    count: { type: "integer", example: 2 },
                    dates: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string", format: "date", example: "2026-07-13" },
                          description: {
                            type: "string",
                            description: "May be null.",
                            example: "Public Holiday",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Backend error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/promo-codes/validate": {
      get: {
        tags: ["Public APIs"],
        summary: "Validate a promo code",
        description:
          "Checks whether a promo code is active and eligible. Returns discount details when valid, or a reason when invalid. Pass `subtotal` to get a calculated `discountAmount`.",
        parameters: [
          {
            name: "code",
            in: "query",
            required: true,
            schema: { type: "string", example: "SUMMER10" },
            description: "The promo code entered by the customer (case-insensitive).",
          },
          {
            name: "subtotal",
            in: "query",
            required: false,
            schema: { type: "number", example: 1200.00 },
            description: "Order subtotal before discount. Used to calculate `discountAmount` and validate `minSpend`.",
          },
        ],
        responses: {
          "200": {
            description: "Promo code is valid",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    valid: { type: "boolean", example: true },
                    code: { type: "string", example: "SUMMER10" },
                    description: { type: "string", example: "Summer 10% Off" },
                    discountType: { type: "string", enum: ["Amount", "Percent"], example: "Percent" },
                    discountValue: { type: "number", example: 10 },
                    maxCap: { type: "number", nullable: true, example: 50.00, description: "null means no cap." },
                    minSpend: { type: "number", nullable: true, example: 500.00, description: "null means no minimum." },
                    itemCategoryCode: { type: "string", example: "PCP" },
                    discountAmount: { type: "number", example: 20.00, description: "Calculated discount. 0 if subtotal not provided." },
                  },
                },
              },
            },
          },
          "404": {
            description: "Promo code not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    valid: { type: "boolean", example: false },
                    reason: { type: "string", example: "Promo code not found." },
                  },
                },
              },
            },
          },
          "422": {
            description: "Promo code found but ineligible (blocked, expired, exhausted, below min spend)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    valid: { type: "boolean", example: false },
                    reason: { type: "string", example: "This promo code has expired." },
                    minSpend: { type: "number", description: "Only present when reason is minimum spend not met." },
                  },
                },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/items": {
      get: {
        tags: ["Public APIs"],
        summary: "List CPNR product items",
        description:
          "Returns BC items filtered to CFM product families for CPNR. Excludes CFM-DCP-xxx and groups items into addons, packages, partner products, and bundles. Use groups.* for category-section rendering, or items for a flat unified list.",
        parameters: [
          {
            name: "top",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 5000,
              default: 1000,
            },
            description: "Maximum rows fetched from BC before backend grouping/filtering.",
          },
        ],
        responses: {
          "200": {
            description: "Item list loaded",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ItemListResponse",
                },
              },
            },
          },
          "500": {
            description: "Backend error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/payments/session": {
      post: {
        tags: ["Public APIs"],
        summary: "Create payment checkout session",
        description:
          "Creates the payment capture context used by the frontend to open CyberSource Unified Checkout.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PaymentSessionRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Payment session created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaymentSessionResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelopeResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/payments/confirm": {
      post: {
        tags: ["Public APIs"],
        summary: "Confirm payment result",
        description:
          "Confirms the payment result after Unified Checkout returns resultJwt and transientToken.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ConfirmPaymentRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Payment confirmed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ConfirmPaymentResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelopeResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/checkout/complete": {
      post: {
        tags: ["Public APIs"],
        summary: "Complete checkout after successful payment",
        description:
          "Finalizes the frontend checkout flow after payment confirmation and maps the draft order into backend/BC order creation.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CheckoutCompleteRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Checkout completed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CheckoutCompleteResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelopeResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/internal-auth/login": {
      post: {
        tags: ["Internal Access"],
        summary: "Create internal API session",
        description:
          "Creates an internal browser session cookie used to unlock protected wrapper APIs in Swagger. Credentials are configured via backend environment variables and are never exposed to the browser.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternalAuthLoginRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Internal session created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InternalAuthSessionResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/internal-auth/logout": {
      post: {
        tags: ["Internal Access"],
        summary: "Clear internal API session",
        responses: {
          "200": {
            description: "Internal session cleared",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InternalAuthSessionResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/internal-auth/session": {
      get: {
        tags: ["Internal Access"],
        summary: "Inspect internal API session state",
        responses: {
          "200": {
            description: "Current session state",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InternalAuthSessionResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/bc/orders": {
      post: {
        tags: ["S2S / Internal BC APIs"],
        summary: "Create CPNR sales order with lines",
        description:
          "Creates a CPNR order header and item lines in one BC AL call (`createSalesOrdersWithLines`). This is the raw internal BC-backed route.\n\n**Important:** this route is shown in Swagger after internal auth for reference and backend-team testing, but browser Swagger `Try it out` still does not satisfy the full S2S guard stack (`timestamp`, `nonce`, `HMAC`, `API key`). Use Postman or backend tooling for real signed requests.\n\nIf `requestId` or `externalDocumentNo` is omitted, the backend generates them automatically. Include `paymentTransactionId` when you want to link a confirmed payment to the created order. Set `noWeekendDeliveries` to `true` when BC should skip Saturday and Sunday during schedule generation.\n\n**Portion/session auto-normalization:** `Dual` — backend forces `session = LunchAndDinner`; `firstMealSession` is required. `Single`/`Trial` — `session` must be `Lunch` or `Dinner`; backend auto-sets `firstMealSession = session`.\n\n**billToCustomerNo:** Always injected as `sellToCustomerNo` when omitted.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrderRequest",
              },
              examples: {
                eddOrderLinesJson: {
                  summary: "EDD order (recommended orderLinesJson format)",
                  value: {
                    sellToCustomerNo: "C000166",
                    billToCustomerNo: "C000166",
                    requestedDeliveryDate: "2026-06-06",
                    promisedDeliveryDate: "2026-06-06",
                    dateType: "EDD",
                    eddDate: "2026-05-26",
                    orderSource: "Website",
                    noWeekendDeliveries: true,
                    orderLinesJson:
                      "[{\"no\":\"CFM-PCP-003\",\"quantity\":1,\"portion\":\"Dual\",\"session\":\"LunchAndDinner\",\"firstMealSession\":\"Dinner\",\"specialRequestPresetCodes\":[\"EXC_CHICKEN_EGG_1_2W\",\"EXC_PEAS\",\"EXC_SALMON\"]},{\"no\":\"CFM-ADN-005\",\"quantity\":1},{\"no\":\"CFM-ADN-008\",\"quantity\":1}]",
                  },
                },
                confirmedArray: {
                  summary: "Confirmed order (recommended orderLines array format)",
                  value: {
                    sellToCustomerNo: "C000166",
                    billToCustomerNo: "C000166",
                    requestedDeliveryDate: "2026-06-06",
                    promisedDeliveryDate: "2026-06-06",
                    dateType: "Confirmed",
                    confirmedStartDate: "2026-06-06",
                    orderSource: "Website",
                    noWeekendDeliveries: false,
                    orderLines: [
                      {
                        no: "CFM-PCP-003",
                        quantity: 1,
                        portion: "Dual",
                        session: "LunchAndDinner",
                        firstMealSession: "Dinner",
                        specialRequestPresetCodes: ["EXC_CHICKEN_EGG_1_2W", "EXC_PEAS", "EXC_SALMON"],
                      },
                      { no: "CFM-ADN-005", quantity: 1 },
                      { no: "CFM-ADN-008", quantity: 1 },
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created new order",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateOrderResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "4XX": {
            description: "BC/auth error passthrough",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BCErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/customers": {
      get: {
        tags: ["S2S / Internal BC APIs"],
        summary: "List BC customers through browser-safe wrapper",
        description:
          "Returns BC customer results through a browser-safe wrapper route. Requires an internal session created via /api/internal-auth/login before Swagger Try it out will work.",
        parameters: [
          {
            name: "top",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 200,
              default: 50,
            },
          },
        ],
        responses: {
          "200": {
            description: "Customer list loaded",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomerListResponse",
                },
              },
            },
          },
          "401": {
            description: "Internal session required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/orders/{orderNo}/details": {
      get: {
        tags: ["S2S / Internal BC APIs"],
        summary: "Fetch consolidated order details",
        description:
          "Returns a calendar-ready consolidated payload from CPNR order header, order lines, and package line profile through a browser-safe wrapper. Requires an internal session created via /api/internal-auth/login.",
        parameters: [
          {
            name: "orderNo",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Consolidated details loaded",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OrderDetailsResponse",
                },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "4XX": {
            description: "BC/auth or validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BCErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/bc/giftbox/orders": {
      post: {
        tags: ["S2S / Internal BC APIs"],
        summary: "Create CPNR giftbox sales order",
        description:
          "Creates a giftbox sales order in BC. Requires internal auth session.\n\nSend `lines` as a clean JSON array — the backend stringifies it into `giftboxLinesJson` before calling BC. Each line must include all required option groups for the chosen item (see CPNR Giftbox Item Option Maps in BC). `externalDocumentNo` is auto-generated as `CP-GFT-YYMMDD-HHMMSS-XXXX` if omitted.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateGiftboxOrderRequest",
              },
              examples: {
                singleLineTwoGroups: {
                  summary: "Single line — 2 option groups (CFM-GFT-BBA)",
                  value: {
                    sellToCustomerNo: "C000085",
                    requestedDeliveryDate: "2026-08-01",
                    lines: [
                      {
                        itemNo: "CFM-GFT-BBA",
                        quantity: 1,
                        options: [
                          { groupCode: "ANGKUSHAPE", valueCode: "ROUND" },
                          { groupCode: "CARDMSG", valueCode: "BOY" },
                        ],
                      },
                    ],
                  },
                },
                personalisedWithPromo: {
                  summary: "Personalised card message + promo code (CFM-GFT-BBC)",
                  value: {
                    sellToCustomerNo: "C000085",
                    requestedDeliveryDate: "2026-08-01",
                    promoCode: "GFT10PCT",
                    lines: [
                      {
                        itemNo: "CFM-GFT-BBC",
                        quantity: 1,
                        options: [
                          { groupCode: "ANGKUSHAPE", valueCode: "POINTED" },
                          {
                            groupCode: "CARDMSG",
                            valueCode: "PERSONALISED",
                            freeText: "Welcome to the world, little one!",
                          },
                        ],
                      },
                    ],
                  },
                },
                multipleLines: {
                  summary: "Multiple lines — different products and option groups",
                  value: {
                    sellToCustomerNo: "C000085",
                    requestedDeliveryDate: "2026-08-01",
                    lines: [
                      {
                        itemNo: "CFM-GFT-MIR",
                        quantity: 1,
                        options: [
                          { groupCode: "ANGKUCHOICE", valueCode: "GOLD" },
                          { groupCode: "ANGKUSHAPE", valueCode: "ROUND" },
                          { groupCode: "CARDMSG", valueCode: "BOY" },
                          { groupCode: "TREATC_6", valueCode: "KSALAT" },
                        ],
                      },
                      {
                        itemNo: "CFM-GFT-KKS",
                        quantity: 1,
                        options: [
                          { groupCode: "ANGKUSHAPE", valueCode: "POINTED" },
                          { groupCode: "CARDMSG", valueCode: "GIRL" },
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
            description: "Giftbox order created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateGiftboxOrderResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error or BC business rule violation",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "4XX": {
            description: "BC error passthrough",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BCErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateOrderRequest: {
        type: "object",
        required: ["sellToCustomerNo", "dateType"],
        properties: {
          requestId: { type: "string", format: "uuid", description: "Optional. Backend auto-generates a UUID when omitted." },
          paymentTransactionId: { type: "string", format: "uuid", description: "Optional. UUID from /api/payments/confirm. Links payment to this order for tracking." },
          sellToCustomerNo: { type: "string" },
          billToCustomerNo: { type: "string", description: "Optional. Defaults to `sellToCustomerNo` when omitted." },
          currencyCode: { type: "string" },
          shipToCode: { type: "string" },
          requestedDeliveryDate: { type: "string", format: "date" },
          promisedDeliveryDate: { type: "string", format: "date" },
          externalDocumentNo: { type: "string", description: "Optional website/external reference. Backend auto-generates one when omitted." },
          dateType: {
            type: "string",
            enum: ["EDD", "Confirmed"],
            description: "Order date type. `EDD` = estimated delivery date order (eddDate required). `Confirmed` = fixed-start order (confirmedStartDate required).",
          },
          eddDate: { type: "string", format: "date", description: "Required when dateType is `EDD`." },
          confirmedStartDate: { type: "string", format: "date", description: "Required when dateType is `Confirmed`. Must be today or a future date." },
          orderSource: {
            type: "string",
            enum: ["Undefined", "Website", "Salesperson", "EventOrder"],
            description: "Required and must not be `Undefined` when dateType is `Confirmed`.",
          },
          noWeekendDeliveries: {
            type: "boolean",
            description: "Optional whole-order scheduling rule. When true, BC skips Saturday and Sunday deliveries during schedule generation.",
          },
          promoCode: {
            type: "string",
            description: "Optional promo code. Backend validates eligibility and reserves the code against this order.",
          },
          orderLinesJson: {
            type: "string",
            description: "Recommended for EDD orders. AL-native payload format: JSON array encoded as string.",
          },
          orderLines: {
            type: "array",
            items: {
              $ref: "#/components/schemas/CreateOrderLineInput",
            },
            description: "Recommended for Confirmed orders. Backend convenience format. Backend serializes this into orderLinesJson.",
          },
        },
      },
      CreateOrderLineInput: {
        type: "object",
        required: ["no", "quantity"],
        properties: {
          no: { type: "string" },
          quantity: { type: "number", minimum: 0.00001 },
          unitPrice: { type: "number" },
          description: { type: "string" },
          description2: { type: "string" },
          portion: {
            type: "string",
            enum: ["Undefined", "Dual", "Single", "Trial"],
            description: "Package portion type. Determines session rules — see `session` and `firstMealSession`.",
          },
          session: {
            type: "string",
            enum: ["Undefined", "Lunch", "Dinner", "LunchAndDinner"],
            description: "Meal session. Rules: `Dual` → backend auto-forces `LunchAndDinner` regardless of what is sent. `Single`/`Trial` → must be `Lunch` or `Dinner` (required when portion is set).",
          },
          firstMealSession: {
            type: "string",
            enum: ["Undefined", "Lunch", "Dinner"],
            description: "First meal of the package. Rules: `Dual` → required (`Lunch` or `Dinner`). `Single`/`Trial` → backend auto-sets to match `session` (no need to send).",
          },
          riceOption: { type: "string", enum: ["Undefined", "Brown", "White", "Mixed"] },
          specialRequestPreset: { type: "string" },
          specialRequestPresetCodes: {
            type: "array",
            items: { type: "string" },
          },
          specialRequestNote: { type: "string" },
        },
        additionalProperties: true,
      },
      CreateOrderResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          source: {
            type: "string",
            enum: ["created_new"],
          },
          submitted: {
            type: "object",
            properties: {
              requestId: { type: "string", format: "uuid" },
              externalDocumentNo: { type: "string" },
            },
          },
          order: {
            type: "object",
            properties: {
              requestId: { type: "string", format: "uuid" },
              orderNo: { type: "string" },
              orderSystemId: { type: "string", format: "uuid" },
              createdLineNos: { type: "string" },
              responseJson: { type: "string" },
            },
            additionalProperties: true,
          },
        },
      },
      LineProfileUpsertRequest: {
        type: "object",
        properties: {
          documentType: {
            type: "string",
            enum: ["Order"],
            default: "Order",
          },
          lineProfiles: {
            type: "array",
            items: {
              $ref: "#/components/schemas/LineProfileInput",
            },
          },
          lines: {
            type: "array",
            items: {
              $ref: "#/components/schemas/LineProfileInput",
            },
            description: "Alias supported by backend, same as lineProfiles.",
          },
          profile: {
            $ref: "#/components/schemas/LineProfileInput",
          },
          salesLineNo: {
            type: "integer",
            description: "Single-row shorthand payload support.",
          },
          lineNo: {
            type: "integer",
            description: "Alias supported by backend, maps to salesLineNo.",
          },
        },
        additionalProperties: true,
      },
      LineProfileInput: {
        type: "object",
        description: "Upsertable fields for package profile. **Editable:** firstMealSession (Dual only), riceOption, specialRequestPresets, specialRequestNote. **Immutable (auto-determined from order):** portion, session.",
        properties: {
          documentType: {
            type: "string",
            enum: ["Order"],
            description: "[Read-only] Automatically set to Order.",
          },
          salesLineNo: {
            type: "integer",
            minimum: 1,
            description: "[Read-only] Optional in request. If provided, must match the order's package line. Backend resolves automatically.",
          },
          lineNo: {
            type: "integer",
            minimum: 1,
            description: "[Read-only alias] Maps to salesLineNo. Backend resolves automatically.",
          },
          firstMealSession: {
            type: "string",
            enum: ["Undefined", "Lunch", "Dinner"],
            description:
              "[EDITABLE] Only for Dual packages. Lunch (default) or Dinner (skip day-1 lunch).",
          },
          startMealSession: {
            type: "string",
            description: "[EDITABLE alias] Maps to firstMealSession.",
          },
          startSession: {
            type: "string",
            description: "[EDITABLE alias] Maps to firstMealSession.",
          },
          startWithDinner: {
            type: "boolean",
            description: "[EDITABLE boolean alias] true=Dinner, false=Lunch.",
          },
          riceOption: {
            type: "string",
            enum: ["Undefined", "Brown", "White", "Mixed"],
            description: "[EDITABLE] Available for all packages.",
          },
          rice: {
            type: "string",
            description: "[EDITABLE alias] Maps to riceOption.",
          },
          portion: {
            type: "string",
            description: "[IMMUTABLE] Derived from ordered package. Rejected if sent in request.",
          },
          session: {
            type: "string",
            description: "[IMMUTABLE] Derived from ordered package. Rejected if sent in request.",
          },
          packageType: {
            type: "string",
            description: "[IMMUTABLE] Derived from ordered package. Rejected if sent in request.",
          },
          specialRequestPreset: {
            type: "string",
            description: "[EDITABLE] Single preset code (legacy). Use specialRequestPresets array instead.",
          },
          specialRequestPresets: {
            type: "array",
            items: { type: "string" },
            description:
              "[EDITABLE] Preferred field for multi-select presets. Available for all packages.",
          },
          specialRequestCode: {
            type: "string",
            description: "[EDITABLE alias] Maps to specialRequestPreset.",
          },
          specialRequestNote: {
            type: "string",
            description: "[EDITABLE] Free-form special instructions (max 250 chars). Available for all packages.",
          },
          specialRequest: {
            type: "string",
            description: "[EDITABLE alias] Maps to specialRequestNote.",
          },
        },
      },
      OrderDetailsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          orderNo: { type: "string" },
          header: {
            type: "object",
            properties: {
              externalDocumentNo: { type: "string", nullable: true },
              dateType: { type: "string", nullable: true },
              eddDate: { type: "string", format: "date", nullable: true },
              confirmedStartDate: { type: "string", format: "date", nullable: true },
              orderSource: { type: "string", nullable: true },
              noWeekendDeliveries: { type: "boolean", nullable: true },
            },
          },
          packageLine: {
            type: "object",
            nullable: true,
            properties: {
              salesLineNo: { type: "integer", nullable: true },
              itemNo: { type: "string", nullable: true },
              description: { type: "string", nullable: true },
              quantity: { type: "number", nullable: true },
              unitPrice: { type: "number", nullable: true },
            },
          },
          addons: {
            type: "array",
            items: {
              type: "object",
              properties: {
                salesLineNo: { type: "integer", nullable: true },
                itemNo: { type: "string", nullable: true },
                description: { type: "string", nullable: true },
                quantity: { type: "number", nullable: true },
                unitPrice: { type: "number", nullable: true },
              },
            },
          },
          lineProfile: {
            type: "object",
            nullable: true,
            properties: {
              portion: { type: "string", nullable: true },
              session: { type: "string", nullable: true },
              firstMealSession: { type: "string", nullable: true },
              riceOption: { type: "string", nullable: true },
              specialRequestPresets: {
                type: "array",
                items: { type: "string" },
              },
              specialRequestNote: { type: "string", nullable: true },
            },
          },
          calendar: {
            type: "object",
            properties: {
              isCalendarEligible: { type: "boolean" },
              eligibilityReason: { type: "string" },
              packageDays: { type: "integer", nullable: true },
              startDate: { type: "string", format: "date", nullable: true },
              endDate: { type: "string", format: "date", nullable: true },
            },
          },
        },
      },
      SpecialRequestPresetListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          count: { type: "integer" },
          presets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: { type: "string" },
                description: { type: "string" },
                sortOrder: { type: "integer" },
                blocked: { type: "boolean" },
              },
              additionalProperties: true,
            },
          },
        },
      },
      ProductItem: {
        type: "object",
        properties: {
          number: { type: "string" },
          displayName: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          type: { type: "string", nullable: true },
          unitPrice: { type: "number", nullable: true },
          blocked: { type: "boolean", nullable: true },
          productGroup: {
            type: "string",
            enum: ["Addon", "Package", "PartnerProduct", "Bundle"],
          },
          inAddonSection: { type: "boolean" },
        },
      },
      BannerImage: {
        type: "object",
        properties: {
          id: { type: "integer", nullable: true },
          sequence: { type: "integer", nullable: true },
          desktopImageUrl: { type: "string", nullable: true },
          mobileImageUrl: { type: "string", nullable: true },
          targetUrl: { type: "string", nullable: true },
          targetLabel: { type: "string", nullable: true },
          openInNewTab: { type: "boolean", nullable: true },
          blocked: { type: "boolean", nullable: true },
        },
      },
      BannerGroup: {
        type: "object",
        properties: {
          bannerNo: { type: "integer", nullable: true },
          bannerName: { type: "string", nullable: true },
          images: {
            type: "array",
            items: {
              $ref: "#/components/schemas/BannerImage",
            },
          },
        },
      },
      BannerListItem: {
        type: "object",
        properties: {
          id: { type: "integer", nullable: true },
          bannerNo: { type: "integer", nullable: true },
          bannerName: { type: "string", nullable: true },
          sequence: { type: "integer", nullable: true },
          desktopImageUrl: { type: "string", nullable: true },
          mobileImageUrl: { type: "string", nullable: true },
          targetUrl: { type: "string", nullable: true },
          targetLabel: { type: "string", nullable: true },
          openInNewTab: { type: "boolean", nullable: true },
          blocked: { type: "boolean", nullable: true },
        },
      },
      BannerListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          count: { type: "integer" },
          banners: {
            type: "array",
            description: "Grouped by bannerNo/bannerName for carousel-style frontend rendering.",
            items: {
              $ref: "#/components/schemas/BannerGroup",
            },
          },
          items: {
            type: "array",
            description: "Flat sorted banner rows for simple list rendering or debugging.",
            items: {
              $ref: "#/components/schemas/BannerListItem",
            },
          },
        },
      },
      ItemListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          count: { type: "integer" },
          groups: {
            type: "object",
            description: "Category-based sections for frontend rendering.",
            properties: {
              addons: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProductItem",
                },
              },
              packages: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProductItem",
                },
              },
              partnerProducts: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProductItem",
                },
              },
              bundles: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProductItem",
                },
              },
              addonSection: {
                type: "array",
                description: "Combined addons + partnerProducts list for addon section rendering.",
                items: {
                  $ref: "#/components/schemas/ProductItem",
                },
              },
            },
          },
          items: {
            type: "array",
            description: "Flat unified product list (non-categorized rendering/search/dropdown use cases).",
            items: {
              $ref: "#/components/schemas/ProductItem",
            },
          },
        },
      },
      PaymentSessionRequest: {
        type: "object",
        required: ["amount", "currency", "customer", "orderReference"],
        properties: {
          amount: {
            oneOf: [{ type: "number" }, { type: "string" }],
            description: "Monetary amount. Number or string with up to 2 decimal places.",
          },
          currency: {
            type: "string",
            minLength: 3,
            maxLength: 3,
            description: "3-letter ISO currency code, for example SGD.",
          },
          customer: {
            type: "object",
            required: ["email", "phoneNumber"],
            properties: {
              email: { type: "string", format: "email" },
              phoneNumber: { type: "string" },
            },
          },
          orderReference: { type: "string" },
        },
      },
      PaymentSessionResponse: {
        type: "object",
        properties: {
          status: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            nullable: true,
            properties: {
              captureContext: { type: "string" },
              orderReference: { type: "string" },
            },
          },
        },
      },
      CustomerListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          count: { type: "integer" },
          customers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", nullable: true },
                number: { type: "string", nullable: true },
                displayName: { type: "string", nullable: true },
                email: { type: "string", nullable: true },
                phoneNumber: { type: "string", nullable: true },
                address: { type: "string", nullable: true },
                address2: { type: "string", nullable: true },
                city: { type: "string", nullable: true },
                country: { type: "string", nullable: true },
                postalCode: { type: "string", nullable: true },
                genBusPostingGroup: { type: "string", nullable: true },
                customerPostingGroup: { type: "string", nullable: true },
                vatBusPostingGroup: { type: "string", nullable: true },
              },
              additionalProperties: true,
            },
          },
        },
      },
      CheckoutCompleteRequest: {
        type: "object",
        required: ["draft", "orderReference", "resultJwt", "transientToken"],
        properties: {
          draft: {
            type: "object",
            additionalProperties: true,
            description: "Frontend checkout draft payload captured from product-order-flow.",
          },
          orderReference: { type: "string" },
          resultJwt: { type: "string" },
          transientToken: { type: "string" },
        },
      },
      CheckoutCompleteResponse: {
        type: "object",
        properties: {
          status: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            nullable: true,
            additionalProperties: true,
          },
        },
      },
      InternalAuthLoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
      },
      InternalAuthSessionResponse: {
        type: "object",
        properties: {
          status: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            nullable: true,
            properties: {
              authenticated: { type: "boolean" },
              configured: { type: "boolean", nullable: true },
              expiresAt: { type: "string", format: "date-time", nullable: true },
              username: { type: "string", nullable: true },
            },
          },
        },
      },
      LineProfileUpsertResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          orderNo: { type: "string" },
          updatedCount: { type: "integer" },
          packageSalesLineNo: { type: "integer", nullable: true },
          profiles: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
        },
      },
      UploadMultipartRequest: {
        type: "object",
        required: ["file"],
        properties: {
          file: {
            type: "string",
            format: "binary",
          },
          customerNo: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          targetUrl: { type: "string" },
          targetLabel: { type: "string" },
          openInNewTab: { type: "boolean" },
        },
      },
      UploadImageJsonRequest: {
        type: "object",
        required: ["image"],
        properties: {
          image: {
            type: "string",
            description: "Base64 image payload. Data URL prefix is allowed.",
          },
          fileName: { type: "string" },
          mimeType: { type: "string", default: "image/webp" },
          customerNo: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          targetUrl: { type: "string" },
          targetLabel: { type: "string" },
          openInNewTab: { type: "boolean" },
        },
      },
      UploadPdfJsonRequest: {
        type: "object",
        required: ["pdf"],
        properties: {
          pdf: {
            type: "string",
            description: "Base64 PDF payload. Data URL prefix is allowed.",
          },
          fileName: { type: "string" },
          mimeType: { type: "string", default: "application/pdf" },
          customerNo: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          targetUrl: { type: "string" },
          targetLabel: { type: "string" },
          openInNewTab: { type: "boolean" },
        },
      },
      UploadStorageResult: {
        type: "object",
        properties: {
          bucket: { type: "string" },
          key: { type: "string" },
          publicUrl: { type: "string" },
          etag: { type: "string", nullable: true },
        },
      },
      UploadAssetData: {
        type: "object",
        properties: {
          url: { type: "string" },
          publicUrl: { type: "string" },
          assetId: { type: "string" },
          objectKey: { type: "string" },
          fileName: { type: "string" },
          mimeType: { type: "string" },
        },
      },
      UploadAssetResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { $ref: "#/components/schemas/UploadAssetData" },
          assetId: { type: "string" },
          objectKey: { type: "string" },
          url: { type: "string" },
          publicUrl: { type: "string" },
          fileName: { type: "string" },
          mimeType: { type: "string" },
          customerNo: { type: "string", nullable: true },
          title: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          targetUrl: { type: "string", nullable: true },
          targetLabel: { type: "string", nullable: true },
          openInNewTab: { type: "boolean", nullable: true },
          storage: { $ref: "#/components/schemas/UploadStorageResult" },
        },
      },
      UploadRecord: {
        type: "object",
        properties: {
          id: { type: "string", nullable: true },
        },
        additionalProperties: true,
      },
      UploadRecordListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          count: { type: "integer" },
          records: {
            type: "array",
            items: { $ref: "#/components/schemas/UploadRecord" },
          },
        },
      },
      DeleteAssetRequest: {
        type: "object",
        properties: {
          assetId: { type: "string" },
          objectKey: {
            type: "string",
            description: "Alias accepted by backend, same as assetId.",
          },
        },
      },
      DeleteAssetResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              assetId: { type: "string" },
              objectKey: { type: "string" },
            },
          },
          assetId: { type: "string" },
          objectKey: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      ErrorEnvelopeResponse: {
        type: "object",
        properties: {
          status: { type: "integer" },
          message: { type: "string" },
          data: {
            nullable: true,
          },
        },
      },
      ConfirmPaymentRequest: {
        type: "object",
        required: ["orderReference", "resultJwt", "transientToken"],
        properties: {
          orderReference: {
            type: "string",
            description: "The payment gateway order reference. Used to track payment in our system.",
          },
          resultJwt: {
            type: "string",
            description: "JWT returned by payment gateway containing payment result details.",
          },
          transientToken: {
            type: "string",
            description: "Transient token from payment gateway for verification.",
          },
        },
      },
      ConfirmPaymentResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          paymentTransactionId: {
            type: "string",
            format: "uuid",
            description: "Backend PaymentTransaction UUID. Use this when linking the created order to the stored payment record.",
          },
          transactionId: { type: "string", description: "Payment gateway transaction ID returned by the gateway." },
          orderReference: { type: "string" },
          paymentStatus: { type: "string", enum: ["AUTHORIZED", "PENDING", "DECLINED", "ERROR"] },
          amount: { type: "string", nullable: true },
          currency: { type: "string", nullable: true },
          reconciliationId: { type: "string", nullable: true },
          card: {
            type: "object",
            nullable: true,
            properties: {
              type: { type: "string", nullable: true, description: "Card type (Visa, Mastercard, etc.)" },
              number: { type: "string", nullable: true, description: "Last 4 digits" },
              expirationMonth: { type: "string", nullable: true },
              expirationYear: { type: "string", nullable: true },
            },
          },
          billingAddress: {
            type: "object",
            nullable: true,
            properties: {
              firstName: { type: "string", nullable: true },
              lastName: { type: "string", nullable: true },
              email: { type: "string", nullable: true },
              address1: { type: "string", nullable: true },
              address2: { type: "string", nullable: true },
              city: { type: "string", nullable: true },
              administrativeArea: { type: "string", nullable: true },
              country: { type: "string", nullable: true },
              postalCode: { type: "string", nullable: true },
              phoneNumber: { type: "string", nullable: true },
            },
          },
          shippingAddress: {
            type: "object",
            nullable: true,
            properties: {
              firstName: { type: "string", nullable: true },
              lastName: { type: "string", nullable: true },
              email: { type: "string", nullable: true },
              address1: { type: "string", nullable: true },
              address2: { type: "string", nullable: true },
              city: { type: "string", nullable: true },
              administrativeArea: { type: "string", nullable: true },
              country: { type: "string", nullable: true },
              postalCode: { type: "string", nullable: true },
              phoneNumber: { type: "string", nullable: true },
            },
          },
          submitTimeUtc: { type: "string", nullable: true, format: "date-time" },
        },
      },
      PaymentErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          errorReason: { type: "string", nullable: true },
        },
      },
      BCErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
          status: { type: "integer" },
          details: { type: "string" },
        },
      },
      GiftboxOption: {
        type: "object",
        required: ["groupCode", "valueCode"],
        properties: {
          groupCode: {
            type: "string",
            description: "Option group code (e.g. CARDMSG, ANGKUSHAPE, ANGKUCHOICE, TREATA_2, TREATB_4, TREATC_6).",
            example: "CARDMSG",
          },
          valueCode: {
            type: "string",
            description:
              "Option value code within the group. CARDMSG: BOY / GIRL / HELLO / PERSONALISED. ANGKUSHAPE: ROUND / POINTED. ANGKUCHOICE: GOLD / CHARCOAL. TREATA_2: KSALAT / RLAPIS. TREATB_4 / TREATC_6: KSALAT / RLAPIS / PSROLL / RVCAKE / FCAKE / WCAKE.",
            example: "BOY",
          },
          freeText: {
            type: "string",
            description: "Required when valueCode is PERSONALISED. The personalised card message text.",
            example: "Welcome to the world, little one!",
          },
        },
      },
      GiftboxLine: {
        type: "object",
        required: ["itemNo", "quantity"],
        properties: {
          itemNo: {
            type: "string",
            description: "Giftbox item code. Must belong to item category GFT.",
            example: "CFM-GFT-BBA",
            enum: [
              "CFM-GFT-BBA",
              "CFM-GFT-BBB",
              "CFM-GFT-BBC",
              "CFM-GFT-KKS",
              "CFM-GFT-SCA",
              "CFM-GFT-SCB",
              "CFM-GFT-MIR",
              "CFM-GFT-DEL",
            ],
          },
          quantity: {
            type: "number",
            minimum: 1,
            description: "Order quantity. Must meet the item minimum quantity configured in BC.",
            example: 1,
          },
          unitPrice: {
            type: "number",
            description: "Override unit price. Omit to use BC default price.",
          },
          options: {
            type: "array",
            description:
              "Option selections for this line. Each required option group for the item must be present exactly once.",
            items: { $ref: "#/components/schemas/GiftboxOption" },
          },
        },
      },
      CreateGiftboxOrderRequest: {
        type: "object",
        required: ["sellToCustomerNo", "lines"],
        properties: {
          requestId: {
            type: "string",
            description: "Idempotency key. Auto-generated (UUID) if omitted.",
          },
          sellToCustomerNo: {
            type: "string",
            description: "BC customer number.",
            example: "C000085",
          },
          billToCustomerNo: {
            type: "string",
            description: "Bill-to customer number. Defaults to sellToCustomerNo if omitted.",
          },
          externalDocumentNo: {
            type: "string",
            description: "Reference number. Auto-generated as CP-GFT-YYMMDD-HHMMSS-XXXX if omitted.",
          },
          requestedDeliveryDate: {
            type: "string",
            format: "date",
            description: "Requested delivery date (YYYY-MM-DD). Must not fall on a blocked date.",
            example: "2026-08-01",
          },
          promoCode: {
            type: "string",
            description: "Optional promo code scoped to item category GFT.",
            example: "GFT10PCT",
          },
          lines: {
            type: "array",
            minItems: 1,
            description: "Giftbox order lines. Each line is one giftbox product with its option selections.",
            items: { $ref: "#/components/schemas/GiftboxLine" },
          },
        },
      },
      CreateGiftboxOrderResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          submitted: {
            type: "object",
            properties: {
              externalDocumentNo: { type: "string", example: "CP-GFT-260801-143022-A1B2" },
              requestId: { type: "string", example: "a9cfb28c-5d31-4e90-a836-9c06c34a26e1" },
            },
          },
          order: {
            type: "object",
            properties: {
              orderNo: { type: "string", example: "SO-00123" },
              orderSystemId: { type: "string" },
              createdLineNos: { type: "string", example: "10000,20000" },
              responseJson: { type: "string" },
            },
          },
        },
      },
    },
  }
} as const





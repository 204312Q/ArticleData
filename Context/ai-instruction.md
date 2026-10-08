# Confinment Project - AI Assistant Instructions

## AI-Generated Code Conventions

- **Debugging & Collaboration**: When debugging runtime errors (especially 500 errors, database issues, or unexpected behavior), add strategic `console.log()` statements to trace execution flow and capture detailed error information. Then **explicitly ask the user to provide the console output** from their terminal or browser dev tools. User collaboration is essential for diagnosing issues that depend on runtime state, environment configuration, or external services (database, APIs, etc.). Do not assume the causeâ€”verify with actual logs.
- **Lint/Format Compliance**: Ensure all TypeScript aligns with repo ESLint rules (`eslint.config.mjs`) and Prettier formatting. Run or simulate `pnpm lint` (and `pnpm test` when relevant) before considering work complete.

- **Explicit Return Types**: Add explicit return types for every TypeScript function.
- **API Request Validation**: For all API routes, create a `schema.ts` file in the same directory as `route.ts` to define Zod validation schemas. Always validate request body using the following pattern:

  ```typescript
  // In schema.ts
  import { z } from 'zod';
  export const createSchema = z.object({
    field: z.string({ error: 'Field is required' }).min(1, 'Field is required'),
  });
  export type CreateInput = z.infer<typeof createSchema>;

  // In route.ts
  import { firstZodErrorMessage } from '@/lib/api-response';
  import { createSchema } from './schema';

  export async function POST(req: NextRequest): Promise<Response> {
    try {
      let body;
      try {
        body = await req.json();
      } catch {
        return failure('Request Param Invalid', 400);
      }

      const parsed = createSchema.safeParse(body);
      if (!parsed.success) {
        return failure(firstZodErrorMessage(parsed.error), 400);
      }

      const validatedData = parsed.data;
      // ... use validatedData
    } catch (error) {
      // ... error handling
    }
  }
  ```

  This pattern ensures consistent validation error messages and prevents JSON parsing errors from crashing the handler.

- **Request Guards (runRequestGuards)**: All BC-style protected APIs must integrate `runRequestGuards()` from `src/lib/guard/request-guard.ts` and be registered in `src/lib/guard/guard-manifest.ts`. Current standard guard stack is `useTimestamp`, `useNonce`, `useRateLimit`, `useApiKey`, and `useHmac`.
  - **Headers expected by standard stack**: `x-timestamp-ms`, `x-nonce` (22-char base64url for 16 random bytes), `x-api-key`, and `x-signature`.
  - **HMAC secrets**: `HMAC_SECRET_CURRENT` is required; `HMAC_SECRET_PREVIOUS` is optional for key rotation.
  - **Do not hardcode endpoint strings for guards** in route handlers; rely on `request.nextUrl.pathname` via `runRequestGuards(request)`.
  - **When adding a new API route**, always confirm with the user if it should use the full standard stack or a custom subset, then update `guard-manifest.ts` accordingly.
  - **Security classification policy for API routes**:
    - `customer` routes must call `requireCustomer()` for protected customer data/actions.
    - `admin` routes must call `requireAdminApiToken()`.
    - `s2s` routes (server-to-server, e.g. `/api/bc/**`) must call `runRequestGuards()` with the required guard profile.
    - `public` routes must not call customer/admin auth; if method is mutating (`POST`/`PUT`/`PATCH`/`DELETE`), they must apply rate limiting via `runRequestGuards()`.
  - **Default mapping**:
    - `/api/bc/**` => `s2s`
    - `/api/admin/**` => `admin`
    - `/api/customer/**` => `customer` unless explicitly designed as public endpoints.

- **API Responses**: For `app/api/**/route.ts`, return the standard helpers from `lib/api-response.ts` (`success` / `failure`) with shape `{ status, message, data }`.
- **API Error Handling**: Wrap route logic in `try/catch`. On catch, log **unexpected errors only** (not user errors like validation failures or `CredentialsSignin`) to Prisma error logs—`AdminErrorLog` for admin APIs (`/api/admin/**`), `UserErrorLog` for user APIs (`/api/user/**`). Include error details (`errorType`, `errorMessage`, `stackTrace`), request context (`requestPath`, `requestMethod`, `ipAddress`, `userAgent`), and authenticated user/admin ID when available. Use a nested `try/catch` to keep logging failures from crashing the handler.
- **Date Formatting**: Use utilities from `utils/format-time.ts` (built on dayjs) for consistent date formatting across all API responses. Common formats: `fDateTime()` for "DD MMM YYYY h:mm a", `fDate()` for "DD MMM YYYY", `fTime()` for "h:mm a". **Always format Date objects to strings before sending in API responses**—never send raw ISO strings or Date objects to clients.
- **Password Validation**: Use consistent password validation: minimum 8 characters via Zod `z.string().min(8, 'Password must be at least 8 characters')`.
- **Database Transaction Atomicity**: For any API route that performs **multiple related database operations**, you **MUST** wrap them in `prisma.$transaction()` for atomicity. This ensures all operations succeed together or fail together, preventing data inconsistencies.
  - **When to use**: Any route that creates/updates multiple related entities (e.g., customer + address, user + role assignments, order + line items)
  - **Pattern**: Always use `prisma.$transaction(async (tx) => { ... })` and pass the `tx` transaction client to all Prisma operations within the transaction scope
  - **Error handling**: If any operation within the transaction fails, all changes are automatically rolled back
  - **Examples**:

    ```typescript
    // ✅ Correct - Use transaction for related operations
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({ ... });
      const address = await tx.shipToAddress.create({
        data: { ... customerId: customer.id ... }
      });
      return { customer, address };
    });

    // ❌ Wrong - Separate operations without transaction
    const customer = await prisma.customer.create({ ... });
    const address = await prisma.shipToAddress.create({
      data: { ... customerId: customer.id ... }
    });
    // If address creation fails, customer is left orphaned
    ```

- **Env Sync**: Do not hand-edit `.env`. Pull from Vercel with `yarn run vercel env pull .env`. There is no `env.ts` schema to update.

### **Database Restrictions**

**CRITICAL**: AI assistants **MUST NEVER** execute the following actions:

1. **NEVER create Prisma migration files or folders** - Do not create files in `prisma/migrations/` directory
2. **NEVER run `yarn db:migrate`** - Migration creation and application must be done by the user
3. **NEVER run `yarn db:generate`** - Prisma client generation must be done by the user

**When making schema changes**:

- Only modify `prisma/schema.prisma`
- Inform the user that they need to manually run:
  ```bash
  yarn db:generate  # Generate Prisma client
  yarn db:migrate   # Create and apply migrations
  ```
- Do not attempt to execute these commands automatically

**Rationale**: Database migrations are destructive operations that can cause data loss. The user must review and approve all schema changes before applying them to the database.


## Microsoft Business Central Integration

This project includes a complete Microsoft Business Central (BC) integration system for synchronizing users as customers between Confinement and Business Central.

### **CRITICAL: Fire-and-Forget Pattern**

**BC operations must NEVER block or crash user-facing API endpoints.** All BC sync operations should be non-blocking (fire-and-forget) when called from user APIs.

#### **SOP: Calling BC Operations from API Routes**

**âœ… CORRECT - Fire-and-Forget Pattern (User APIs)**

```typescript
import { bcCustomerSyncService } from '@/lib/business-central/customer-sync';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // 1. Perform database operations first
    const customer = await prisma.customer.create({
      data: {
        /* ... */
      },
    });

    // 2. Trigger BC sync WITHOUT await (fire-and-forget)
    bcCustomerSyncService.syncCustomerToBC(customer.id).catch((error) => {
      console.error(`Failed to sync customer ${customer.id} to BC:`, error);
      // Error is already logged to bc_logs table by the sync function
    });

    // 3. Return success immediately - don't wait for BC
    return success({ customer }, 'Customer created successfully', 201);
  } catch (error) {
    // Only database/validation errors reach here, not BC errors
    return failure('Failed to create customer', 500);
  }
}
```

**âŒ WRONG - Blocking Pattern (Will crash API)**

```typescript
// DON'T DO THIS - BC errors will return 500 to users
export async function POST(req: NextRequest): Promise<Response> {
  const customer = await prisma.customer.create({
    /* ... */
  });

  // âŒ This will crash the API if BC sync fails
  await bcCustomerSyncService.syncCustomerToBC(customer.id);

  return success({ customer }, 'Customer created', 201);
}
```

#### **When to Use Fire-and-Forget vs Await**

| Context                                            | Pattern                          | Reason                          |
| -------------------------------------------------- | -------------------------------- | ------------------------------- |
| User-facing APIs (orders, profiles, etc.)          | **Fire-and-forget** (`.catch()`) | Don't block user operations     |
| Admin manual sync endpoints (`/api/admin/bc/sync`) | **Await**                        | Admin explicitly triggered sync |
| BC webhooks (`/api/webhooks/business-central`)     | **Await**                        | Need to confirm processing      |
| Batch sync jobs (cron, background)                 | **Await**                        | Need completion status          |

#### **Why BC Functions Throw Errors**

BC sync functions throw errors internally for proper logging and error chaining. The calling code must catch these errors:

```typescript
// Inside BC sync service - errors are thrown after logging
async syncCustomerToBC(customerId: string): Promise<void> {
  try {
    // BC operations...
  } catch (error) {
    // Log to bc_logs table
    await bcLogService.logOperationFailure(logEntry.id, { errorMessage: error.message });

    // Update local sync status
    await prisma.customer.update({
      where: { id: customerId },
      data: { syncStatus: 'error', syncError: error.message },
    });

    // Throw for caller to handle
    throw error;
  }
}

// In user API route - MUST catch to prevent 500 errors
bcCustomerSyncService.syncCustomerToBC(customerId).catch((error) => {
  console.error('BC sync failed:', error);
  // Error already logged to bc_logs, don't re-throw
});
```

### **Architecture Overview**

**IMPORTANT**: The BC integration is deliberately simplified to focus on **User â†” BC Customer synchronization only**. Do not add inventory, sales orders, or other entities without explicit requirements.

**Key Components:**

- **OAuth 2.0 Authentication** - Client credentials flow with MSAL
- **Two-way Synchronization** - Real-time webhooks (BC â†’ Peppercorn) + batch sync (Peppercorn â†’ BC)
- **Error Handling** - Comprehensive logging and retry mechanisms
- **Admin Control** - Manual sync triggers via API endpoints
- **Fire-and-Forget Pattern** - Non-blocking sync in user APIs

### **Implementation Patterns**

#### **1. Authentication Setup**

**Location**: `src/lib/business-central/auth.ts`

```typescript
// Use BCBaseService for all BC API interactions
export class YourService extends BCBaseService {
  async callBCAPI() {
    // Token management is automatic via interceptors
    const response = await this.axiosInstance.get(`${this.getCompanyAPIUrl()}/endpoint`);
    return this.parseODataResponse(response);
  }
}
```

**Environment Variables** (configured in `.env` from Vercel):

```typescript
BC_CLIENT_ID: z.string().min(1),
BC_CLIENT_SECRET: z.string().min(1),
BC_TENANT_ID: z.string().min(1),
BC_COMPANY_ID: z.string().min(1),
BC_API_VERSION: z.string().default('v2.0'),
BC_WEBHOOK_SECRET: z.string().min(1),
```

#### **2. User â†” Customer Synchronization**

**Location**: `src/lib/business-central/user-sync.ts`

**Pattern: Create/Update Customer in BC**

```typescript
// Always wrap in try/catch with proper error handling
try {
  // Check if user already exists in BC (by bcId or email)
  let bcCustomerId = user.bcId;
  if (!bcCustomerId) {
    existingBCCustomer = await this.findCustomerByEmailInBC(user.email);
    if (existingBCCustomer) {
      bcCustomerId = existingBCCustomer.id;
    }
  }

  // Create or update in BC
  if (bcCustomerId) {
    await this.updateCustomerInBC(bcCustomerId, userData);
  } else {
    bcCustomerId = await this.createCustomerFromUser(userData);
  }

  // Update user record with BC data and sync status
  await prisma.user.update({
    where: { id: userId },
    data: {
      bcId: bcCustomerId,
      syncStatus: 'synced',
      lastSyncAt: new Date(),
    },
  });
} catch (error) {
  // Always update user with sync error
  await prisma.user.update({
    where: { id: userId },
    data: {
      syncStatus: 'error',
      syncError: error instanceof Error ? error.message : 'Unknown error',
    },
  });
  throw error;
}
```

**Sync Status Values**: `pending`, `synced`, `error`, `deleted_in_bc`

#### **3. Webhook Processing**

**Location**: `src/app/api/webhooks/business-central/route.ts`

**Pattern: Handle BC Webhooks**

```typescript
/**
 * @openapi
 * /api/webhooks/business-central:
 *   post:
 *     tags: [Webhooks]
 *     summary: Handle Business Central webhooks
 *     security: []  # Public endpoint with HMAC verification
 */
export async function POST(req: NextRequest) {
  // 1. Verify HMAC signature
  const signature = req.headers.get('x-bc-signature');
  const expectedSignature = crypto
    .createHmac('sha256', env.BC_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return failure('Invalid signature', 400);
  }

  // 2. Parse and validate webhook data
  const webhookData = JSON.parse(body);
  if (!webhookData.type || !webhookData.action || !webhookData.entityId) {
    return failure('Invalid webhook data', 400);
  }

  // 3. Process based on entity type (customer only)
  switch (webhookData.type) {
    case 'customer':
      await bcUserSyncService.handleUserWebhook({
        action: webhookData.action,
        customerId: webhookData.entityId,
        customerNumber: webhookData.entityNumber || '',
      });
      break;
    default:
      return failure('Unknown webhook type', 400);
  }

  // 4. Log for audit
  await logWebhook(webhookData, req);
  return success(null, 'Webhook processed successfully', 200);
}
```

**Security**: Always verify HMAC signatures using `env.BC_WEBHOOK_SECRET`

#### **4. Batch Synchronization**

**Location**: `src/lib/business-central/batch-sync.ts`

**Pattern: Service-Based Sync**

```typescript
export class BCBatchSyncService {
  // Runs every 15 minutes automatically
  start(): void {
    /* ... */
  }

  // Manual trigger via admin API
  async triggerManualSync(options?: { users?: boolean }): Promise<void> {
    if (options?.users !== false) {
      results.users = await this.syncPendingUsers();
    }
  }

  // Sync pending/error users
  private async syncPendingUsers(): Promise<{ success: number; error: number }> {
    const pendingUsers = await prisma.user.findMany({
      where: {
        OR: [
          { syncStatus: 'pending' },
          { syncStatus: 'error' },
          { syncStatus: 'synced', lastSyncAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        ],
      },
      take: 10, // Limit batch size
    });

    for (const user of pendingUsers) {
      try {
        await bcUserSyncService.syncUserToBC(user.id);
        result.success++;
      } catch (error) {
        console.error(`Failed to sync user ${user.id}:`, error);
        result.error++;
      }
    }
    return result;
  }
}
```

**Best Practices**:

- Always limit batch sizes (10-50 items)
- Continue processing on individual failures
- Log comprehensive statistics
- Cleanup old webhook logs (>30 days)

#### **5. Database Schema Extensions**

**Location**: `prisma/schema.prisma`

**User Model Extensions** (already implemented):

```prisma
model User {
  // ... existing fields

  // Business Central Customer Fields
  bcId             String?    @unique @map("bc_id") @db.VarChar(50)
  number           String?    @map("number") @db.VarChar(20)
  displayName      String?    @map("display_name") @db.VarChar(100)
  phone            String?    @db.VarChar(30)
  website          String?    @db.VarChar(255)
  taxLiable        Boolean    @default(true) @map("tax_liable")
  taxRegistration  String?    @map("tax_registration") @db.VarChar(50)
  currencyCode     String?    @map("currency_code") @db.VarChar(10)
  paymentTermsId   String?    @map("payment_terms_id") @db.VarChar(50)
  paymentMethodId  String?    @map("payment_method_id") @db.VarChar(50)
  customerId       String?    @map("customer_id") @db.VarChar(50)
  salespersonCode  String?    @map("salesperson_code") @db.VarChar(20)
  shippingAgentCode String?   @map("shipping_agent_code") @db.VarChar(20)
  locationCode     String?    @map("location_code") @db.VarChar(10)
  blocked          String     @default(" ") @db.VarChar(1)
  lastModifiedDate DateTime?  @map("last_modified_date")
  syncStatus       String     @default("pending") @map("sync_status") @db.VarChar(20)
  syncError        String?    @map("sync_error") @db.Text
  lastSyncAt       DateTime?  @map("last_sync_at")

  // Indexes for performance
  @@unique([number], map: "users_number_key")
  @@index([bcId], map: "idx_users_bc_id")
  @@index([syncStatus], map: "idx_users_sync_status")
}

// Webhook audit logging
model WebhookLog {
  id             String   @id @default(uuid()) @db.Uuid
  entityType     String   @map("entity_type") @db.VarChar(50)
  entityAction   String   @map("entity_action") @db.VarChar(20)
  entityId       String   @map("entity_id") @db.VarChar(100)
  entityNumber   String?  @map("entity_number") @db.VarChar(50)
  status         String   @db.VarChar(20)  // success, error
  errorMessage   String?  @map("error_message") @db.Text
  requestBody    Json     @map("request_body")
  requestHeaders Json     @map("request_headers")
  ipAddress      String   @map("ip_address") @db.VarChar(45)
  userAgent      String   @map("user_agent")
  createdAt      DateTime @default(now()) @map("created_at")

  @@index([entityType, entityAction], map: "idx_webhook_logs_entity_type_action")
  @@index([status], map: "idx_webhook_logs_status")
  @@index([createdAt], map: "idx_webhook_logs_created_at")
  @@map("webhook_logs")
}
```

### **Critical Rules**

1. **Scope Limitation**: Only implement User â†” Customer synchronization unless explicitly requested
2. **Security First**: Always verify HMAC signatures for webhooks
3. **Error Boundaries**: Wrap all BC API calls in try/catch with proper error logging
4. **Sync Status**: Always update user records with current sync status and errors
5. **Batch Limits**: Never sync more than 50 items in a single batch
6. **Audit Logging**: Log all webhook requests and sync attempts for compliance
7. **Environment Safety**: Use the pre-configured BC environment variables from `process.env`.

### **Testing BC Integration**

1. **Mock BC Responses**: Use test helpers from `src/__tests__/helpers/` for unit tests
2. **Webhook Testing**: Test HMAC signature verification with `env.BC_WEBHOOK_SECRET`
3. **Integration Tests**: Test full sync flow with mock BC API responses
4. **Error Scenarios**: Test network failures, invalid tokens, malformed responses

### **Monitoring and Debugging**

1. **Console Logs**: Comprehensive logging throughout all BC services
2. **Database Logs**: WebhookLog table for audit trail
3. **Sync Statistics**: Automatic tracking in batch sync service
4. **Error Tracking**: UserErrorLog for sync failures with detailed context

When implementing BC features, always follow these established patterns rather than creating new approaches. The integration is designed to be secure, maintainable, and monitorable.

### **Business Central Documentation References**

**IMPORTANT**: For any Business Central related task, always refer to the comprehensive documentation in the `docs/business-central-*.md` files:

- **`docs/business-central-integration.md`** - Complete BC integration overview, architecture, configuration, API endpoints, synchronization logic, error handling, monitoring, deployment, and troubleshooting
- **`docs/business-central-logging.md`** - Mandatory logging requirements for ALL BC operations, including success/failure logging, performance tracking, data change tracking, error handling, monitoring, and compliance requirements

**Logging Requirements**: Every Business Central operation **must** use the `BCLogService` to log:

- Operation start and completion (success/failure)
- Performance metrics and API call counts
- Data changes and field-level tracking
- Error details with comprehensive information
- Correlation IDs for related operations
- Entity mapping between Peppercorn and BC

**When working on BC features**:

1. First consult `docs/business-central-integration.md` for architecture and implementation patterns
2. Then review `docs/business-central-logging.md` for mandatory logging requirements
3. Follow the established patterns from the documentation rather than creating new approaches
4. Ensure every BC operation is properly logged according to the logging requirements

The documentation provides complete reference implementations, best practices, and troubleshooting guidance for all BC-related development.



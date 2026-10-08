## Confinement Backend: Payment → Order Creation Flow

### Architecture Overview

**Data Flow:**
1. **Frontend initiates payment** via payment gateway
2. **Payment gateway returns result JWT**
3. **Frontend calls `/api/payments/confirm`** with payment credentials
4. **Backend stores payment transaction** in postgres `payment_transactions` table
5. **Frontend receives `transactionId`** + payment details
6. **Frontend calls `/api/bc/orders`** with order data + `paymentTransactionId`
7. **Backend creates order in BC** and links to payment in postgres `orders` table

---

### Database Schema

#### PaymentTransaction Table
```sql
payment_transactions {
  id: UUID (primary key)
  order_reference: VARCHAR (from payment gateway)
  transaction_id: VARCHAR (gateway-assigned)
  payment_status: VARCHAR (AUTHORIZED, DECLINED, PENDING, etc.)
  amount: VARCHAR
  currency: VARCHAR
  reconciliation_id: VARCHAR
  customer_email: VARCHAR
  gateway_response: JSONB (full gateway response)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### Orders Table (NEW)
```sql
orders {
  id: UUID (primary key)
  order_no: VARCHAR (BC order number, unique)
  external_document_no: VARCHAR (generated reference)
  customer_no: VARCHAR (BC customer)
  date_type: VARCHAR (EDD or Confirmed)
  order_source: VARCHAR (Website, Salesperson, etc.)
  payment_transaction_id: UUID FK (link to payment_transactions)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

**Relationship:** One payment can have one order (1:1 on payment_transaction_id)

---

### API Endpoints

#### 1. POST /api/payments/confirm (PUBLIC)

**Request:**
```json
{
  "orderReference": "CP-CFM-260619-143025-ABC1",
  "resultJwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "transientToken": "token_xyz_123456"
}
```

**Response (200 - AUTHORIZED):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "transactionId": "abc123def456",
  "orderReference": "CP-CFM-260619-143025-ABC1",
  "paymentStatus": "AUTHORIZED",
  "amount": "150.00",
  "currency": "USD",
  "reconciliationId": "recon123",
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "address1": "123 Main St",
    "city": "Springfield",
    "country": "US",
    "postalCode": "12345"
  },
  "shippingAddress": { ... },
  "card": { ... },
  "submitTimeUtc": "2026-06-19T14:30:25Z"
}
```

**Response (402 - DECLINED):**
```json
{
  "success": false,
  "message": "Payment declined - insufficient funds",
  "errorReason": "INSUFFICIENT_FUNDS"
}
```

---

#### 2. POST /api/bc/orders (S2S)

**Request:**
```json
{
  "sellToCustomerNo": "C000166",
  "paymentTransactionId": "abc123def456",
  "dateType": "Confirmed",
  "confirmedStartDate": "2026-06-25",
  "orderSource": "Website",
  "orderLines": [
    {
      "no": "CFM-PCP-003",
      "quantity": 1,
      "portion": "Dual",
      "session": "LunchAndDinner",
      "firstMealSession": "Dinner",
      "specialRequestPresetCodes": ["EXC_SALMON", "EXC_PEAS"]
    }
  ]
}
```

**Response (201 - CREATED):**
```json
{
  "success": true,
  "source": "created_new",
  "submitted": {
    "externalDocumentNo": "CP-CFM-260619-143025-XYZ2",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "order": {
    "orderNo": "SO26-030007",
    "orderSystemId": "123e4567-e89b-12d3-a456-426614174000",
    "createdLineNos": "10000",
    "responseJson": "{...}"
  }
}
```

---

### Frontend Integration Example

```typescript
// Step 1: Payment confirmation
const paymentResponse = await fetch('/api/payments/confirm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderReference: paymentResult.orderReference,
    resultJwt: paymentResult.resultJwt,
    transientToken: paymentResult.transientToken
  })
})

if (!paymentResponse.ok) {
  throw new Error('Payment confirmation failed')
}

const payment = await paymentResponse.json()
// payment.transactionId is ready to use

// Step 2: Create order (link to payment)
const orderResponse = await fetch('/api/bc/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sellToCustomerNo: customer.id,
    paymentTransactionId: payment.transactionId, // Link payment!
    dateType: 'Confirmed',
    confirmedStartDate: '2026-06-25',
    orderSource: 'Website',
    orderLines: [
      {
        no: 'CFM-PCP-003',
        quantity: 1,
        portion: 'Dual',
        session: 'LunchAndDinner',
        firstMealSession: 'Dinner',
        specialRequestPresetCodes: ['EXC_SALMON']
      }
    ]
  })
})

const order = await orderResponse.json()
console.log('Order created:', order.order.orderNo)
console.log('Payment linked to order via:', payment.transactionId)
```

---

### Swagger Documentation

Both endpoints are fully documented in the OpenAPI schema at `/api/docs`:
- **GET** `/api/docs` - Swagger UI
- Payment endpoint: Tagged as "Payments"
- Order endpoint: Tagged as "Orders" (updated description mentions payment integration)
- Complete request/response examples shown

---

### What Frontend Needs to Know

**Frontend MUST know:**
1. Call `/api/payments/confirm` first, get `transactionId`
2. Pass `paymentTransactionId: transactionId` to `/api/bc/orders`
3. Expected response schemas for both endpoints

**Frontend does NOT need to know:**
- Internal field transformation (toPayload function)
- Postgres table structure
- BC field names
- How payment data flows internally

---

### What Gets Stored Where

| Data | Storage | Purpose |
|------|---------|---------|
| transactionId, paymentStatus, amount, currency, reconciliationId, gateway response | `payment_transactions` (Postgres) | Backend-only payment tracking. NOT sent to BC. |
| orderNo, customerNo, dateType, orderSource | `orders` (Postgres) + BC | Order tracking. Linked to payment via FK. |
| payment_transaction_id | `orders` (Postgres) | Foreign key linking order to payment. |

---

### Migration Steps

1. ✅ Prisma schema updated (paymentTransactionId FK added)
2. ✅ Migration SQL created: `20260619_add_orders_table`
3. ✅ Order creation route updated to save to DB + link payment
4. ✅ Payment confirm response properly documented
5. ⏳ Run migration: `npx prisma migrate deploy` (when Prisma CLI works)
6. ⏳ Regenerate Prisma client: `npx prisma generate` (when Prisma CLI works)

**Current blockers:**
- Prisma CLI has ESM/CJS conflict on this machine
- Migration files created manually instead
- Once DB migration runs, everything will work automatically

---

### Testing

**Happy path (payment authorized, order created):**
```bash
# 1. Confirm payment
curl -X POST http://localhost:3000/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "orderReference": "CP-CFM-260619-143025-ABC1",
    "resultJwt": "...",
    "transientToken": "..."
  }'
# Returns: { transactionId: "abc123..." }

# 2. Create order with payment link
curl -X POST http://localhost:3000/api/bc/orders \
  -H "Content-Type: application/json" \
  -d '{
    "sellToCustomerNo": "C000166",
    "paymentTransactionId": "abc123...",
    "dateType": "Confirmed",
    "confirmedStartDate": "2026-06-25",
    "orderSource": "Website",
    "orderLines": [...]
  }'
# Returns: { orderNo: "SO26-030007" }

# 3. Verify in DB
# SELECT * FROM orders WHERE payment_transaction_id = 'abc123...';
# SELECT * FROM payment_transactions WHERE transaction_id = 'abc123...';
```

---

### Notes

- Payment data is **never** sent to BC. BC only gets order data.
- Payment transaction ID is stored in postgres for backend reconciliation/reporting.
- Order can exist without payment (paymentTransactionId is nullable) for manual/salesperson orders.
- Payment can exist without order if order creation fails after payment succeeds.
- Both tables have proper indexes for performance.

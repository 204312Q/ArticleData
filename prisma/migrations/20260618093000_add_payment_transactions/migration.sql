-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" UUID NOT NULL,
    "order_reference" VARCHAR(100) NOT NULL,
    "transaction_id" VARCHAR(100) NOT NULL,
    "payment_status" VARCHAR(50) NOT NULL,
    "amount" VARCHAR(32),
    "currency" VARCHAR(10),
    "reconciliation_id" VARCHAR(100),
    "customer_email" VARCHAR(255),
    "gateway_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_order_reference_key" ON "payment_transactions"("order_reference");

-- CreateIndex
CREATE INDEX "idx_payment_transactions_transaction_id" ON "payment_transactions"("transaction_id");

-- CreateIndex
CREATE INDEX "idx_payment_transactions_payment_status" ON "payment_transactions"("payment_status");

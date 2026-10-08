-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "order_no" VARCHAR(100) NOT NULL,
    "external_document_no" VARCHAR(100) NOT NULL,
    "customer_no" VARCHAR(100) NOT NULL,
    "date_type" VARCHAR(20) NOT NULL,
    "order_source" VARCHAR(50),
    "payment_transaction_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_no_key" ON "orders"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "orders_payment_transaction_id_key" ON "orders"("payment_transaction_id");

-- CreateIndex
CREATE INDEX "idx_orders_customer_no" ON "orders"("customer_no");

-- CreateIndex
CREATE INDEX "idx_orders_order_no" ON "orders"("order_no");

-- CreateIndex
CREATE INDEX "idx_orders_date_type" ON "orders"("date_type");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_transaction_id_fkey" FOREIGN KEY ("payment_transaction_id") REFERENCES "payment_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

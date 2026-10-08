-- CreateTable
CREATE TABLE "api_attempts" (
    "id" UUID NOT NULL,
    "endpoint" VARCHAR(255) NOT NULL,
    "method" VARCHAR(10) NOT NULL,
    "email" VARCHAR(255),
    "ip_address" VARCHAR(45) NOT NULL,
    "user_agent" VARCHAR(255),
    "success" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_request_nonces" (
    "id" UUID NOT NULL,
    "endpoint" VARCHAR(255) NOT NULL,
    "nonce" VARCHAR(128) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_request_nonces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_api_attempts_endpoint" ON "api_attempts"("endpoint");

-- CreateIndex
CREATE INDEX "idx_api_attempts_endpoint_ip" ON "api_attempts"("endpoint", "ip_address");

-- CreateIndex
CREATE INDEX "idx_api_attempts_endpoint_created_at" ON "api_attempts"("endpoint", "created_at");

-- CreateIndex
CREATE INDEX "idx_api_attempts_ip_created_at" ON "api_attempts"("ip_address", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_api_request_nonces_endpoint_nonce" ON "api_request_nonces"("endpoint", "nonce");

-- CreateIndex
CREATE INDEX "idx_api_request_nonces_expires_at" ON "api_request_nonces"("expires_at");

-- CreateIndex
CREATE INDEX "idx_api_request_nonces_endpoint_created_at" ON "api_request_nonces"("endpoint", "created_at");

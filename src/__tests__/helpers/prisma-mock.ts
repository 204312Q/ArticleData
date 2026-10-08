import { vi } from "vitest";

export type PrismaMock = {
  apiAttempt: {
    create: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
  };
  apiRequestNonce: {
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

export function createPrismaMock(): PrismaMock {
  return {
    apiAttempt: {
      create: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    apiRequestNonce: {
      create: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(async (operation: unknown) => {
      if (typeof operation === "function") {
        return (operation as (tx: unknown) => unknown)({});
      }
      return operation;
    }),
  };
}

export function resetPrismaMock(): void {
  vi.clearAllMocks();
}

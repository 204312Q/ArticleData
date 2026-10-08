import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(rootDir, "src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.test.ts"],
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
  },
});

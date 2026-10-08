import { vi, afterEach, beforeAll } from "vitest";

beforeAll(() => {
  process.env.TZ = "UTC";
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});


import { defineConfig } from "vitest/config";

// Unit tests sit next to the code they test; Playwright owns e2e/.
export default defineConfig({
  test: { include: ["src/**/*.test.ts"] },
});

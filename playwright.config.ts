import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);
// `pnpm serve` runs the built site (`pnpm build` first) on Cloudflare's own runtime, so redirects,
// headers, the 404 page and Pages Functions behave exactly as they will when deployed.
const baseURL = "http://localhost:8788";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm serve",
    url: baseURL,
    reuseExistingServer: !isCI,
  },
});

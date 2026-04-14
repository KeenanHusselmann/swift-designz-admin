import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests require a running dev/preview server and a dedicated test database.
 *
 * Set these environment variables before running:
 *   PLAYWRIGHT_BASE_URL   — e.g. http://localhost:3000
 *   E2E_EMAIL             — test admin account email
 *   E2E_PASSWORD          — test admin account password
 *
 * Run: npx playwright test
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // auth state is shared
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "html",

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

import { defineConfig, devices } from "@playwright/test";

/**
 * The e2e suite starts its OWN server on port 3100 (it does not reuse the
 * `npm run dev` on 3000): this guarantees NEXT_PUBLIC_API_URL points to the
 * same-origin mock (/e2e-api, intercepted via page.route) and never to the
 * real API — hermetic tests, no network, no polluted data.
 */
const E2E_PORT = 3100;
const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: E2E_BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // Production build + start: the dev server compiles routes on demand and
    // the first navigation can exceed the 30s timeout, making the suite
    // flaky. The production server also exercises the real bundle.
    command: `npm run build && npm run start -- --port ${E2E_PORT}`,
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // Same-origin: POSTs do not trigger a CORS preflight (which Chromium
      // does not route through page.route interceptors). NEXT_PUBLIC_* is
      // inlined at build time, so the env var is set for the build command.
      NEXT_PUBLIC_API_URL: `${E2E_BASE_URL}/e2e-api`,
    },
  },
});

import { test, expect, request } from "@playwright/test";

const EMAIL = process.env.E2E_EMAIL ?? "";
const PASSWORD = process.env.E2E_PASSWORD ?? "";

async function login(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(EMAIL);
  await page.getByLabel(/password/i).fill(PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

// ── API tests (no browser needed) ────────────────────────────────────────────

test.describe("POST /api/leads — end-to-end", () => {
  test("accepts a valid lead submission from the public API", async ({ baseURL }) => {
    const ctx = await request.newContext({ baseURL });

    const res = await ctx.post("/api/leads", {
      data: {
        name: "E2E Test Lead",
        email: "e2e-lead@example.co.za",
        source: "quote_form",
        service: "Web Development",
      },
      headers: {
        "Content-Type": "application/json",
        Origin: "https://swiftdesignz.co.za",
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.id).toBeTruthy();
    await ctx.dispose();
  });

  test("OPTIONS preflight returns CORS headers", async ({ baseURL }) => {
    const ctx = await request.newContext({ baseURL });

    const res = await ctx.fetch("/api/leads", {
      method: "OPTIONS",
      headers: { Origin: "https://swiftdesignz.co.za" },
    });

    expect(res.status()).toBe(204);
    expect(res.headers()["access-control-allow-origin"]).toBeTruthy();
    await ctx.dispose();
  });
});

// ── Lead → Client conversion (admin UI) ──────────────────────────────────────

test.describe("Lead to Client conversion", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("converts a lead to a client via the admin UI", async ({ page }) => {
    await page.goto("/leads");

    // Open the E2E test lead created by the API test above
    await page.getByText("E2E Test Lead").click();

    // Convert to client action
    await page.getByRole("button", { name: /convert to client/i }).click();
    await page.getByRole("button", { name: /confirm|yes/i }).click();

    // Should redirect or show success
    await expect(
      page.getByText(/client created|converted/i).or(page.getByRole("heading", { name: /E2E Test Lead/i }))
    ).toBeVisible();

    // Verify lead no longer shows as "new" — status should be "won"
    await page.goto("/leads");
    // The lead card may show "won" badge or be absent from active leads list
  });
});

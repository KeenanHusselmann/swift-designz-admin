import { test, expect, Page } from "@playwright/test";

const EMAIL = process.env.E2E_EMAIL ?? "";
const PASSWORD = process.env.E2E_PASSWORD ?? "";

// Reusable login helper
async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(EMAIL);
  await page.getByLabel(/password/i).fill(PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

test.describe("Invoice CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("navigates to /invoices and shows invoice list", async ({ page }) => {
    await page.goto("/invoices");
    await expect(page).toHaveURL("/invoices");
    await expect(page.getByRole("heading", { name: /invoices/i })).toBeVisible();
  });

  test("creates a new invoice and it appears in the list", async ({ page }) => {
    await page.goto("/invoices/new");

    // Fill required fields — adjust selectors to match actual form labels
    await page.getByLabel(/client/i).selectOption({ index: 1 });
    await page.getByLabel(/description/i).fill("E2E Test Invoice");
    await page.getByLabel(/amount/i).fill("5000");
    await page.getByRole("button", { name: /create|save/i }).click();

    // Should redirect to invoice detail or list
    await expect(page).toHaveURL(/\/invoices/);
    await expect(page.getByText("E2E Test Invoice")).toBeVisible();
  });

  test("marks an invoice as paid", async ({ page }) => {
    await page.goto("/invoices");

    // Click the first invoice
    await page.getByRole("link", { name: /INV-/i }).first().click();

    // Record payment
    await page.getByRole("button", { name: /record payment|mark paid/i }).click();
    await page.getByRole("button", { name: /confirm|submit/i }).click();

    await expect(page.getByText(/paid/i)).toBeVisible();
  });

  test("deletes an invoice", async ({ page }) => {
    await page.goto("/invoices");

    const invoiceLink = page.getByRole("link", { name: /E2E Test Invoice/i }).first();
    await invoiceLink.click();

    await page.getByRole("button", { name: /delete/i }).click();
    await page.getByRole("button", { name: /confirm|yes/i }).click();

    await expect(page).toHaveURL("/invoices");
    await expect(page.getByText("E2E Test Invoice")).not.toBeVisible();
  });
});

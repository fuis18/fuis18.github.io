import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("1. Cambiar de light a dark", async ({ page }) => {
    const html = page.locator("html");
    const toggle = page.locator("#theme-toggle");

    await expect(html).toHaveClass(/light/);

    await toggle.click();

    await expect(html).toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/light/);
  });

  test("2. Cambiar de dark a light", async ({ page }) => {
    const html = page.locator("html");
    const toggle = page.locator("#theme-toggle");

    await toggle.click();
    await expect(html).toHaveClass(/dark/);

    await toggle.click();
    await expect(html).toHaveClass(/light/);
    await expect(html).not.toHaveClass(/dark/);
  });

  test("3. Persistencia del tema entre páginas", async ({ page }) => {
    const html = page.locator("html");
    const toggle = page.locator("#theme-toggle");

    await toggle.click();
    await expect(html).toHaveClass(/dark/);

    await page.click('a[href="/projects"]');
    await page.waitForURL("**/projects");

    await expect(html).toHaveClass(/dark/);
  });
});

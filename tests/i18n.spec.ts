import { test, expect } from "@playwright/test";

test.describe("Language switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("1. Click en selector y cambiar a ES", async ({ page }) => {
    const select = page.locator("#lang-select");
    await expect(select).toBeVisible();

    await select.selectOption("es");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(select).toHaveValue("es");

    const esContent = page.locator('[data-lang="es"]').first();
    await expect(esContent).toBeVisible();

    const enContent = page.locator('[data-lang="en"]').first();
    await expect(enContent).toBeHidden();
  });

  test("2. Cambiar de ES a EN", async ({ page }) => {
    const select = page.locator("#lang-select");

    await select.selectOption("es");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await select.selectOption("en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(select).toHaveValue("en");

    const enContent = page.locator('[data-lang="en"]').first();
    await expect(enContent).toBeVisible();

    const esContent = page.locator('[data-lang="es"]').first();
    await expect(esContent).toBeHidden();
  });

  test("3. Persistencia entre páginas", async ({ page }) => {
    const select = page.locator("#lang-select");

    await select.selectOption("es");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.click('a[href="/projects"]');
    await page.waitForURL("**/projects");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(select).toHaveValue("es");
  });
});

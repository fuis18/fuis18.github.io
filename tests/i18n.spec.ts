import { test, expect } from "@playwright/test";

test.describe("Language switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  const optionEs = (page: import("@playwright/test").Page) =>
    page.locator('#lang-menu [role="option"][data-value="es"]');
  const optionEn = (page: import("@playwright/test").Page) =>
    page.locator('#lang-menu [role="option"][data-value="en"]');

  test("1. Click en selector y cambiar a ES", async ({ page }) => {
    const triggerValue = page.locator("#lang-value");
    await expect(page.locator("#lang-trigger")).toBeVisible();

    await page.click("#lang-trigger");
    await optionEs(page).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(triggerValue).toHaveText("ES");
    await expect(optionEs(page)).toHaveAttribute("aria-selected", "true");

    const esContent = page.locator('[data-lang="es"]').first();
    await expect(esContent).toBeVisible();

    const enContent = page.locator('[data-lang="en"]').first();
    await expect(enContent).toBeHidden();
  });

  test("2. Cambiar de ES a EN", async ({ page }) => {
    const triggerValue = page.locator("#lang-value");

    await page.click("#lang-trigger");
    await optionEs(page).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.click("#lang-trigger");
    await optionEn(page).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(triggerValue).toHaveText("EN");
    await expect(optionEn(page)).toHaveAttribute("aria-selected", "true");

    const enContent = page.locator('[data-lang="en"]').first();
    await expect(enContent).toBeVisible();

    const esContent = page.locator('[data-lang="es"]').first();
    await expect(esContent).toBeHidden();
  });

  test("3. Persistencia entre páginas", async ({ page }) => {
    const triggerValue = page.locator("#lang-value");

    await page.click("#lang-trigger");
    await optionEs(page).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.click('a[href="/projects"]');
    await page.waitForURL("**/projects");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(triggerValue).toHaveText("ES");
  });
});

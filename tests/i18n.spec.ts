import { test, expect, type Page } from "@playwright/test";

const option = (page: Page, value: string) =>
  page.locator(`#lang-menu [role="option"][data-value="${value}"]`);

async function switchTo(page: Page, value: string) {
  await page.click("#lang-trigger");
  await option(page, value).click();
}

test.describe("Language switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("1. El DOM solo contiene el idioma activo (sin data-lang ni nodos ocultos)", async ({
    page,
  }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("[data-lang]")).toHaveCount(0);

    // Nav en inglés, sin versiones duplicadas en otros idiomas
    await expect(page.locator("nav a", { hasText: "Home" })).toHaveCount(1);
    await expect(page.locator("nav a", { hasText: "Inicio" })).toHaveCount(0);

    // Contenido visible en inglés
    await expect(page.locator("[data-i18n='role']")).toHaveText(
      "DevOps Engineer",
    );
    await expect(page.locator("[data-i18n='role']")).toBeVisible();
  });

  test("2. Cambiar a ES traduce todo el contenido visible", async ({
    page,
  }) => {
    await switchTo(page, "es");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("#lang-value")).toHaveText("ES");
    await expect(option(page, "es")).toHaveAttribute("aria-selected", "true");

    await expect(page.locator("nav a", { hasText: "Inicio" })).toHaveCount(1);
    await expect(page.locator("nav a", { hasText: "Home" })).toHaveCount(0);
    await expect(page.locator("[data-i18n='role']")).toHaveText(
      "Ingeniero DevOps",
    );
    await expect(page.locator("[data-i18n='about-title']")).toHaveText(
      "¿Quién Soy?",
    );

    // Nunca hay nodos duplicados ocultos
    await expect(page.locator("[data-lang]")).toHaveCount(0);
  });

  test("3. Persistencia entre páginas", async ({ page }) => {
    await switchTo(page, "es");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.click('a[href="/projects"]');
    await page.waitForURL("**/projects");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("#lang-value")).toHaveText("ES");
    await expect(page.locator("[data-i18n='projects-title']")).toHaveText(
      "Proyectos",
    );
    await expect(page.locator("[data-lang]")).toHaveCount(0);

    // Las tarjetas re-renderizan al idioma activo
    const firstCard = page
      .locator("[data-project-index='0']")
      .locator("[data-project-field='title']");
    await expect(firstCard).toHaveText("Mi portafolio web");
  });

  test("4. El selector muestra las 4 opciones (incluyendo JA)", async ({
    page,
  }) => {
    await page.click("#lang-trigger");
    for (const value of ["en", "es", "ja", "de"]) {
      await expect(option(page, value)).toBeVisible();
      await expect(option(page, value)).toHaveText(value.toUpperCase());
    }
  });
});

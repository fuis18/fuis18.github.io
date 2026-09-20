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

    // Tras la animación de entrada el DOM queda limpio (sin spans)
    await expect(page.locator(".textfx-char")).toHaveCount(0);
    await expect(page.locator(".textfx-line")).toHaveCount(0);
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

    // Tras la animación del cambio de idioma el DOM queda limpio
    await expect(page.locator(".textfx-char")).toHaveCount(0);
    await expect(page.locator(".textfx-line")).toHaveCount(0);
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

    // Tras la navegación, la construcción de entrada deja el DOM limpio
    await expect(page.locator(".textfx-char")).toHaveCount(0);
    await expect(page.locator(".textfx-line")).toHaveCount(0);
  });

  test("4. Cambiar a JA traduce toda la portada", async ({ page }) => {
    await switchTo(page, "ja");

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.locator("#lang-value")).toHaveText("JA");
    await expect(option(page, "ja")).toHaveAttribute("aria-selected", "true");

    await expect(page.locator("nav a", { hasText: "ホーム" })).toHaveCount(1);
    await expect(page.locator("nav a", { hasText: "Home" })).toHaveCount(0);
    await expect(page.locator("[data-i18n='role']")).toHaveText(
      "DevOps エンジニア",
    );
    await expect(page.locator("[data-i18n='about-title']")).toHaveText(
      "私について",
    );

    // Nunca hay nodos duplicados ocultos
    await expect(page.locator("[data-lang]")).toHaveCount(0);

    // Tras la animación del cambio de idioma el DOM queda limpio
    await expect(page.locator(".textfx-char")).toHaveCount(0);
    await expect(page.locator(".textfx-line")).toHaveCount(0);
  });

  test("5. Cambiar a DE traduce toda la portada", async ({ page }) => {
    await switchTo(page, "de");

    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.locator("#lang-value")).toHaveText("DE");
    await expect(option(page, "de")).toHaveAttribute("aria-selected", "true");

    await expect(page.locator("nav a", { hasText: "Start" })).toHaveCount(1);
    await expect(page.locator("nav a", { hasText: "Home" })).toHaveCount(0);
    await expect(page.locator("[data-i18n='role']")).toHaveText(
      "DevOps-Ingenieur",
    );
    await expect(page.locator("[data-i18n='about-title']")).toHaveText(
      "Über mich",
    );

    // Nunca hay nodos duplicados ocultos
    await expect(page.locator("[data-lang]")).toHaveCount(0);

    // Tras la animación del cambio de idioma el DOM queda limpio
    await expect(page.locator(".textfx-char")).toHaveCount(0);
    await expect(page.locator(".textfx-line")).toHaveCount(0);
  });

  test("6. El selector muestra las 4 opciones (incluyendo JA)", async ({
    page,
  }) => {
    await page.click("#lang-trigger");
    for (const value of ["en", "es", "ja", "de"]) {
      await expect(option(page, value)).toBeVisible();
      await expect(option(page, value)).toHaveText(value.toUpperCase());
    }
  });

  test("7. En /projects, cambiar a JA traduce las tarjetas", async ({
    page,
  }) => {
    await page.goto("/projects");
    await switchTo(page, "ja");

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.locator("#lang-value")).toHaveText("JA");
    await expect(page.locator("[data-i18n='projects-title']")).toHaveText(
      "プロジェクト",
    );

    const card0 = page.locator("[data-project-index='0']");
    await expect(card0.locator("[data-project-field='title']")).toHaveText(
      "私の Web ポートフォリオ",
    );
    await expect(card0.locator("[data-project-field='date']")).toHaveText(
      "2026年9月",
    );
    const card8 = page.locator("[data-project-index='8']");
    await expect(card8.locator("[data-project-field='title']")).toHaveText(
      "すべてのプロジェクト",
    );

    // Nunca hay nodos duplicados ocultos
    await expect(page.locator("[data-lang]")).toHaveCount(0);

    // Tras la animación del cambio de idioma el DOM queda limpio
    await expect(page.locator(".textfx-char")).toHaveCount(0);
    await expect(page.locator(".textfx-line")).toHaveCount(0);
  });

  test("8. En /projects, cambiar a DE traduce las tarjetas", async ({
    page,
  }) => {
    await page.goto("/projects");
    await switchTo(page, "de");

    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.locator("#lang-value")).toHaveText("DE");
    await expect(page.locator("[data-i18n='projects-title']")).toHaveText(
      "Projekte",
    );

    const card0 = page.locator("[data-project-index='0']");
    await expect(card0.locator("[data-project-field='title']")).toHaveText(
      "Mein Web-Portfolio",
    );
    await expect(card0.locator("[data-project-field='date']")).toHaveText(
      "SEP 2026",
    );
    const card8 = page.locator("[data-project-index='8']");
    await expect(card8.locator("[data-project-field='title']")).toHaveText(
      "Alle Projekte",
    );

    // Nunca hay nodos duplicados ocultos
    await expect(page.locator("[data-lang]")).toHaveCount(0);

    // Tras la animación del cambio de idioma el DOM queda limpio
    await expect(page.locator(".textfx-char")).toHaveCount(0);
    await expect(page.locator(".textfx-line")).toHaveCount(0);
  });
});

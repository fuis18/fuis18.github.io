import { test, expect, type Page } from "@playwright/test";

async function footerMaxWidth(page: Page): Promise<string> {
  return page.evaluate(
    () => getComputedStyle(document.querySelector("footer")!).maxWidth,
  );
}

async function mainMaxWidth(page: Page): Promise<string> {
  return page.evaluate(
    () => getComputedStyle(document.querySelector("main")!).maxWidth,
  );
}

async function mainBox(page: Page): Promise<{ x: number; width: number }> {
  const box = await page.locator("main").boundingBox();
  return { x: Math.round(box!.x), width: Math.round(box!.width) };
}

async function navigateTo(page: Page, href: string) {
  await page.click(`a[href="${href}"]`);
  await page.waitForURL(`**${href}`);
  await page.waitForFunction((path) => location.pathname === path, href);
}

test.describe("Shell width", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("1. La home usa la variante corta (sin clase en <html>)", async ({
    page,
  }) => {
    await expect(page.locator("html")).not.toHaveClass(/shell-/);

    expect(await footerMaxWidth(page)).toBe("1024px");
    expect(await mainMaxWidth(page)).toBe("1024px");
    expect((await mainBox(page)).x).toBeGreaterThan(0);
  });

  test("2. Projects usa la variante ancha", async ({ page }) => {
    await navigateTo(page, "/projects");

    await expect(page.locator("html")).toHaveClass(/shell-large/);

    expect(await footerMaxWidth(page)).toBe("none");
    expect(await mainMaxWidth(page)).not.toBe("1024px");
  });

  test("3. La variante se mantiene al volver con el ClientRouter", async ({
    page,
  }) => {
    await navigateTo(page, "/projects");
    expect(await footerMaxWidth(page)).toBe("none");

    await page.click("a[href='/']");
    await page.waitForFunction(() => location.pathname === "/");

    await expect(page.locator("html")).not.toHaveClass(/shell-large/);
    expect(await footerMaxWidth(page)).toBe("1024px");
  });
});

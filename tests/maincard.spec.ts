import { test, expect, type Page } from "@playwright/test";

async function linkColumns(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      getComputedStyle(document.querySelector(".card__links")!)
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length,
  );
}

async function evenLinkBorderLeft(page: Page): Promise<string> {
  return page.evaluate(
    () =>
      getComputedStyle(document.querySelectorAll(".card__links li")[1]!)
        .borderLeftWidth,
  );
}

async function cardContentPadding(page: Page): Promise<string> {
  return page.evaluate(
    () => getComputedStyle(document.querySelector(".card-content")!).padding,
  );
}

async function penultimateLinkBorderBottom(page: Page): Promise<string> {
  return page.evaluate(
    () =>
      getComputedStyle(document.querySelectorAll(".card__links li")[4]!)
        .borderBottomWidth,
  );
}

async function linkTopRightRadius(page: Page, index: number): Promise<string> {
  return page.evaluate(
    (i) =>
      getComputedStyle(document.querySelectorAll(".card__links li")[i]!)
        .borderTopRightRadius,
    index,
  );
}

async function graphSize(page: Page): Promise<{
  width: number;
  height: number;
}> {
  const box = await page.locator(".skill-graph").boundingBox();
  return { width: box!.width, height: box!.height };
}

const langOption = (page: Page, value: string) =>
  page.locator(`#lang-menu [role="option"][data-value="${value}"]`);

async function switchTo(page: Page, value: string) {
  await page.click("#lang-trigger");
  await langOption(page, value).click();
}

async function openGraph(page: Page) {
  const graphBtn = page.getByRole("button", { name: "Graph mode" });
  await graphBtn.click();
  await expect(page.locator("#network canvas")).toBeVisible();
  await page.waitForFunction(() =>
    Boolean(
      (
        window as Window & {
          __fuisNetworkStabilized?: unknown;
        }
      ).__fuisNetworkStabilized,
    ),
  );
  await page.locator("#network canvas").waitFor({ state: "visible" });
}

async function clickNode(page: Page, id: string) {
  const { x, y } = await page.evaluate((nodeId) => {
    const network = (
      window as Window & {
        __fuisNetwork?: {
          getPositions: (
            ids: string[],
          ) => Record<string, { x: number; y: number }>;
          canvasToDOM: (pos: { x: number; y: number }) => {
            x: number;
            y: number;
          };
        };
      }
    ).__fuisNetwork!;
    const pos = network.getPositions([nodeId])[nodeId];
    return network.canvasToDOM(pos);
  }, id);
  const canvasBox = await page.locator("#network canvas").boundingBox();
  await page.mouse.click(canvasBox!.x + x, canvasBox!.y + y);
}

async function modesPosition(page: Page): Promise<string> {
  return page.evaluate(
    () => getComputedStyle(document.querySelector(".card__modes")!).position,
  );
}

test.describe("MainCard modes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("1. Por defecto se muestra el about y los botones", async ({ page }) => {
    const about = page.locator(".card__content-text");
    const network = page.locator("#network");
    const listBtn = page.getByRole("button", { name: "List mode" });
    const graphBtn = page.getByRole("button", { name: "Graph mode" });

    await expect(about).toBeVisible();
    await expect(network).toBeHidden();
    await expect(listBtn).toHaveAttribute("aria-pressed", "true");
    await expect(graphBtn).toHaveAttribute("aria-pressed", "false");
    await expect(listBtn).toHaveClass(/is-active/);
    expect(await linkColumns(page)).toBe(2);
    expect(await evenLinkBorderLeft(page)).not.toBe("0px");
    expect(await cardContentPadding(page)).toBe("32px");
    expect(await linkTopRightRadius(page, 0)).toBe("0px");
    expect(await linkTopRightRadius(page, 1)).not.toBe("0px");
    expect(await modesPosition(page)).toBe("static");
  });

  test("2. Cambiar a modo grafo muestra el canvas y oculta el texto", async ({
    page,
  }) => {
    const graphBtn = page.getByRole("button", { name: "Graph mode" });
    const about = page.locator(".card__content-text");
    const network = page.locator("#network");

    await graphBtn.click();

    await expect(network).toBeVisible();
    await expect(page.locator("#network canvas")).toBeVisible();
    await expect(about).toBeHidden();
    await expect(graphBtn).toHaveAttribute("aria-pressed", "true");
    await expect(graphBtn).toHaveClass(/is-active/);
    expect(await linkColumns(page)).toBe(1);
    expect(await evenLinkBorderLeft(page)).toBe("0px");
    expect(await cardContentPadding(page)).toBe("0px");
    expect(await penultimateLinkBorderBottom(page)).toBe("1px");
    expect(await linkTopRightRadius(page, 0)).not.toBe("0px");
    expect(await linkTopRightRadius(page, 1)).toBe("0px");
    const fullSize = await graphSize(page);
    expect(Math.round(fullSize.height)).toBe(460);
    expect(await modesPosition(page)).toBe("absolute");
  });

  test("3. Volver a modo about restaura el texto", async ({ page }) => {
    const graphBtn = page.getByRole("button", { name: "Graph mode" });
    const listBtn = page.getByRole("button", { name: "List mode" });
    const about = page.locator(".card__content-text");
    const network = page.locator("#network");

    await graphBtn.click();
    await expect(network).toBeVisible();

    await listBtn.click();

    await expect(about).toBeVisible();
    await expect(network).toBeHidden();
    await expect(listBtn).toHaveAttribute("aria-pressed", "true");
    await expect(graphBtn).toHaveAttribute("aria-pressed", "false");
    expect(await linkColumns(page)).toBe(2);
  });

  test("4. Clic en un nodo muestra el texto de info", async ({ page }) => {
    const info = page.locator("#network-info");

    await openGraph(page);

    await clickNode(page, "fuis18");

    await expect(info).toBeVisible();
    await expect(page.locator("#network-info-title")).toHaveText("Fuis18");
    await expect(page.locator("#network-info-text")).toHaveText(
      "DevOps engineer focused on performance and productivity.",
    );

    await page.locator("#network-info-close").click();
    await expect(info).toBeHidden();
  });

  test("6. Cambiar de idioma actualiza la descripción del nodo visible", async ({
    page,
  }) => {
    await openGraph(page);
    await clickNode(page, "fuis18");

    await expect(page.locator("#network-info-title")).toHaveText("Fuis18");
    await expect(page.locator("#network-info-text")).toHaveText(
      "DevOps engineer focused on performance and productivity.",
    );

    await switchTo(page, "es");

    await expect(page.locator("#network-info-text")).toHaveText(
      "Ingeniero DevOps enfocado en rendimiento y productividad.",
    );

    // Tras cambiar de idioma, un nuevo clic sigue mostrando el idioma activo
    await page.locator("#network-info-close").click();
    await clickNode(page, "fuis18");
    await expect(page.locator("#network-info-title")).toHaveText("Fuis18");
    await expect(page.locator("#network-info-text")).toHaveText(
      "Ingeniero DevOps enfocado en rendimiento y productividad.",
    );
  });

  test("7. Cambiar de tema actualiza los colores del grafo", async ({
    page,
  }) => {
    await openGraph(page);

    const nodeColor = () =>
      page.evaluate(() => {
        const colors = (
          window as Window & {
            __fuisGraphColors?: { node: string };
          }
        ).__fuisGraphColors!;
        return colors.node;
      });

    await expect.poll(nodeColor).toBe("#4a4a4a");

    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await expect.poll(nodeColor).toBe("#c9c9c9");

    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveClass(/light/);

    await expect.poll(nodeColor).toBe("#4a4a4a");
  });

  test("5. En móvil (<768px) el modo grafo mantiene 2 columnas", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.reload();

    const graphBtn = page.getByRole("button", { name: "Graph mode" });
    await graphBtn.click();
    await expect(page.locator("#network canvas")).toBeVisible();

    expect(await linkColumns(page)).toBe(2);
    expect(await evenLinkBorderLeft(page)).not.toBe("0px");
    expect(await penultimateLinkBorderBottom(page)).toBe("0px");
    const mobileSize = await graphSize(page);
    expect(Math.abs(mobileSize.height - mobileSize.width)).toBeLessThanOrEqual(
      1,
    );
    expect(await modesPosition(page)).toBe("absolute");
  });
});

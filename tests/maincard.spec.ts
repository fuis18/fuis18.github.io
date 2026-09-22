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
  const { x, y } = await nodeCanvasPos(page, id);
  const canvasBox = await page.locator("#network canvas").boundingBox();
  await page.mouse.click(canvasBox!.x + x, canvasBox!.y + y);
}

type GraphNetworkForTest = {
  getPositions: (ids: string[]) => Record<string, { x: number; y: number }>;
  canvasToDOM: (pos: { x: number; y: number }) => {
    x: number;
    y: number;
  };
};

async function nodeCanvasPos(
  page: Page,
  id: string,
): Promise<{
  x: number;
  y: number;
}> {
  return page.evaluate((nodeId) => {
    const network = (window as Window & { __fuisNetwork?: GraphNetworkForTest })
      .__fuisNetwork!;
    const pos = network.getPositions([nodeId])[nodeId];
    return network.canvasToDOM(pos);
  }, id);
}

type BadgeStateForTest = {
  base: string;
  hover: string;
  active: "base" | "hover";
};

async function badgeState(page: Page, id: string): Promise<BadgeStateForTest> {
  return page.evaluate((nodeId) => {
    const badges = (
      window as Window & {
        __fuisGraphBadges?: Record<string, BadgeStateForTest>;
      }
    ).__fuisGraphBadges!;
    return badges[nodeId];
  }, id);
}

/**
 * Devuelve un punto del canvas (coords de viewport) que no tiene ningún nodo
 * encima ni está tapado por otros elementos (p. ej. los botones de modo).
 */
async function emptyCanvasPoint(page: Page): Promise<{ x: number; y: number }> {
  const point = await page.evaluate(() => {
    const canvas = document.querySelector(
      "#network canvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const network = (
      window as Window & {
        __fuisNetwork?: {
          getNodeAt: (pos: { x: number; y: number }) => unknown;
        };
      }
    ).__fuisNetwork!;
    const inViewport = (x: number, y: number) =>
      x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
    for (let y = 5; y < rect.height - 5; y += 12) {
      for (let x = 5; x < rect.width - 5; x += 12) {
        const px = rect.left + x;
        const py = rect.top + y;
        if (
          inViewport(px, py) &&
          document.elementFromPoint(px, py) === canvas &&
          network.getNodeAt({ x, y }) === undefined
        ) {
          return { x: px, y: py };
        }
      }
    }
    return null;
  });
  if (!point) throw new Error("No empty canvas point found");
  return point;
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
    // Padding superior: despeja la mitad inferior de la legenda del borde
    // para que el grafo no se dibuje debajo de ella.
    expect(await cardContentPadding(page)).toBe("20px 0px 0px");
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

    // Color real del nodo (no solo la variable JS): el bug era que los nodos
    // del grupo "skill" no actualizaban su color al cambiar de tema.
    const skillNodeColors = () =>
      page.evaluate(() => {
        const network = (
          window as Window & {
            __fuisNetwork?: {
              body: {
                nodes: Record<
                  string,
                  {
                    options: {
                      color: {
                        background: string;
                        hover: { background: string };
                        highlight: { background: string };
                      };
                    };
                  }
                >;
              };
            };
          }
        ).__fuisNetwork!;
        const { color } = network.body.nodes["astro"]!.options;
        return {
          bg: color.background,
          hover: color.hover.background,
          highlight: color.highlight.background,
        };
      });

    await expect.poll(nodeColor).toBe("#4a4a4a");
    let colors = await skillNodeColors();
    expect(colors.bg).toBe("#4a4a4a");
    expect(colors.hover).toBe(colors.highlight);

    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await expect.poll(nodeColor).toBe("#c9c9c9");
    await expect.poll(async () => (await skillNodeColors()).bg).toBe("#c9c9c9");
    colors = await skillNodeColors();
    expect(colors.hover).toBe(colors.highlight);

    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveClass(/light/);

    await expect.poll(nodeColor).toBe("#4a4a4a");
    await expect.poll(async () => (await skillNodeColors()).bg).toBe("#4a4a4a");
    colors = await skillNodeColors();
    expect(colors.hover).toBe(colors.highlight);
  });

  test("8. Hover y clic cambian el nodo a la variante -dark del badge", async ({
    page,
  }) => {
    await openGraph(page);
    await page.locator("#network canvas").scrollIntoViewIfNeeded();

    const canvasBox = await page.locator("#network canvas").boundingBox();
    const pos = await nodeCanvasPos(page, "rust");
    const away = await emptyCanvasPoint(page);

    // Nodos sin badge no exponen estado
    expect(await badgeState(page, "astro")).toBeUndefined();

    // Estado inicial: variante base (logo de marca), tinte oscuro en tema light
    const initial = await badgeState(page, "rust");
    expect(initial.active).toBe("base");
    expect(initial.base).toMatch(/^data:image\/svg\+xml/);
    expect(initial.hover).toContain("%230a0a0a");
    expect(initial.hover).not.toBe(initial.base);

    // Hover -> variante -dark (emit directo: el hover real del canvas emite lo mismo)
    await page.evaluate(() => {
      const network = (
        window as Window & {
          __fuisNetwork?: { emit: (ev: string, p: unknown) => void };
        }
      ).__fuisNetwork!;
      network.emit("hoverNode", { node: "rust" });
    });
    await expect
      .poll(async () => (await badgeState(page, "rust")).active)
      .toBe("hover");

    // Fuera del nodo -> vuelve a la variante base
    await page.evaluate(() => {
      const network = (
        window as Window & {
          __fuisNetwork?: { emit: (ev: string, p: unknown) => void };
        }
      ).__fuisNetwork!;
      network.emit("blurNode", { node: "rust" });
    });
    await expect
      .poll(async () => (await badgeState(page, "rust")).active)
      .toBe("base");

    // Clic selecciona (active) -> variante -dark
    await page.mouse.click(canvasBox!.x + pos.x, canvasBox!.y + pos.y);
    await expect
      .poll(async () => (await badgeState(page, "rust")).active)
      .toBe("hover");

    // Clic en un punto vacío del canvas deselecciona -> variante base
    await page.mouse.click(away.x, away.y);
    await expect
      .poll(async () => (await badgeState(page, "rust")).active)
      .toBe("base");

    // Cambiar de tema intercambia las variantes:
    // light: reposo a color / hover-activo monocromático tintado.
    // dark: reposo monocromático tintado / hover-activo a color.
    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect
      .poll(async () => (await badgeState(page, "rust")).base)
      .toContain("%23ccc");
    await expect
      .poll(async () => (await badgeState(page, "rust")).hover)
      .not.toContain("%23ccc");

    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveClass(/light/);
    await expect
      .poll(async () => (await badgeState(page, "rust")).base)
      .not.toContain("%23ccc");
    await expect
      .poll(async () => (await badgeState(page, "rust")).hover)
      .toContain("%230a0a0a");
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

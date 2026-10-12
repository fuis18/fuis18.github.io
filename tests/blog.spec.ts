import { test, expect, type Page } from "@playwright/test";

function expectClose(actual: number, expected: number, tolerance = 2): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

async function itemCount(page: Page): Promise<number> {
  const count = await page.locator(".blog-item").count();
  expect(count).toBeGreaterThan(0);
  return count;
}

async function edges(page: Page): Promise<{
  boxLeft: number;
  left: number;
  right: number;
  center: number;
}> {
  return page.locator(".blog-container").evaluate((el) => {
    const box = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const left =
      box.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
    const right =
      box.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
    return { boxLeft: box.left, left, right, center: (left + right) / 2 };
  });
}

async function dotCenterX(page: Page, index: number): Promise<number> {
  const box = await page.locator(".blog-item__dot").nth(index).boundingBox();
  return box!.x + box!.width / 2;
}

async function verticalRatio(page: Page, index: number): Promise<number> {
  return page
    .locator(".blog-item")
    .nth(index)
    .evaluate((item) => {
      const itemBox = item.getBoundingClientRect();
      const dotBox = item
        .querySelector(".blog-item__dot")!
        .getBoundingClientRect();
      return (dotBox.top + dotBox.height / 2 - itemBox.top) / itemBox.height;
    });
}

async function expectQuarterPattern(page: Page): Promise<void> {
  const count = await itemCount(page);
  for (let index = 0; index < count; index++) {
    const ratio = index % 2 === 0 ? 0.25 : 0.75;
    expectClose(await verticalRatio(page, index), ratio, 0.01);
  }
}

async function expectCenteredDots(page: Page): Promise<void> {
  const count = await itemCount(page);
  for (let index = 0; index < count; index++) {
    expectClose(await verticalRatio(page, index), 0.5, 0.01);
  }
}

test.describe("Línea de tiempo del blog", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/blog");
  });

  test("1. En escritorio el raíl queda centrado y las entradas alternan", async ({
    page,
  }) => {
    const { center } = await edges(page);
    const count = await itemCount(page);

    for (let index = 0; index < count; index++) {
      expectClose(await dotCenterX(page, index), center);
    }

    const sides: string[] = [];
    for (let index = 0; index < count; index++) {
      const box = await page
        .locator(".blog-item")
        .nth(index)
        .locator(".card-container")
        .boundingBox();
      sides.push(box!.x + box!.width / 2 < center ? "izq" : "der");
    }
    expect(sides).toEqual(
      Array.from({ length: count }, (_, index) =>
        index % 2 === 0 ? "izq" : "der",
      ),
    );

    await expectQuarterPattern(page);
  });

  test("2. En móvil el raíl queda a la izquierda y las entradas apilan", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });

    const { boxLeft, left, right } = await edges(page);
    const items = page.locator(".blog-item");
    const count = await itemCount(page);

    for (let index = 0; index < count; index++) {
      const box = await items.nth(index).boundingBox();
      expectClose(box!.x, left);
      expectClose(box!.x + box!.width, right);
    }

    expectClose(await dotCenterX(page, 0), boxLeft + 5); // 5px = --dot / 2

    await expectCenteredDots(page);
  });
});

test.describe("Contenido del blog", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("3. La lista viene de la colección, del más nuevo al más viejo", async ({
    page,
  }) => {
    await page.goto("/blog");

    const dates = await page
      .locator("[data-post-index]")
      .evaluateAll((items) =>
        items.map((item) =>
          item
            .querySelector("time")!
            .getAttribute("datetime")!
            .split("-")
            .map(Number),
        ),
      );

    const timestamps = dates.map(([y, m, d]) => Date.UTC(y, m - 1, d));
    expect(timestamps).toEqual(timestamps.toSorted((a, b) => b - a));
  });

  test("4. La tarjeta enlaza a /blog/{slug} y el post renderiza el MDX", async ({
    page,
  }) => {
    await page.goto("/blog");

    const card = page.locator("a[href='/blog/my-beginnings']");
    await expect(card).toHaveCount(1);
    await expect(card.locator("[data-post-field='title']")).toHaveText(
      "My Beginnings",
    );

    await card.click();
    await page.waitForURL("**/blog/my-beginnings");

    await expect(page.locator("[data-post-field='title']")).toHaveText(
      "My Beginnings",
    );
    await expect(page.locator("time")).toHaveAttribute(
      "datetime",
      "2026-10-05",
    );
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator(".prose h1")).toHaveCount(0);
    await expect(page.locator(".prose")).toContainText(
      "As a child, I liked to argue for what was right",
    );
  });

  test("5. El post muestra tags y tiempo de lectura", async ({ page }) => {
    await page.goto("/blog/my-beginnings");

    await expect(page.locator("[data-post-field='reading-time']")).toHaveText(
      "7 min read",
    );
    await expect(page.locator(".tag")).toHaveText(["personal", "psychology"]);
  });

  test("6. El título hace morph de la tarjeta al post sin re-escribirse", async ({
    page,
  }) => {
    await page.goto("/blog");

    const card = page.locator("a[href='/blog/my-beginnings']");
    const cardTitle = card.locator("[data-post-field='title']");
    await expect(cardTitle).toHaveText("My Beginnings");

    expect(
      await cardTitle.evaluate((el) => getComputedStyle(el).viewTransitionName),
    ).toBe("blog-title-my-beginnings");

    await page.evaluate(() => {
      const FULL = "My Beginnings";
      (
        window as unknown as { __fuisTitleRewrote?: boolean }
      ).__fuisTitleRewrote = false;
      new MutationObserver(() => {
        const h1 = document.querySelector<HTMLElement>(
          "main h1[data-post-field='title']",
        );
        if (h1 && h1.textContent?.trim() !== FULL) {
          (
            window as unknown as { __fuisTitleRewrote: boolean }
          ).__fuisTitleRewrote = true;
        }
      }).observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    });

    await card.click();
    await page.waitForURL("**/blog/my-beginnings");

    const postTitle = page.locator("main h1");
    await expect(postTitle).toHaveText("My Beginnings");

    expect(
      await postTitle.evaluate((el) => getComputedStyle(el).viewTransitionName),
    ).toBe("blog-title-my-beginnings");

    await page.waitForTimeout(800);
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { __fuisTitleRewrote: boolean })
            .__fuisTitleRewrote,
      ),
    ).toBe(false);
  });
});

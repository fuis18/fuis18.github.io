import { test, expect, type Page } from "@playwright/test";

function expectClose(actual: number, expected: number, tolerance = 2): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
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
  const expected = [0.25, 0.75, 0.25, 0.75];
  for (const [index, ratio] of expected.entries()) {
    expectClose(await verticalRatio(page, index), ratio, 0.01);
  }
}

async function expectCenteredDots(page: Page): Promise<void> {
  for (const index of [0, 1, 2, 3]) {
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

    for (const index of [0, 1, 2, 3]) {
      expectClose(await dotCenterX(page, index), center);
    }

    const sides: string[] = [];
    for (const index of [0, 1, 2, 3]) {
      const box = await page
        .locator(".blog-item")
        .nth(index)
        .locator(".card-container")
        .boundingBox();
      sides.push(box!.x + box!.width / 2 < center ? "izq" : "der");
    }
    expect(sides).toEqual(["izq", "der", "izq", "der"]);

    await expectQuarterPattern(page);
  });

  test("2. En móvil el raíl queda a la izquierda y las entradas apilan", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });

    const { boxLeft, left, right } = await edges(page);
    const items = page.locator(".blog-item");

    for (let index = 0; index < 4; index++) {
      const box = await items.nth(index).boundingBox();
      expectClose(box!.x, left);
      expectClose(box!.x + box!.width, right);
    }

    expectClose(await dotCenterX(page, 0), boxLeft + 5); // 5px = --dot / 2

    await expectCenteredDots(page);
  });
});

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ShapePool, POOL_SIZE, polygonPoints, MAX_SHAPES } from "./background";

function createSvg(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  document.body.appendChild(svg);
  return svg;
}

function expireAll(pool: ShapePool) {
  while (pool.spawn()) {}
  for (const node of pool.nodes) {
    node.opacity = 0.01;
    node.fadeRate = 0.005;
  }
  for (let i = 0; i < 5; i++) pool.step();
}

describe("background pool", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("crea exactamente POOL_SIZE nodos al inicializar", () => {
    const svg = createSvg();
    const pool = new ShapePool(svg, 1280, 720);

    expect(svg.childElementCount).toBe(POOL_SIZE);
    expect(pool.nodes.length).toBe(POOL_SIZE);

    pool.remove();
  });

  it("nunca agrega ni elimina nodos del SVG", () => {
    const svg = createSvg();
    const pool = new ShapePool(svg, 1280, 720);
    const originalElements = new Set(pool.nodes.map((node) => node.element));

    expireAll(pool);
    expect(svg.childElementCount).toBe(POOL_SIZE);

    for (let i = 0; i < MAX_SHAPES * 5; i++) pool.spawn();
    expect(svg.childElementCount).toBe(POOL_SIZE);
    expect(
      pool.nodes
        .map((node) => node.element)
        .every((el) => originalElements.has(el)),
    ).toBe(true);

    pool.remove();
  });

  it("reutiliza los mismos elementos al reaparecer", () => {
    const svg = createSvg();
    const pool = new ShapePool(svg, 1280, 720);
    const originalElements = new Set(pool.nodes.map((node) => node.element));

    expireAll(pool);
    for (let i = 0; i < 8; i++) expect(pool.spawn()).toBe(true);

    expect(
      pool.nodes
        .map((node) => node.element)
        .every((el) => originalElements.has(el)),
    ).toBe(true);

    pool.remove();
  });

  it("no deja nodos visibles con opacity <= 0 tras expirar", () => {
    const svg = createSvg();
    const pool = new ShapePool(svg, 1280, 720);

    expireAll(pool);

    expect(pool.nodes.every((node) => !node.active)).toBe(true);
    expect(
      pool.nodes.every((node) => node.element.style.visibility !== "visible"),
    ).toBe(true);

    pool.remove();
  });

  it("no spawn más allá del tamaño del pool", () => {
    const svg = createSvg();
    const pool = new ShapePool(svg, 1280, 720);

    expireAll(pool);
    for (let i = 0; i < POOL_SIZE; i++) expect(pool.spawn()).toBe(true);
    expect(pool.spawn()).toBe(false);
    expect(pool.active).toBe(POOL_SIZE);

    pool.remove();
  });
});

describe("polygonPoints", () => {
  it("calcula el triángulo", () => {
    expect(polygonPoints("triangle", 100)).toBe("-50,0 0,86 50,0");
  });

  it("calcula el pentágono a mitad de escala", () => {
    expect(polygonPoints("pentagon", 100)).toBe(
      "0,-50 -47.5,-15.5 -29.5,40.5 29.5,40.5 47.5,-15.5",
    );
  });

  it("calcula el hexágono a mitad de escala", () => {
    expect(polygonPoints("hexagon", 100)).toBe(
      "25,-43.5 -25,-43.5 -50,0 -25,43.5 25,43.5 50,0",
    );
  });
});

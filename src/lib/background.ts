export const SHAPES = [
  "circle",
  "triangle",
  "square",
  "pentagon",
  "hexagon",
] as const;
export type ShapeKind = (typeof SHAPES)[number];

export const MAX_SHAPES = 10;
export const POOL_SIZE = MAX_SHAPES + 2;
const CREATE_CHANCE = 0.02;
const DIRECTIONS = ["left", "right", "top", "bottom"] as const;
const SVG_NS = "http://www.w3.org/2000/svg";
const CONTAINER_ID = "polygons-background";

const round2 = (value: number) => Math.round(value * 100) / 100;

export function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function polygonPoints(kind: ShapeKind, radius: number): string {
  switch (kind) {
    case "triangle":
      return `${-radius / 2},0 0,${round2(radius * 0.86)} ${radius / 2},0`;
    case "pentagon": {
      const s = radius * 0.5;
      return `${0},${-s} ${round2(-s * 0.95)},${round2(-s * 0.31)} ${round2(
        -s * 0.59,
      )},${round2(s * 0.81)} ${round2(s * 0.59)},${round2(
        s * 0.81,
      )} ${round2(s * 0.95)},${round2(-s * 0.31)}`;
    }
    case "hexagon": {
      const s = radius * 0.5;
      return `${round2(s / 2)},${round2(-s * 0.87)} ${round2(
        -s / 2,
      )},${round2(-s * 0.87)} ${-s},0 ${round2(-s / 2)},${round2(
        s * 0.87,
      )} ${round2(s / 2)},${round2(s * 0.87)} ${s},0`;
    }
    default:
      throw new Error(`"${kind}" is not a polygon`);
  }
}

function applyGeometry(node: SVGElement, kind: ShapeKind, radius: number) {
  switch (kind) {
    case "circle":
      node.setAttribute("r", String(radius));
      break;
    case "square":
      node.setAttribute("x", String(-radius));
      node.setAttribute("y", String(-radius));
      node.setAttribute("width", String(radius * 2));
      node.setAttribute("height", String(radius * 2));
      break;
    default:
      node.setAttribute("points", polygonPoints(kind, radius));
  }
}

function createNode(svg: SVGElement, kind: ShapeKind): SVGElement {
  const tag =
    kind === "circle" ? "circle" : kind === "square" ? "rect" : "polygon";
  const node = document.createElementNS(SVG_NS, tag);
  node.classList.add("shape");
  applyGeometry(node, kind, 50);
  svg.appendChild(node);
  return node;
}

export interface PoolNode {
  kind: ShapeKind;
  element: SVGElement;
  active: boolean;
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  spin: number;
  opacity: number;
  fadeRate: number;
  rotation: number;
}

type StartPosition = {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
};

function rollStart(width: number, height: number): StartPosition {
  const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

  switch (direction) {
    case "left":
      return {
        posX: randBetween(-400, width + 400),
        posY: randBetween(-400, height + 400),
        velX: randBetween(1, 100),
        velY: randBetween(-100, 100),
      };
    case "right":
      return {
        posX: randBetween(width, width + 400),
        posY: randBetween(0, height),
        velX: randBetween(-100, -1),
        velY: randBetween(-100, 100),
      };
    case "top":
      return {
        posX: randBetween(0, width),
        posY: randBetween(-400, 0),
        velX: randBetween(-100, 100),
        velY: randBetween(1, 100),
      };
    case "bottom":
      return {
        posX: randBetween(0, width),
        posY: randBetween(height, height + 400),
        velX: randBetween(-100, 100),
        velY: randBetween(-100, -1),
      };
    default:
      throw new Error("invalid direction");
  }
}

function renderNode(node: PoolNode) {
  node.element.setAttribute(
    "transform",
    `translate(${Math.round(node.x)},${Math.round(node.y)}) rotate(${node.rotation})`,
  );
  node.element.setAttribute("opacity", String(node.opacity));
}

export class ShapePool {
  readonly nodes: PoolNode[] = [];
  private activeCount = 0;
  private running = false;
  private rafId = 0;

  readonly svg: SVGElement;
  private readonly width: number;
  private readonly height: number;

  constructor(
    svg: SVGElement,
    width: number = window.innerWidth,
    height: number = window.innerHeight,
  ) {
    this.svg = svg;
    this.width = width;
    this.height = height;
    for (let i = 0; i < POOL_SIZE; i++) {
      const kind = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const element = createNode(svg, kind);
      element.style.visibility = "hidden";
      this.nodes.push({
        kind,
        element,
        active: false,
        x: 0,
        y: 0,
        radius: 0,
        velocityX: 0,
        velocityY: 0,
        spin: 0,
        opacity: 0,
        fadeRate: 0,
        rotation: 0,
      });
    }
  }

  get active(): number {
    return this.activeCount;
  }

  spawn(): boolean {
    const kind = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    let node = this.nodes.find(
      (candidate) => !candidate.active && candidate.kind === kind,
    );
    if (!node) {
      node = this.nodes.find((candidate) => !candidate.active);
    }
    if (!node) return false;

    const { posX, posY, velX, velY } = rollStart(this.width, this.height);

    node.active = true;
    this.activeCount++;
    node.radius = randBetween(25, 200);
    node.x = posX;
    node.y = posY;
    node.velocityX = velX / 100;
    node.velocityY = velY / 100;
    node.spin = randBetween(-10, 10) / 100;
    node.opacity = Math.random();
    node.fadeRate = randBetween(1, 100) / 20000;
    node.rotation = randBetween(0, 360);

    applyGeometry(node.element, node.kind, node.radius);
    node.element.style.visibility = "visible";
    renderNode(node);
    return true;
  }

  step() {
    for (const node of this.nodes) {
      if (!node.active) continue;

      node.x += node.velocityX;
      node.y += node.velocityY;
      node.rotation += node.spin;
      node.opacity -= node.fadeRate;

      if (node.opacity <= 0) {
        node.active = false;
        this.activeCount--;
        node.element.style.visibility = "hidden";
      } else {
        renderNode(node);
      }
    }
  }

  private tick = () => {
    if (!this.running) return;

    if (!this.svg.isConnected) {
      this.stop();
      const registry = getRegistry();
      if (registry.pool === this) registry.pool = undefined;
      return;
    }

    this.step();

    if (Math.random() < (MAX_SHAPES - this.activeCount) * 0.2 * CREATE_CHANCE) {
      this.spawn();
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  remove() {
    this.stop();
    this.svg.remove();
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type BackgroundRegistry = {
  pool?: ShapePool;
  listenerAttached?: boolean;
};

function getRegistry(): BackgroundRegistry {
  const scope = window as unknown as {
    __shapeBackgroundRegistry?: BackgroundRegistry;
  };
  if (!scope.__shapeBackgroundRegistry) {
    scope.__shapeBackgroundRegistry = {};
  }
  return scope.__shapeBackgroundRegistry;
}

export function ensureBackground(): ShapePool | null {
  if (prefersReducedMotion()) return null;
  if (typeof document === "undefined" || !document.body) return null;

  const registry = getRegistry();
  const container = document.getElementById(CONTAINER_ID);

  if (!container) {
    if (registry.pool) {
      registry.pool.remove();
      registry.pool = undefined;
    }
    return null;
  }

  if (registry.pool) {
    if (registry.pool.svg.isConnected) return registry.pool;
    registry.pool.remove();
    registry.pool = undefined;
  }

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  container.appendChild(svg);

  const pool = new ShapePool(svg);
  pool.start();
  registry.pool = pool;
  return pool;
}

export function initBackground(): ShapePool | null {
  if (typeof document === "undefined") return null;

  const registry = getRegistry();
  if (!registry.listenerAttached) {
    registry.listenerAttached = true;
    document.addEventListener("DOMContentLoaded", () => ensureBackground());
    document.addEventListener("astro:page-load", () => ensureBackground());
  }

  return ensureBackground();
}

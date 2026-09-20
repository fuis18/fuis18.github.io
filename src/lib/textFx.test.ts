import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  buildText,
  rebuildText,
  measureLineBreaks,
  FX_SELECTOR,
} from "./textFx";

function makeEl(text: string): HTMLElement {
  const el = document.createElement("p");
  el.textContent = text;
  return el;
}

function hasLeftovers(el: HTMLElement): boolean {
  return (
    el.querySelector(".textfx-char") !== null ||
    el.querySelector(".textfx-line") !== null ||
    el.classList.contains("textfx-destroying")
  );
}

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => ({
      matches,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }),
  });
}

/**
 * Simula el layout: `getClientRects()` cuenta una línea por cada salto de
 * línea superado (`jumpAt` = offset donde empiezan las líneas 2..n).
 * Bajo este mock, "abcdefghij" con saltos en 4 y 8 se parte en
 * "abcd"/"efgh"/"ij".
 */
function mockLineRects(jumpAt: number[]) {
  const proto = Range.prototype as { getClientRects?: unknown };
  const original = proto.getClientRects;
  Object.defineProperty(proto, "getClientRects", {
    configurable: true,
    writable: true,
    value: function (this: Range) {
      const k = this.endOffset;
      let lines = 1;
      for (const j of jumpAt) if (k > j) lines++;
      return Array.from(
        { length: lines },
        () => ({}),
      ) as unknown as DOMRectList;
    },
  });
  return () => {
    if (original === undefined) {
      delete proto.getClientRects;
    } else {
      Object.defineProperty(proto, "getClientRects", {
        configurable: true,
        writable: true,
        value: original,
      });
    }
  };
}

describe("measureLineBreaks", () => {
  let restoreRects: (() => void) | undefined;

  afterEach(() => {
    restoreRects?.();
    restoreRects = undefined;
  });

  it("calcula los fines exclusivos de cada línea visual", () => {
    const el = makeEl("abcdefghij");
    restoreRects = mockLineRects([4, 8]);
    expect(measureLineBreaks(el, "abcdefghij")).toEqual([4, 8]);
  });

  it("devuelve null para un texto de una sola línea", () => {
    const el = makeEl("Home");
    restoreRects = mockLineRects([]);
    expect(measureLineBreaks(el, "Home")).toBeNull();
  });

  it("devuelve null sin layout (jsdom no calcula rects)", () => {
    const el = makeEl("Una frase que envuelve en varias líneas");
    expect(
      measureLineBreaks(el, "Una frase que envuelve en varias líneas"),
    ).toBeNull();
  });

  it("devuelve null si el elemento no contiene el texto completo", () => {
    const el = makeEl("Holo");
    expect(measureLineBreaks(el, "Hello")).toBeNull();
  });
});

describe("buildText", () => {
  beforeEach(() => stubMatchMedia(false));

  it("escribe el texto completo y deja el DOM limpio", () => {
    vi.useFakeTimers();
    const el = makeEl("Hello world.");
    buildText(el);
    vi.advanceTimersByTime(5_000);
    expect(el.textContent).toBe("Hello world.");
    expect(hasLeftovers(el)).toBe(false);
  });

  it("acota la duración: 250 caracteres terminan dentro del presupuesto", () => {
    vi.useFakeTimers();
    const longText =
      "DevOps engineer focused on performance, productivity and technical excellence. ".repeat(
        4,
      );
    expect(longText.length).toBeGreaterThan(200);
    const el = makeEl(longText);

    buildText(el);

    let elapsed = 0;
    while (el.textContent !== longText && elapsed < 4_000) {
      vi.advanceTimersByTime(50);
      elapsed += 50;
    }
    expect(el.textContent).toBe(longText);
    // Presupuesto fijo compartido (LINE_BUDGET_MS), no por carácter: la
    // duración queda acotada incluso para textos muy largos.
    expect(elapsed).toBeLessThanOrEqual(2_000);
    expect(hasLeftovers(el)).toBe(false);
  });

  it("un texto vacío o con reduced-motion se aplica al instante", () => {
    vi.useFakeTimers();
    const el = makeEl("");
    buildText(el);
    vi.advanceTimersByTime(1_000);
    expect(el.textContent).toBe("");
    expect(hasLeftovers(el)).toBe(false);
  });
});

describe("rebuildText", () => {
  beforeEach(() => stubMatchMedia(false));

  it("desconstruye el texto viejo y construye el nuevo, sin residuos", () => {
    vi.useFakeTimers();
    const el = makeEl("Holo");
    buildText(el);
    vi.advanceTimersByTime(1_000);
    expect(el.textContent).toBe("Holo");

    // El sync ya escribió el nuevo texto; rebuildText recibe el viejo.
    el.textContent = "Hello";
    rebuildText(el, "Holo");

    // Durante la desconstrucción hay spans temporales…
    vi.advanceTimersByTime(100);
    const spans = el.querySelectorAll(".textfx-char");
    expect(spans.length).toBeGreaterThan(1);

    // …y los retardos confirman que va del último carácter al primero
    const delays = Array.from(spans).map((s) => {
      const m = s.style.transition.match(/ease (\d+(?:\.\d+)?)ms/);
      return m ? Number(m[1]) : 0;
    });
    expect(delays[delays.length - 1]).toBe(0);
    expect(delays[0]).toBeGreaterThan(delays[delays.length - 1]);

    // …pero al final queda texto plano del idioma nuevo.
    vi.advanceTimersByTime(5_000);
    expect(el.textContent).toBe("Hello");
    expect(hasLeftovers(el)).toBe(false);
  });

  it("elemento fresco: solo construcción (navegación/carga)", () => {
    vi.useFakeTimers();
    const el = makeEl("Inicio");
    rebuildText(el, "Home");
    vi.advanceTimersByTime(1_000);
    expect(el.textContent).toBe("Inicio");
    expect(hasLeftovers(el)).toBe(false);
  });

  it("sin cambio real de texto no re-anima", () => {
    vi.useFakeTimers();
    const el = makeEl("Home");
    buildText(el);
    vi.advanceTimersByTime(1_000);

    el.textContent = "Home";
    rebuildText(el, "Home");
    vi.advanceTimersByTime(2_000);
    expect(el.textContent).toBe("Home");
    expect(hasLeftovers(el)).toBe(false);
  });

  it("una animación en curso se cancela con el siguiente cambio", () => {
    vi.useFakeTimers();
    const el = makeEl("Un texto largo para iniciar");
    buildText(el);
    vi.advanceTimersByTime(100); // mitad de la construcción

    el.textContent = "Nuevo idioma";
    rebuildText(el, "Un texto largo para iniciar");
    vi.advanceTimersByTime(200); // mitad de la desconstrucción

    el.textContent = "Otro idioma";
    rebuildText(el, "Nuevo idioma");
    vi.advanceTimersByTime(5_000);

    expect(el.textContent).toBe("Otro idioma");
    expect(hasLeftovers(el)).toBe(false);
  });

  it("un dispatch redundante a mitad de la construcción no la interrumpe", () => {
    vi.useFakeTimers();
    const el = makeEl("Home");
    buildText(el);
    vi.advanceTimersByTime(30); // construcción en curso (texto parcial)

    const partial = el.textContent ?? "";
    expect(partial).not.toBe("Home");

    // Un lang-change redundante captura/reescribe el mismo texto parcial:
    // rebuildText debe ignorarlo sin invalidar la cadena en curso.
    el.textContent = partial;
    rebuildText(el, partial);
    vi.advanceTimersByTime(5_000);

    expect(el.textContent).toBe("Home");
    expect(hasLeftovers(el)).toBe(false);
  });

  it("con reduced-motion aplica el texto directamente", () => {
    vi.useFakeTimers();
    stubMatchMedia(true);
    const el = makeEl("Holo");
    el.textContent = "Hello";
    rebuildText(el, "Holo");
    vi.advanceTimersByTime(1_000);
    expect(el.textContent).toBe("Hello");
    expect(hasLeftovers(el)).toBe(false);
  });
});

describe("construcción por líneas (simultánea)", () => {
  let restoreRects: (() => void) | undefined;

  beforeEach(() => {
    stubMatchMedia(false);
    restoreRects = mockLineRects([4, 8]);
  });

  afterEach(() => {
    restoreRects?.();
    restoreRects = undefined;
  });

  it("parte en un span por línea y las avanza en el mismo tick", () => {
    vi.useFakeTimers();
    const el = makeEl("abcdefghij");
    buildText(el);

    // Tras el primer tick, todas las líneas ya tienen texto parcial a la vez.
    vi.advanceTimersByTime(15);
    const spans = el.querySelectorAll(".textfx-line");
    expect(spans.length).toBe(3);
    spans.forEach((s) => expect(s.style.display).toBe("block"));
    expect(Array.from(spans).map((s) => s.textContent)).toEqual([
      "a",
      "e",
      "i",
    ]);

    vi.advanceTimersByTime(5_000);
    expect(el.textContent).toBe("abcdefghij");
    expect(el.querySelector(".textfx-line")).toBeNull();
    expect(hasLeftovers(el)).toBe(false);
  });

  it("todas las líneas terminan juntas y dejan el DOM limpio", () => {
    vi.useFakeTimers();
    const el = makeEl("abcdefghij");
    buildText(el);

    let elapsed = 0;
    while (el.querySelector(".textfx-line") && elapsed < 2_000) {
      vi.advanceTimersByTime(15);
      elapsed += 15;
    }
    expect(el.textContent).toBe("abcdefghij");
    expect(el.querySelector(".textfx-line")).toBeNull();
    expect(hasLeftovers(el)).toBe(false);
    // Presupuesto compartido: pocas líneas cortas terminan muy rápido.
    expect(elapsed).toBeLessThanOrEqual(600);
  });

  it("rebuildText mide las líneas antes de desconstruir y las usa tras", () => {
    vi.useFakeTimers();
    const el = makeEl("Holo");
    buildText(el);
    vi.advanceTimersByTime(1_000);

    // El sync ya escribió el nuevo texto; rebuildText recibe el viejo.
    el.textContent = "abcdefghij";
    rebuildText(el, "Holo");

    vi.advanceTimersByTime(470); // desconstrucción completa (350+120)
    expect(el.querySelectorAll(".textfx-line").length).toBe(3);

    vi.advanceTimersByTime(5_000);
    expect(el.textContent).toBe("abcdefghij");
    expect(hasLeftovers(el)).toBe(false);
  });
});

describe("reserva de altura (antiparpadeo)", () => {
  beforeEach(() => stubMatchMedia(false));

  function mockHeight(el: HTMLElement, height: number) {
    Object.defineProperty(el, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ height }) as DOMRect,
    });
  }

  it("mantiene la altura del texto completo mientras se escribe", () => {
    vi.useFakeTimers();
    const el = makeEl("Un título");
    mockHeight(el, 48);

    buildText(el);
    vi.advanceTimersByTime(30); // texto todavía parcial
    expect(el.style.minHeight).toBe("48px");
    expect(el.textContent).not.toBe("Un título");

    vi.advanceTimersByTime(5_000);
    expect(el.textContent).toBe("Un título");
    expect(el.style.minHeight).toBe(""); // liberada al terminar
    expect(hasLeftovers(el)).toBe(false);
  });

  it("reserva la altura del texto nuevo antes de desconstruir", () => {
    vi.useFakeTimers();
    const el = makeEl("Holo");
    buildText(el);
    vi.advanceTimersByTime(1_000);
    mockHeight(el, 64);

    // El sync ya escribió el nuevo texto; rebuildText recibe el viejo.
    el.textContent = "Hello";
    rebuildText(el, "Holo");

    // Desde la fase de desconstrucción la altura queda reservada.
    expect(el.style.minHeight).toBe("64px");
    vi.advanceTimersByTime(600); // desconstrucción completa
    vi.advanceTimersByTime(5_000);

    expect(el.textContent).toBe("Hello");
    expect(el.style.minHeight).toBe(""); // liberada al terminar
    expect(hasLeftovers(el)).toBe(false);
  });
});

describe("FX_SELECTOR", () => {
  it("apunta a los elementos marcados con data-textfx", () => {
    expect(FX_SELECTOR).toBe("[data-textfx]");
  });
});

afterEach(() => {
  vi.useRealTimers();
});

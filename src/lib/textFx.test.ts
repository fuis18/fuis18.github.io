import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { buildText, rebuildText, splitSegments, FX_SELECTOR } from "./textFx";

function makeEl(text: string): HTMLElement {
  const el = document.createElement("p");
  el.textContent = text;
  return el;
}

function hasLeftovers(el: HTMLElement): boolean {
  return (
    el.querySelector(".textfx-char") !== null ||
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

describe("splitSegments", () => {
  it("divide por frases conservando la puntuación", () => {
    expect(splitSegments("Hello world. Two. Three!")).toEqual([
      "Hello world.",
      "Two.",
      "Three!",
    ]);
  });

  it("mantiene frases cortas sin puntuación como un solo segmento", () => {
    expect(splitSegments("SEP 2026")).toEqual(["SEP 2026"]);
    expect(splitSegments("DevOps Engineer")).toEqual(["DevOps Engineer"]);
  });

  it("no genera segmentos vacíos ni con espacios de más", () => {
    expect(splitSegments("  Hola.  ¿Todo bien?  ")).toEqual([
      "Hola.",
      "¿Todo bien?",
    ]);
    expect(splitSegments("")).toEqual([]);
    expect(splitSegments("   ")).toEqual([]);
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
    // Presupuesto por segmento (frase), no por carácter: la duración queda
    // acotada incluso para textos largos (~8 fases × ~300ms).
    expect(elapsed).toBeLessThanOrEqual(3_500);
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

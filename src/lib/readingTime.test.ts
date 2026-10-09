import { describe, it, expect } from "vitest";
import {
  estimateReadingTime,
  WORDS_PER_MINUTE,
  CJK_CHARS_PER_MINUTE,
} from "./readingTime";

function stretch(unit: string, total: number): string {
  return unit.repeat(Math.ceil(total / unit.length)).slice(0, total);
}

function words(count: number): string {
  return Array.from({ length: count }, (_, i) => `palabra${i}`).join(" ");
}

describe("estimateReadingTime", () => {
  it("estima por palabras en escrituras con espacios", () => {
    expect(estimateReadingTime(words(WORDS_PER_MINUTE * 7))).toBe(7);
  });

  it("nunca devuelve 0 y tolera cuerpos vacíos", () => {
    expect(estimateReadingTime(undefined)).toBe(1);
    expect(estimateReadingTime("   ")).toBe(1);
    expect(estimateReadingTime("una palabra")).toBe(1);
  });

  it("cuenta caracteres en japonés, que no usa espacios", () => {
    const body = stretch("あ", CJK_CHARS_PER_MINUTE * 3);

    // Contado por `split(/\s+/)` sería un único token → 1 min
    expect(estimateReadingTime(body)).toBe(3);
  });

  it("suma el contenido latino de un texto mayormente japonés", () => {
    const body = `${stretch("あ", CJK_CHARS_PER_MINUTE * 2)} Rust`;

    expect(estimateReadingTime(body)).toBe(2);
  });

  it("descarta la puntuación que queda suelta tras quitar los CJK", () => {
    expect(estimateReadingTime("。".repeat(500))).toBe(1);
  });
});

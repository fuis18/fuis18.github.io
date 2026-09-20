import { describe, it, expect } from "vitest";
import graph from "./graph.json";
import { DEFAULT_LANG, LANGS, pickLocalized, setLang } from "@/lib/i18n";
import { resolveBadges } from "@/lib/badges";

type Locale = (typeof LANGS)[number];

const ids = new Set(graph.nodes.map((node) => node.id));
const locales = LANGS as readonly Locale[];

describe("graph.json", () => {
  it("expone ids de nodos únicos", () => {
    expect(ids.size).toBe(graph.nodes.length);
  });

  it("tiene un único nodo central y agrupa por categorías", () => {
    const center = graph.nodes.filter((node) => node.group === "center");
    const categories = graph.nodes.filter((node) => node.group === "category");
    const skills = graph.nodes.filter((node) => node.group === "skill");

    expect(center).toHaveLength(1);
    expect(categories.length).toBeGreaterThan(0);
    expect(skills.length).toBeGreaterThan(0);
  });

  it("cada edge referencia nodos existentes", () => {
    for (const edge of graph.edges) {
      expect(ids.has(edge.from), `edge from '${edge.from}'`).toBe(true);
      expect(ids.has(edge.to), `edge to '${edge.to}'`).toBe(true);
    }
  });

  it("todas las descripciones están localizadas a todos los idiomas soportados", () => {
    for (const node of graph.nodes) {
      for (const locale of locales) {
        const text = node.description?.[locale];
        expect(text, `${node.id} [${locale}]`).toBeTruthy();
      }
    }
  });

  it("pickLocalized resuelve la descripción del idioma activo con fallback al base", () => {
    const node = graph.nodes.find((n) => n.id === "astro");
    expect(node).toBeDefined();
    const desc = node!.description as Record<string, string>;

    for (const locale of locales) {
      setLang(locale);
      expect(pickLocalized(desc)).toBe(desc[locale]);
    }

    // fallback
    setLang("en");
    const partial = { en: desc[DEFAULT_LANG], es: "solo es" };
    setLang("ja");
    expect(pickLocalized(partial)).toBe(partial.en);
  });

  it("cada badge referenciado existe en svg-badges", () => {
    const files = import.meta.glob("../assets/svg-badges/*.svg", {
      eager: true,
      query: "?raw",
      import: "default",
    }) as Record<string, string>;
    const assets = resolveBadges(files);

    for (const node of graph.nodes) {
      if (node.badge) {
        expect(
          assets[node.badge],
          `${node.id} -> badge '${node.badge}'`,
        ).toBeTruthy();
      }
    }
  });
});

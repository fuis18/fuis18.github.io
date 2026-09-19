import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getLang,
  setLang,
  initLang,
  syncOnLangChange,
  DEFAULT_LANG,
  LANGS,
} from "./i18n";

describe("i18n", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, "languages", {
      value: ["en-US"],
      configurable: true,
    });
    document.documentElement.lang = "en";
    document.body.innerHTML = "";
  });

  it("expone los idiomas soportados (con 'ja' BCP-47) y el idioma por defecto", () => {
    expect(LANGS).toEqual(["en", "es", "ja", "de"]);
    expect(DEFAULT_LANG).toBe("en");
  });

  describe("getLang", () => {
    it("detecta 'es' cuando navigator.languages incluye 'es-MX'", () => {
      Object.defineProperty(navigator, "languages", {
        value: ["es-MX"],
        configurable: true,
      });
      expect(getLang()).toBe("es");
    });

    it("detecta 'ja' cuando navigator.languages incluye 'ja-JP'", () => {
      Object.defineProperty(navigator, "languages", {
        value: ["ja-JP"],
        configurable: true,
      });
      expect(getLang()).toBe("ja");
    });

    it("detecta 'de' cuando navigator.languages incluye 'de-DE'", () => {
      Object.defineProperty(navigator, "languages", {
        value: ["de-DE"],
        configurable: true,
      });
      expect(getLang()).toBe("de");
    });

    it("retorna el idioma por defecto cuando navigator no es soportado", () => {
      Object.defineProperty(navigator, "languages", {
        value: ["fr-FR"],
        configurable: true,
      });
      expect(getLang()).toBe("en");
    });

    it("retorna valor de localStorage si existe", () => {
      localStorage.setItem("lang", "es");
      expect(getLang()).toBe("es");
    });

    it("ignora un idioma no soportado en localStorage", () => {
      localStorage.setItem("lang", "xx");
      Object.defineProperty(navigator, "languages", {
        value: ["fr-FR"],
        configurable: true,
      });
      expect(getLang()).toBe("en");
    });

    it("localStorage tiene prioridad sobre navigator.languages", () => {
      Object.defineProperty(navigator, "languages", {
        value: ["en-US"],
        configurable: true,
      });
      localStorage.setItem("lang", "es");
      expect(getLang()).toBe("es");
    });
  });

  describe("setLang", () => {
    it("persiste en localStorage", () => {
      setLang("es");
      expect(localStorage.getItem("lang")).toBe("es");
    });

    it("persiste 'ja' (código BCP-47)", () => {
      setLang("ja");
      expect(localStorage.getItem("lang")).toBe("ja");
    });

    it("guarda el idioma por defecto si el lenguaje no es soportado", () => {
      setLang("xx");
      expect(localStorage.getItem("lang")).toBe("en");
    });

    it("actualiza document.documentElement.lang", () => {
      setLang("es");
      expect(document.documentElement.lang).toBe("es");
    });

    it("dispatch event lang-change con el detail correcto", () => {
      const handler = vi.fn();
      document.addEventListener("lang-change", handler);
      setLang("ja");
      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.lang).toBe("ja");
      document.removeEventListener("lang-change", handler);
    });
  });

  describe("initLang", () => {
    it("aplica el idioma persistido a document.documentElement.lang", () => {
      localStorage.setItem("lang", "es");
      initLang();
      expect(document.documentElement.lang).toBe("es");
    });
  });

  describe("syncOnLangChange", () => {
    it("re-renderiza el texto via textContent sin nodos duplicados ni display:none", () => {
      document.body.innerHTML = `<span data-message="x">x</span>`;
      const el = () =>
        document.querySelector<HTMLElement>("[data-message='x']");

      syncOnLangChange(() => {
        const node = el();
        if (node) node.textContent = getLang().toUpperCase();
      });

      // Primer render con el idioma por defecto
      expect(el()?.textContent).toBe("EN");
      // Cambio de idioma re-renderiza el mismo nodo
      setLang("es");
      expect(el()?.textContent).toBe("ES");
      // El mecanismo nunca usa display:none
      expect(el()?.style.display).toBe("");
    });
  });
});

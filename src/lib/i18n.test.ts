import { describe, it, expect, beforeEach, vi } from "vitest";
import { getLang, setLang, updateTranslations } from "./i18n";

describe("i18n", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
    document.body.innerHTML = "";
  });

  describe("getLang", () => {
    it("retorna 'en' por defecto cuando navigator no es 'es'", () => {
      Object.defineProperty(navigator, "language", {
        value: "en-US",
        configurable: true,
      });
      expect(getLang()).toBe("en");
    });

    it("retorna 'es' cuando navigator.language empieza con 'es'", () => {
      Object.defineProperty(navigator, "language", {
        value: "es-MX",
        configurable: true,
      });
      expect(getLang()).toBe("es");
    });

    it("retorna 'ja' cuando navigator.language empieza con 'ja'", () => {
      Object.defineProperty(navigator, "language", {
        value: "ja-JP",
        configurable: true,
      });
      expect(getLang()).toBe("ja");
    });

    it("retorna 'de' cuando navigator.language empieza con 'de'", () => {
      Object.defineProperty(navigator, "language", {
        value: "de-DE",
        configurable: true,
      });
      expect(getLang()).toBe("de");
    });

    it("retorna el idioma por defecto cuando navigator no es soportado", () => {
      Object.defineProperty(navigator, "language", {
        value: "fr-FR",
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
      Object.defineProperty(navigator, "language", {
        value: "fr-FR",
        configurable: true,
      });
      expect(getLang()).toBe("en");
    });

    it("localStorage tiene prioridad sobre navigator.language", () => {
      Object.defineProperty(navigator, "language", {
        value: "en-US",
        configurable: true,
      });
      localStorage.setItem("lang", "es");
      expect(getLang()).toBe("es");
    });
  });

  describe("setLang", () => {
    it("guarda en localStorage", () => {
      setLang("es");
      expect(localStorage.getItem("lang")).toBe("es");
    });

    it("guarda el idioma por defecto si el lenguaje no es soportado", () => {
      setLang("xx");
      expect(localStorage.getItem("lang")).toBe("en");
    });

    it("actualiza document.documentElement.lang", () => {
      setLang("es");
      expect(document.documentElement.lang).toBe("es");
    });

    it("dispatch event lang-change", () => {
      const handler = vi.fn();
      document.addEventListener("lang-change", handler);
      setLang("es");
      expect(handler).toHaveBeenCalled();
      document.removeEventListener("lang-change", handler);
    });

    it("el event detail contiene el lang correcto", () => {
      let detail: string = "";
      document.addEventListener("lang-change", ((e: CustomEvent) => {
        detail = e.detail.lang;
      }) as EventListener);
      setLang("es");
      expect(detail).toBe("es");
    });
  });

  describe("updateTranslations", () => {
    it("muestra elementos con data-lang correcto", () => {
      document.body.innerHTML = `
        <span data-lang="es">Hola</span>
        <span data-lang="en">Hello</span>
      `;
      localStorage.setItem("lang", "en");
      updateTranslations();

      const esEl = document.querySelector('[data-lang="es"]') as HTMLElement;
      const enEl = document.querySelector('[data-lang="en"]') as HTMLElement;
      expect(esEl.style.display).toBe("none");
      expect(enEl.style.display).toBe("");
    });

    it("oculta elementos con data-lang incorrecto", () => {
      document.body.innerHTML = `
        <span data-lang="es">Hola</span>
        <span data-lang="en">Hello</span>
      `;
      localStorage.setItem("lang", "es");
      updateTranslations();

      const esEl = document.querySelector('[data-lang="es"]') as HTMLElement;
      const enEl = document.querySelector('[data-lang="en"]') as HTMLElement;
      expect(esEl.style.display).toBe("");
      expect(enEl.style.display).toBe("none");
    });
  });
});

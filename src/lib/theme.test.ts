import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getTheme,
  setTheme,
  getSystemTheme,
  applyTheme,
  watchSystemTheme,
} from "./theme";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  describe("getTheme", () => {
    it("retorna 'system' por defecto", () => {
      expect(getTheme()).toBe("system");
    });

    it("retorna valor de localStorage si existe", () => {
      localStorage.setItem("theme", "light");
      expect(getTheme()).toBe("light");
    });

    it("retorna 'dark' si está guardado", () => {
      localStorage.setItem("theme", "dark");
      expect(getTheme()).toBe("dark");
    });
  });

  describe("setTheme", () => {
    it("guarda en localStorage", () => {
      setTheme("light");
      expect(localStorage.getItem("theme")).toBe("light");
    });

    it("guarda 'dark' en localStorage", () => {
      setTheme("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("guarda 'system' en localStorage", () => {
      setTheme("system");
      expect(localStorage.getItem("theme")).toBe("system");
    });
  });

  describe("getSystemTheme", () => {
    it("retorna 'light' cuando prefers-color-scheme no es dark", () => {
      Object.defineProperty(window, "matchMedia", {
        value: vi.fn().mockReturnValue({ matches: false }),
        configurable: true,
      });
      expect(getSystemTheme()).toBe("light");
    });

    it("retorna 'dark' cuando prefers-color-scheme es dark", () => {
      Object.defineProperty(window, "matchMedia", {
        value: vi.fn().mockReturnValue({ matches: true }),
        configurable: true,
      });
      expect(getSystemTheme()).toBe("dark");
    });
  });

  describe("applyTheme", () => {
    it("agrega clase 'light' al html", () => {
      applyTheme("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("agrega clase 'dark' al html", () => {
      applyTheme("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });

    it("limpia clases anteriores al cambiar tema", () => {
      applyTheme("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      applyTheme("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("usa getTheme() cuando no se pasa argumento", () => {
      localStorage.setItem("theme", "light");
      applyTheme();
      expect(document.documentElement.classList.contains("light")).toBe(true);
    });

    it("resuelve 'system' a dark o light según preferencia", () => {
      Object.defineProperty(window, "matchMedia", {
        value: vi.fn().mockReturnValue({ matches: true }),
        configurable: true,
      });
      applyTheme("system");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("resuelve 'system' a light cuando no prefiere dark", () => {
      Object.defineProperty(window, "matchMedia", {
        value: vi.fn().mockReturnValue({ matches: false }),
        configurable: true,
      });
      applyTheme("system");
      expect(document.documentElement.classList.contains("light")).toBe(true);
    });
  });

  describe("watchSystemTheme", () => {
    it("solo re-aplica el tema cuando el guardado es 'system'", () => {
      const addEventListener = vi.fn();
      Object.defineProperty(window, "matchMedia", {
        value: vi.fn(() => ({ matches: true, addEventListener })),
        configurable: true,
      });

      // Tema 'system': el cambio del SO re-aplica el esquema
      localStorage.setItem("theme", "system");
      applyTheme("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);

      watchSystemTheme();
      const onChange = addEventListener.mock.calls[0]?.[1] as () => void;
      onChange();

      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);

      // Tema explícito: el cambio del SO no fuerza nada
      localStorage.setItem("theme", "light");
      applyTheme("dark");
      onChange();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });
  });
});

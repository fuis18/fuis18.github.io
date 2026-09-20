import { describe, it, expect } from "vitest";
import { resolveBadges, tintForTheme, tintSvg, toDataUri } from "./badges";

describe("badges", () => {
  describe("tintSvg", () => {
    it("reemplaza currentColor en fill y stroke", () => {
      const svg = '<path fill="currentColor" stroke="currentColor"/>';
      expect(tintSvg(svg, "#e8e8e8")).toBe(
        '<path fill="#e8e8e8" stroke="#e8e8e8"/>',
      );
    });

    it("no altera SVGs con color fijo", () => {
      const svg = '<path fill="#61dafb"/>';
      expect(tintSvg(svg, "#e8e8e8")).toBe(svg);
    });
  });

  describe("toDataUri", () => {
    it("codifica el SVG como data URI", () => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"/>';
      const uri = toDataUri(svg);
      expect(uri.startsWith("data:image/svg+xml;charset=utf-8,")).toBe(true);
      expect(decodeURIComponent(uri.split(",")[1])).toBe(svg);
    });

    it("tinta currentColor al pasar color", () => {
      const svg = '<path fill="currentColor"/>';
      const uri = toDataUri(svg, "#1a1a1a");
      expect(decodeURIComponent(uri.split(",")[1])).toBe(
        '<path fill="#1a1a1a"/>',
      );
    });
  });

  describe("tintForTheme", () => {
    it("usa gris claro #ccc en tema dark y casi negro #0a0a0a en light", () => {
      expect(tintForTheme(false)).toBe("#0a0a0a");
      expect(tintForTheme(true)).toBe("#ccc");
    });
  });

  describe("resolveBadges", () => {
    it("agrupa base y variante -dark por nombre", () => {
      const files = {
        "/src/assets/svg-badges/linux-logo.svg": "<linux/>",
        "/src/assets/svg-badges/linux-logo-dark.svg": "<linux-dark/>",
        "/src/assets/svg-badges/ratatui-logo.svg": "<ratatui/>",
      };
      expect(resolveBadges(files)).toEqual({
        linux: { base: "<linux/>", dark: "<linux-dark/>" },
        ratatui: { base: "<ratatui/>" },
      });
    });

    it("no depende del orden del glob: -dark antes que la base", () => {
      // import.meta.glob ordena alfabéticamente y "-dark.svg" < ".svg" porque
      // "-" (0x2d) precede a "." (0x2e). La base no debe caer en la variante dark.
      const files = {
        "/src/assets/svg-badges/archlinux-dark.svg": "<arch-dark/>",
        "/src/assets/svg-badges/archlinux.svg": "<arch/>",
        "/src/assets/svg-badges/brave-logo-dark.svg": "<brave-dark/>",
        "/src/assets/svg-badges/brave-logo.svg": "<brave/>",
      };
      expect(resolveBadges(files)).toEqual({
        archlinux: { base: "<arch/>", dark: "<arch-dark/>" },
        brave: { base: "<brave/>", dark: "<brave-dark/>" },
      });
    });

    it("maneja archivos sin sufijo -logo", () => {
      const files = {
        "/src/assets/svg-badges/archlinux.svg": "<arch/>",
        "/src/assets/svg-badges/archlinux-dark.svg": "<arch-dark/>",
      };
      expect(resolveBadges(files)).toEqual({
        archlinux: { base: "<arch/>", dark: "<arch-dark/>" },
      });
    });
  });
});

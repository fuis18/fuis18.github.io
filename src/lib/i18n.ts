import type { Localized } from "@/types";
import {
  baseLocale,
  getLocale,
  locales,
  setLocale,
  toLocale,
} from "@/paraglide/runtime";

export const LANGS = locales;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = baseLocale as Lang;

export function getLang(): Lang {
  return getLocale() as Lang;
}

/** Normaliza un valor a un idioma soportado (o al idioma base). */
function resolveLang(lang: string): Lang {
  return toLocale(lang) ?? DEFAULT_LANG;
}

/** Aplica el idioma guardado/detectado y dispara el primer re-render. */
export function initLang(): void {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.dispatchEvent(new CustomEvent("lang-change", { detail: { lang } }));
}

/** Cambia el idioma activo (persistido en localStorage por paraglide). */
export function setLang(lang: string): void {
  const next = resolveLang(lang);
  setLocale(next, { reload: false });
  document.documentElement.lang = next;
  document.dispatchEvent(
    new CustomEvent("lang-change", { detail: { lang: next } }),
  );
}

/** Selecciona el valor localizado para el idioma activo (con fallback). */
export function pickLocalized<T>(localized: Localized<T>): T {
  return localized[getLang()] ?? localized[DEFAULT_LANG];
}

const syncers = new Set<() => void>();
let bound = false;

/**
 * Registra un re-render de texto que corre de inmediato (primer render)
 * y en cada cambio de idioma (`lang-change`).
 */
export function syncOnLangChange(fn: () => void): void {
  syncers.add(fn);
  if (!bound) {
    bound = true;
    document.addEventListener("lang-change", () => {
      syncers.forEach((syncer) => syncer());
    });
  }
  fn();
}

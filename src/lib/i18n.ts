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

export const GRAPH_MODE_EVENT = "maincard:graph-mode";

export function getLang(): Lang {
  return getLocale() as Lang;
}

function resolveLang(lang: string): Lang {
  return toLocale(lang) ?? DEFAULT_LANG;
}

export function initLang(): void {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.dispatchEvent(new CustomEvent("lang-change", { detail: { lang } }));
}

export function setLang(lang: string): void {
  const next = resolveLang(lang);
  setLocale(next, { reload: false });
  document.documentElement.lang = next;
  document.dispatchEvent(
    new CustomEvent("lang-change", { detail: { lang: next } }),
  );
}

export function pickLocalized<T>(localized: Localized<T>): T {
  return localized[getLang()] ?? localized[DEFAULT_LANG];
}

const syncers = new Set<() => void>();
let bound = false;

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

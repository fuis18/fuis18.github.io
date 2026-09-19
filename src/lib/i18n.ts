import type { Localized } from "@/types";

export const LANGS = ["en", "es", "jp", "de"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function resolveLang(): Lang {
  const stored = localStorage.getItem("lang");
  if (stored && isLang(stored)) return stored;

  const detected = LANGS.find((lang) =>
    navigator.language.toLowerCase().startsWith(lang),
  );
  return detected ?? DEFAULT_LANG;
}

export function getLang(): string {
  return resolveLang();
}

export function setLang(lang: string) {
  const next = isLang(lang) ? lang : DEFAULT_LANG;
  localStorage.setItem("lang", next);
  document.documentElement.lang = next;
  document.dispatchEvent(
    new CustomEvent("lang-change", { detail: { lang: next } }),
  );
}

export function updateTranslations() {
  const lang = getLang();
  document.querySelectorAll<HTMLElement>("[data-lang]").forEach((el) => {
    el.style.display = el.dataset.lang === lang ? "" : "none";
  });
}

export function withFallback<T>(localized: Localized<T>): Localized<T> {
  const fallback = localized[DEFAULT_LANG];
  return Object.fromEntries(
    LANGS.map((lang) => [lang, localized[lang] ?? fallback]),
  ) as Localized<T>;
}

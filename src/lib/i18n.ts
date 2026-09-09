export function getLang(): string {
  return (
    localStorage.getItem("lang") ||
    (navigator.language.startsWith("es") ? "es" : "en")
  );
}

export function setLang(lang: string) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.dispatchEvent(
    new CustomEvent("lang-change", { detail: { lang } })
  );
}

export function updateTranslations() {
  const lang = getLang();
  document.querySelectorAll<HTMLElement>("[data-lang]").forEach((el) => {
    el.style.display = el.dataset.lang === lang ? "" : "none";
  });
}

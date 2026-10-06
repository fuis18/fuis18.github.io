type Theme = "dark" | "light" | "system";

const STORAGE_KEY = "theme";

export function getTheme(): Theme {
  if (typeof localStorage === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
}

export function setTheme(theme: Theme): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme?: Theme): void {
  const root = document.documentElement;
  const resolved = theme || getTheme();

  root.classList.remove("light", "dark");

  if (resolved === "system") {
    root.classList.add(getSystemTheme());
  } else {
    root.classList.add(resolved);
  }
}

let watchingSystemTheme = false;

export function watchSystemTheme(): void {
  if (typeof window === "undefined" || watchingSystemTheme) return;
  watchingSystemTheme = true;

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", () => {
    if (getTheme() === "system") applyTheme("system");
  });
}

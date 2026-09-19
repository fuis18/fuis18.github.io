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

/**
 * Re-aplica el tema cuando el SO cambia de esquema de color,
 * siempre que el tema guardado sea "system".
 */
export function watchSystemTheme(): void {
  if (typeof window === "undefined" || watchingSystemTheme) return;
  watchingSystemTheme = true;

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (getTheme() === "system") applyTheme("system");
  };

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onChange);
  } else {
    media.addListener?.(onChange);
  }
}

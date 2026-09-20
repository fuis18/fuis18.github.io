/** Assets SVG disponibles para un badge (nombre base, sin sufijo `-logo`). */
export interface BadgeAssets {
  /** Logo a color (Devicon) usado en el estado normal del nodo. */
  base: string;
  /** Variante monocromática `-dark` (Simple Icons/Arcticons) para hover/click. */
  dark?: string;
}

export type BadgeState = "base" | "hover";

/** Reemplaza `currentColor` (en `fill` y `stroke`) por un color concreto. */
export function tintSvg(svg: string, color: string): string {
  return svg.replaceAll("currentColor", color);
}

/** Convierte un SVG a data URI UTF-8, opcionalmente tintado. */
export function toDataUri(svg: string, tint?: string): string {
  const source = tint ? tintSvg(svg, tint) : svg;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
}

/**
 * Color de tinte para la variante `-dark` según el tema del sitio.
 * La imagen se dibuja directamente sobre el fondo del canvas (shape "image"
 * sin círculo), así que el tinte contrasta con el fondo del tema:
 * gris claro `#ccc` en tema dark, casi negro `#0a0a0a` en tema light
 * (coincide con `--graph-node-hover`, el color de hover/selección).
 */
export function tintForTheme(isDarkTheme: boolean): string {
  return isDarkTheme ? "#ccc" : "#0a0a0a";
}

/**
 * Indexa los archivos de `svg-badges` en `{ name: { base, dark? } }`.
 * Las claves del glob son rutas (p. ej. `/src/assets/svg-badges/linux-logo.svg`);
 * se agrupa por nombre de badge quitando los sufijos `-dark` y `-logo`.
 *
 * La asignación es robusta al orden de las claves: `import.meta.glob` ordena
 * alfabéticamente y la variante `-dark` (p. ej. `linux-logo-dark.svg`) precede
 * a la base (`-` < `.`), así que se asigna por sufijo y no por "primera clave".
 */
export function resolveBadges(
  files: Record<string, string>,
): Record<string, BadgeAssets> {
  const badges: Record<string, Partial<BadgeAssets>> = {};
  for (const path of Object.keys(files)) {
    const fileName = path.split("/").pop();
    if (!fileName) continue;

    const isDark = fileName.endsWith("-dark.svg");
    const name = fileName
      .replace(/\.svg$/, "")
      .replace(/-dark$/, "")
      .replace(/-logo$/, "");

    const entry: Partial<BadgeAssets> = (badges[name] ??= {});
    if (isDark) entry.dark = files[path];
    else entry.base = files[path];
  }
  return badges as Record<string, BadgeAssets>;
}

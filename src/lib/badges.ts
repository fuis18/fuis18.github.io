export interface BadgeAssets {
  base: string;
  dark?: string;
}

export type BadgeState = "base" | "hover";

export function tintSvg(svg: string, color: string): string {
  return svg.replaceAll("currentColor", color);
}

export function toDataUri(svg: string, tint?: string): string {
  const source = tint ? tintSvg(svg, tint) : svg;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
}

export function tintForTheme(isDarkTheme: boolean): string {
  return isDarkTheme ? "#ccc" : "#0a0a0a";
}

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

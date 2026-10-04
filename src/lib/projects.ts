import type { Localized } from "@/types";
import { LANGS, DEFAULT_LANG } from "@/lib/i18n";

type LocalizedEntry = {
  title: string;
  description: string;
  date: string;
};

export const PROJECT_ORDER = [
  "portafolio",
  "software",
  "ccna",
  "dotfiles",
  "spotify",
  "pos",
  "yanaira",
  "healthy",
  "all-projects",
] as const;

type ProjectFile = {
  repo: string;
  website: string | null;
  image?: string | null;
  tags: string[];
} & Localized<LocalizedEntry>;

const modules = import.meta.glob<{ default: ProjectFile }>(
  "../data/projects/*.json",
  { eager: true },
);

function slugOf(path: string): string {
  const base = path.slice(path.lastIndexOf("/") + 1);
  return base.endsWith(".json") ? base.slice(0, -".json".length) : base;
}

export type ProjectData = {
  image: string | null;
  repo: string;
  website: string | null;
  tags: string[];
  title: Localized<string>;
  description: Localized<string>;
  date: Localized<string>;
};

function pick(
  entry: ProjectFile,
  key: keyof LocalizedEntry,
): Localized<string> {
  return Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      entry[lang]?.[key] ?? entry[DEFAULT_LANG]?.[key] ?? "",
    ]),
  ) as Localized<string>;
}

export const projects: ProjectData[] = Object.entries(modules)
  .toSorted(([pathA], [pathB]) => {
    const indexA = PROJECT_ORDER.indexOf(slugOf(pathA) as never);
    const indexB = PROJECT_ORDER.indexOf(slugOf(pathB) as never);
    const rankA = indexA === -1 ? Infinity : indexA;
    const rankB = indexB === -1 ? Infinity : indexB;
    return rankA - rankB;
  })
  .map(([, module]) => {
    const entry = module.default;
    return {
      image: entry.image ?? null,
      repo: entry.repo,
      website: entry.website,
      tags: entry.tags,
      title: pick(entry, "title"),
      description: pick(entry, "description"),
      date: pick(entry, "date"),
    };
  });

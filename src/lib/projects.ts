import type { Localized } from "@/types";
import { LANGS, DEFAULT_LANG } from "@/lib/i18n";

type LocalizedEntry = {
  title: string;
  description: string;
  date: string;
};

type ProjectFile = {
  repo: string;
  website: string | null;
  image?: string | null;
  tags: string[];
} & Localized<LocalizedEntry>;

const modules = import.meta.glob<ProjectFile>("../data/projects/*.json", {
  eager: true,
});

export type ProjectData = {
  image: string | null;
  repo: string;
  website: string | null;
  tags: string[];
  title: Localized<string>;
  description: Localized<string>;
  date: Localized<string>;
};

function pick(entry: ProjectFile, key: keyof LocalizedEntry): Localized<string> {
  return Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      entry[lang]?.[key] ?? entry[DEFAULT_LANG]?.[key] ?? "",
    ]),
  ) as Localized<string>;
}

export const projects: ProjectData[] = Object.values(modules).map((entry) => ({
  image: entry.image ?? null,
  repo: entry.repo,
  website: entry.website,
  tags: entry.tags,
  title: pick(entry, "title"),
  description: pick(entry, "description"),
  date: pick(entry, "date"),
}));
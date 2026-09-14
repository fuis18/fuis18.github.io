import type { Localized } from "@/types";
import projectsEs from "@/data/projects.es.json";
import projectsEn from "@/data/projects.en.json";

type ProjectEntry = (typeof projectsEn)[number];
type LocalizedKeys = "title" | "description" | "date";

const dictionaries: Record<string, ProjectEntry[]> = {
  es: projectsEs,
  en: projectsEn,
};

export const LANG_KEYS = Object.keys(dictionaries);

export type ProjectData = {
  image: string;
  href: string;
  tags: string[];
  title: Localized<string>;
  description: Localized<string>;
  date: Localized<string>;
};

function pick(index: number, key: LocalizedKeys): Localized<string> {
  return Object.fromEntries(
    LANG_KEYS.map((lang) => [lang, dictionaries[lang][index][key]]),
  );
}

export const projects: ProjectData[] = projectsEn.map((entry, index) => ({
  image: entry.image,
  href: entry.href,
  tags: entry.tags,
  title: pick(index, "title"),
  description: pick(index, "description"),
  date: pick(index, "date"),
}));
import { getCollection, type CollectionEntry } from "astro:content";
import type { Localized } from "@/types";
import { DEFAULT_LANG, LANGS, type Lang } from "@/lib/i18n";
import type { BlogPostPayload } from "@/lib/blogClient";

const WORDS_PER_MINUTE = 200;

export const POST_ORDER = [
  "optimizing-linux",
  "my-beginnings",
] as const;

function rankOf(slug: string): number {
  const index = POST_ORDER.indexOf(slug as never);
  return index === -1 ? Infinity : index;
}

export type BlogPost = {
  slug: string;
  date: Date;
  isoDate: string;
  readingTime: number;
  tags: Localized<string[]>;
  langs: string[];
  title: Localized<string>;
  description: Localized<string>;
  dateLabel: Localized<string>;
};

export type BlogPostWithEntry = {
  post: BlogPost;
  entry: CollectionEntry<"blog">;
  entries: Localized<CollectionEntry<"blog">>;
};

type PostId = {
  lang: string;
  slug: string;
};

function splitId(id: string): PostId {
  const cut = id.indexOf("/");
  if (cut === -1) return { lang: DEFAULT_LANG, slug: id };
  return { lang: id.slice(0, cut), slug: id.slice(cut + 1) };
}

function formatDate(date: Date): Localized<string> {
  return Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(date),
    ]),
  ) as Localized<string>;
}

function pick(
  versions: Map<string, CollectionEntry<"blog">>,
  lang: string,
  key: "title" | "description",
): string {
  return (
    versions.get(lang)?.data[key] ?? versions.get(DEFAULT_LANG)?.data[key] ?? ""
  );
}

function pickTags(
  versions: Map<string, CollectionEntry<"blog">>,
  lang: string,
  fallback: string[],
): string[] {
  const tags = versions.get(lang)?.data.tags ?? [];
  return tags.length > 0 ? tags : fallback;
}

function estimateReadingTime(body: string | undefined): number {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Base primero y el resto en el orden de los idiomas soportados. */
function orderLangs(versions: Map<string, CollectionEntry<"blog">>): string[] {
  return [...versions.keys()].toSorted((a, b) => {
    if (a === DEFAULT_LANG) return -1;
    if (b === DEFAULT_LANG) return 1;
    return LANGS.indexOf(a as Lang) - LANGS.indexOf(b as Lang);
  });
}

function toPost(
  slug: string,
  versions: Map<string, CollectionEntry<"blog">>,
): BlogPostWithEntry {
  const base = versions.get(DEFAULT_LANG) ?? versions.values().next().value!;
  const { date, tags: fallbackTags, readingTime } = base.data;

  return {
    post: {
      slug,
      date,
      isoDate: date.toISOString().slice(0, 10),
      readingTime: readingTime ?? estimateReadingTime(base.body),
      tags: Object.fromEntries(
        LANGS.map((lang) => [lang, pickTags(versions, lang, fallbackTags)]),
      ) as Localized<string[]>,
      langs: orderLangs(versions),
      title: Object.fromEntries(
        LANGS.map((lang) => [lang, pick(versions, lang, "title")]),
      ) as Localized<string>,
      description: Object.fromEntries(
        LANGS.map((lang) => [lang, pick(versions, lang, "description")]),
      ) as Localized<string>,
      dateLabel: formatDate(date),
    },
    entry: base,
    entries: Object.fromEntries(versions),
  };
}

async function groupBySlug(): Promise<
  Map<string, Map<string, CollectionEntry<"blog">>>
> {
  const entries = await getCollection("blog");
  const grouped = new Map<string, Map<string, CollectionEntry<"blog">>>();
  for (const entry of entries) {
    const { lang, slug } = splitId(entry.id);
    if (!grouped.has(slug)) grouped.set(slug, new Map());
    grouped.get(slug)!.set(lang, entry);
  }
  return grouped;
}

export async function getBlogPostsWithEntries(): Promise<BlogPostWithEntry[]> {
  const grouped = await groupBySlug();
  return [...grouped.entries()]
    .map(([slug, versions]) => toPost(slug, versions))
    .toSorted(
      (a, b) =>
        rankOf(a.post.slug) - rankOf(b.post.slug) ||
        b.post.date.getTime() - a.post.date.getTime(),
    );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await getBlogPostsWithEntries()).map(({ post }) => post);
}

export async function getBlogPost(
  slug: string,
): Promise<BlogPostWithEntry | undefined> {
  const versions = (await groupBySlug()).get(slug);
  return versions ? toPost(slug, versions) : undefined;
}

export type { BlogPostPayload } from "@/lib/blogClient";

export function toPayload(post: BlogPost): BlogPostPayload {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    dateLabel: post.dateLabel,
    readingTime: post.readingTime,
    tags: post.tags,
    langs: post.langs,
  };
}

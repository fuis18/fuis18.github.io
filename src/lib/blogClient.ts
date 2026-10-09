import { m } from "@/paraglide/messages";
import { DEFAULT_LANG, getLang } from "@/lib/i18n";
import type { Localized } from "@/types";

export type BlogPostPayload = {
  slug: string;
  title: Localized<string>;
  description: Localized<string>;
  dateLabel: Localized<string>;
  readingTime: Localized<number>;
  tags: Localized<string[]>;
  langs: string[];
};

export function serializePayload(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function readJson<T>(selector: string): T | undefined {
  const el = document.querySelector<HTMLScriptElement>(selector);
  if (!el?.textContent) return undefined;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return undefined;
  }
}

export function readPayload<T>(selector: string): T | undefined {
  return readJson<T>(selector);
}

export function readPayloadList<T>(selector: string): T[] {
  const data = readJson<T[]>(selector);
  return Array.isArray(data) ? data : [];
}

function localize(localized: Localized<string>): string {
  return localized[getLang()] ?? localized[DEFAULT_LANG] ?? "";
}

function localizeTags(tags: Localized<string[]>): string[] {
  return tags[getLang()] ?? tags[DEFAULT_LANG] ?? [];
}

function localizeNumber(value: Localized<number>): number {
  return value[getLang()] ?? value[DEFAULT_LANG] ?? 0;
}

export function resolveBodyLang(
  langs: string[],
  current: string = getLang(),
): string {
  if (langs.includes(current)) return current;
  return langs.includes(DEFAULT_LANG)
    ? DEFAULT_LANG
    : (langs[0] ?? DEFAULT_LANG);
}

function renderTags(host: HTMLElement, tags: string[]): void {
  const actuales = [...host.querySelectorAll(".tag")].map(
    (span) => span.textContent,
  );
  const iguales =
    actuales.length === tags.length &&
    actuales.every((tag, i) => tag === tags[i]);

  if (!iguales) {
    host.replaceChildren(
      ...tags.map((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        return span;
      }),
    );
  }

  host.style.display = tags.length > 0 ? "" : "none";
}

export function applyPostFields(root: ParentNode, post: BlogPostPayload): void {
  root.querySelectorAll<HTMLElement>("[data-post-field]").forEach((el) => {
    switch (el.dataset.postField) {
      case "title":
        el.textContent = localize(post.title);
        break;
      case "description":
        el.textContent = localize(post.description);
        break;
      case "date":
        el.textContent = localize(post.dateLabel);
        break;
      case "tags":
        renderTags(el, localizeTags(post.tags));
        break;
      case "reading-time":
        el.textContent = m.blog_read_time({
          minutes: localizeNumber(post.readingTime),
        });
        break;
      case "back":
        el.textContent = m.blog_back();
        break;
    }
  });
}

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();

function key(slug: string, lang: string): string {
  return `${slug}/${lang}`;
}

export function fragmentUrl(slug: string, lang: string): string {
  return `/fragments/blog/${encodeURIComponent(slug)}/${encodeURIComponent(lang)}/index.html`;
}

export function primeBody(slug: string, lang: string, html: string): void {
  const k = key(slug, lang);
  if (!cache.has(k)) cache.set(k, html);
}

export function getCachedBody(slug: string, lang: string): string | undefined {
  return cache.get(key(slug, lang));
}

export async function loadBody(
  slug: string,
  lang: string,
): Promise<string | null> {
  const k = key(slug, lang);
  const cached = cache.get(k);
  if (cached !== undefined) return cached;

  const pending = inflight.get(k);
  if (pending) return pending;

  const request = (async () => {
    try {
      const res = await fetch(fragmentUrl(slug, lang));
      if (!res.ok) return null;
      const doc = new DOMParser().parseFromString(
        await res.text(),
        "text/html",
      );
      const prose = doc.querySelector(".prose");
      if (!prose) return null;
      const html = prose.outerHTML;
      cache.set(k, html);
      return html;
    } catch {
      return null;
    } finally {
      inflight.delete(k);
    }
  })();

  inflight.set(k, request);
  return request;
}

export function prefetchBodies(slug: string, langs: string[]): void {
  for (const lang of langs) {
    if (cache.has(key(slug, lang))) continue;
    void loadBody(slug, lang);
  }
}

export function idlePrefetch(slug: string, langs: string[]): void {
  if (langs.length === 0) return;
  const run = () => prefetchBodies(slug, langs);
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 1500);
  }
}

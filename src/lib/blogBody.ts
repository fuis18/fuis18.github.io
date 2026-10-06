/**
 * Carga del cuerpo del post en un idioma distinto al base.
 *
 * El HTML servido trae solo el cuerpo del idioma base (piso de SEO y no-JS).
 * Cuando el idioma activo es otro, el cliente pide su fragmento y lo mete en el
 * mismo contenedor: en todo momento hay un solo cuerpo en el DOM.
 *
 * - `primeBody` guarda el cuerpo base antes de que se sobrescriba, para volver
 *   a él sin pedir red.
 * - La caché vive en memoria del módulo: por idioma y post, sin invalidar.
 * - `requestIdleCallback` deja los otros idiomas descargados antes de que el
 *   usuario cambie, para que el cambio no espere red.
 */

/** HTML ya descargado o ya presente en el DOM, por `slug/lang`. */
const cache = new Map<string, string>();
/** Peticiones en vuelo, para no pedir dos veces lo mismo. */
const inflight = new Map<string, Promise<string | null>>();

function key(slug: string, lang: string): string {
  return `${slug}/${lang}`;
}

/**
 * `index.html` explícito en la URL: funciona en cualquier host estático, sin
 * depender de que el servidor resuelva el directorio.
 */
export function fragmentUrl(slug: string, lang: string): string {
  return `/fragments/blog/${encodeURIComponent(slug)}/${encodeURIComponent(lang)}/index.html`;
}

/** Guarda el cuerpo que ya está en el DOM (el del idioma base). */
export function primeBody(slug: string, lang: string, html: string): void {
  const k = key(slug, lang);
  if (!cache.has(k)) cache.set(k, html);
}

/** HTML del cuerpo si ya lo tenemos en memoria. */
export function getCachedBody(slug: string, lang: string): string | undefined {
  return cache.get(key(slug, lang));
}

/**
 * Devuelve el `.prose` del fragmento, o `null` si no existe o falla la red.
 * Nunca lanza: un fallo deja el cuerpo que ya estaba.
 */
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

/** Descarga los idiomas que faltan, sin esperar al momento del cambio. */
export function prefetchBodies(slug: string, langs: string[]): void {
  for (const lang of langs) {
    if (cache.has(key(slug, lang))) continue;
    void loadBody(slug, lang);
  }
}

/** Igual que `prefetchBodies`, pero cuando el navegador está libre. */
export function idlePrefetch(slug: string, langs: string[]): void {
  if (langs.length === 0) return;
  const run = () => prefetchBodies(slug, langs);
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 1500);
  }
}

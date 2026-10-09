import { m } from "@/paraglide/messages";
import { DEFAULT_LANG, getLang } from "@/lib/i18n";
import type { Localized } from "@/types";

/**
 * Módulo isomórfico del blog: lo usan el frontmatter de las páginas (build) y
 * los `<script>` de cliente. Por eso no puede importar `astro:content` — el tipo
 * del payload vive acá y `src/lib/blog.ts` lo importa desde este lado.
 */
export type BlogPostPayload = {
  slug: string;
  title: Localized<string>;
  description: Localized<string>;
  dateLabel: Localized<string>;
  readingTime: number;
  /** Tags localizados por idioma (con el base como fallback). */
  tags: Localized<string[]>;
  /** Idiomas del post que tienen archivo propio (con el base primero). */
  langs: string[];
};

/**
 * Serializa para un `<script type="application/json">`: un `<` sin escapar
 * cerraría el script, y los frontmatter son texto libre. Es el único lugar del
 * proyecto donde hace falta ese escape.
 */
export function serializePayload(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Lee el payload serializado en el DOM por `set:html` (cliente). */
function readJson<T>(selector: string): T | undefined {
  const el = document.querySelector<HTMLScriptElement>(selector);
  if (!el?.textContent) return undefined;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return undefined;
  }
}

/** Payload de una sola entrada (página de post). */
export function readPayload<T>(selector: string): T | undefined {
  return readJson<T>(selector);
}

/** Payload de la lista (página de índice). `[]` si no está o no es una lista. */
export function readPayloadList<T>(selector: string): T[] {
  const data = readJson<T[]>(selector);
  return Array.isArray(data) ? data : [];
}

/** Valor por idioma con fallback al idioma base. */
function localize(localized: Localized<string>): string {
  return localized[getLang()] ?? localized[DEFAULT_LANG] ?? "";
}

/** Tags por idioma con fallback al idioma base. */
function localizeTags(tags: Localized<string[]>): string[] {
  return tags[getLang()] ?? tags[DEFAULT_LANG] ?? [];
}

/**
 * Idioma del cuerpo a mostrar: el activo si el post lo tiene, y si no el base
 * (`ja` y `de` no tienen archivo propio). Nunca devuelve un idioma que no
 * exista, así que el cuerpo y el encabezado no pueden quedar desalineados.
 */
export function resolveBodyLang(
  langs: string[],
  current: string = getLang(),
): string {
  if (langs.includes(current)) return current;
  return langs.includes(DEFAULT_LANG)
    ? DEFAULT_LANG
    : (langs[0] ?? DEFAULT_LANG);
}

/**
 * Repinta el contenedor de tags del post.
 *
 * Es el único campo que no se escribe con `textContent`: son varios nodos y
 * ninguno lleva `data-textfx`, así que no participan de la animación de tecleo
 * y reconstruirlos es inocuo.
 */
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

  // `.tags { display: flex }` pisa el atributo `hidden`, así que va inline.
  host.style.display = tags.length > 0 ? "" : "none";
}

/**
 * Escribe los campos del post dentro de `root`.
 *
 * Se muta `textContent` en vez de reemplazar el nodo: es la condición para que
 * `rebuildText` desconstruya el texto viejo y tipee el nuevo en el cambio de
 * idioma. Si el nodo se reemplazara, el `Map` de snapshots de `Layout.astro` no
 * lo encontraría y el texto se tipearía de cero.
 */
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
        el.textContent = m.blog_read_time({ minutes: post.readingTime });
        break;
      case "back":
        el.textContent = m.blog_back();
        break;
    }
  });
}

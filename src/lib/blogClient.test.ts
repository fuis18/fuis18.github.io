import { describe, it, expect, beforeEach } from "vitest";
import {
  applyPostFields,
  readPayload,
  readPayloadList,
  serializePayload,
  type BlogPostPayload,
} from "./blogClient";
import { setLang } from "./i18n";

const post: BlogPostPayload = {
  slug: "my-beginnings",
  title: { en: "My first post", es: "Mi primer post" },
  description: { en: "Introductory", es: "Introductorio" },
  dateLabel: { en: "January 1, 2026", es: "1 de enero de 2026" },
  readingTime: 4,
};

function mount(): HTMLElement {
  document.body.innerHTML = `
    <div data-post-index="0">
      <h2 data-post-field="title"></h2>
      <p data-post-field="description"></p>
      <time data-post-field="date"></time>
      <span data-post-field="reading-time"></span>
    </div>
  `;
  return document.querySelector<HTMLElement>("[data-post-index]")!;
}

describe("blogClient", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  describe("serializePayload", () => {
    it("escapa '<' para que un frontmatter no cierre el script", () => {
      const json = serializePayload({ title: "</script><img>" });

      expect(json).not.toContain("<");
      expect(json).toContain("\\u003c");
      // Y sigue siendo el mismo dato una vez parseado
      expect(JSON.parse(json).title).toBe("</script><img>");
    });

    it("no toca el resto del JSON", () => {
      expect(JSON.parse(serializePayload(post))).toEqual(post);
    });
  });

  describe("readPayload", () => {
    it("lee el objeto de la página de post", () => {
      document.body.innerHTML = `<script type="application/json" data-post-payload>${serializePayload(post)}</script>`;

      expect(readPayload("[data-post-payload]")).toEqual(post);
    });

    it("devuelve undefined si no está o si el JSON está roto", () => {
      expect(readPayload("[data-post-payload]")).toBeUndefined();

      document.body.innerHTML = `<script type="application/json" data-post-payload>{roto</script>`;
      expect(readPayload("[data-post-payload]")).toBeUndefined();
    });
  });

  describe("readPayloadList", () => {
    it("lee y parsea la lista del DOM", () => {
      document.body.innerHTML = `<script type="application/json" data-blog-payload>${serializePayload([post])}</script>`;

      expect(readPayloadList("[data-blog-payload]")).toEqual([post]);
    });

    it("devuelve [] si no está, si está roto o si no es una lista", () => {
      expect(readPayloadList("[data-blog-payload]")).toEqual([]);

      document.body.innerHTML = `<script type="application/json" data-blog-payload>{roto</script>`;
      expect(readPayloadList("[data-blog-payload]")).toEqual([]);

      // El payload de un post es un objeto, no una lista
      document.body.innerHTML = `<script type="application/json" data-blog-payload>${serializePayload(post)}</script>`;
      expect(readPayloadList("[data-blog-payload]")).toEqual([]);
    });
  });

  describe("applyPostFields", () => {
    it("escribe los campos del idioma activo", () => {
      setLang("es");
      const card = mount();

      applyPostFields(card, post);

      expect(card.querySelector("[data-post-field='title']")!.textContent).toBe(
        "Mi primer post",
      );
      expect(
        card.querySelector("[data-post-field='description']")!.textContent,
      ).toBe("Introductorio");
      expect(card.querySelector("[data-post-field='date']")!.textContent).toBe(
        "1 de enero de 2026",
      );
    });

    it("usa el idioma base como fallback", () => {
      setLang("ja"); // no hay entrada 'ja' en el payload
      const card = mount();

      applyPostFields(card, post);

      expect(card.querySelector("[data-post-field='title']")!.textContent).toBe(
        "My first post",
      );
    });

    it("muta textContent en vez de reemplazar el nodo (lo pide textFx)", () => {
      setLang("en");
      const card = mount();
      const heading = card.querySelector("[data-post-field='title']")!;

      applyPostFields(card, post);
      applyPostFields(card, post);

      expect(card.querySelector("[data-post-field='title']")).toBe(heading);
      expect(heading.textContent).toBe("My first post");
    });
  });
});

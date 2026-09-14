import type { Site, Links } from "./types.ts";

export const SITE: Site = {
  TITLE: "フイスです",
  DESCRIPTION: ".",
  AUTHOR: "Fuis18",
};

export const LINKS: Links = [
  {
    TEXT: { es: "Inicio", en: "Home" },
    HREF: "/",
  },
  {
    TEXT: { es: "Proyectos", en: "Projects" },
    HREF: "/projects",
  },
  {
    TEXT: { es: "Blogs", en: "Blogs" },
    HREF: "/blog",
  },
];

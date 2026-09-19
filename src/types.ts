export type Page = {
  TITLE: string;
  DESCRIPTION: string;
};

export interface Site extends Page {
  AUTHOR: string;
}

/** Claves de mensajes de paraglide usadas por los enlaces de navegación. */
export type NavMessageKey = "nav_home" | "nav_projects" | "nav_blog";

export type Links = {
  KEY: NavMessageKey;
  HREF: string;
}[];

export type Localized<T> = Record<string, T>;

export type Page = {
  TITLE: string;
  DESCRIPTION: string;
};

export interface Site extends Page {
  AUTHOR: string;
}

export type NavMessageKey = "nav_home" | "nav_projects" | "nav_blog";

export type Links = {
  KEY: NavMessageKey;
  HREF: string;
}[];

export type Localized<T> = Record<string, T>;

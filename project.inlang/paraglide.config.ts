/** @type {import("@inlang/paraglide-js").ParaglideConfig} */
export default {
  outdir: "./src/paraglide",
  localStorageKey: "lang",
  strategy: ["localStorage", "preferredLanguage", "baseLocale"],
  emitTsDeclarations: true,
};

import { defineConfig } from "astro/config";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

// https://astro.build/config
export default defineConfig({
  site: "https://fuis18.is-a.dev",
  build: {
    inlineStylesheets: "always",
  },
  integrations: [],
  vite: {
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
      }),
    ],
  },
});

import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

// https://astro.build/config
export default defineConfig({
  site: "https://fuis18.is-a.dev",
  integrations: [mdx()],
  vite: {
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
      }),
    ],
  },
});

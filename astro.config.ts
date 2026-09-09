import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://fuis18.is-a.dev",
  integrations: [mdx()],
});

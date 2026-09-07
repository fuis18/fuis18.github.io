import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://fuis18.is-a.dev",
  vite: {
    plugins: [tailwindcss()],
  },
});

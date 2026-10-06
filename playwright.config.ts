import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  // El HTML report es lo que se sube como artefacto en CI cuando falla.
  reporter: [["list"], ["html", { open: "never" }]],
  // El `astro preview` del webServer atiende a todos los workers a la vez.
  // Con 4 workers (el default, nproc/2) sobre poca RAM el server muere y los
  // tests fallan con NS_ERROR_CONNECTION_REFUSED. En CI el runner trae 2 vCPU,
  // así que 2 workers son margen sin pasar de lo soportado.
  workers: process.env.CI ? 2 : 1,
  webServer: {
    command: "pnpm run build && pnpm run preview",
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:4321",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "firefox",
      use: { browserName: "firefox" },
    },
  ],
});

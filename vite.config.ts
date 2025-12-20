import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		svgr({
			svgrOptions: { icon: true },
		}),
	],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
	server: {
		host: true,
		port: 5173,
	},
	base: '/',
});

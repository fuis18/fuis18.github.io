# My frontend

```sh
bun create vite frontend --template react-ts
cd frontend

bun add -D tailwindcss @tailwindcss/vite
bun add react-router-dom
bun add react-i18next i18next

bun add react-hook-form
bun add -D shadcn-ui
bun add vite-plugin-svgr
bun add framer-motion
```

***vite.config.ts***

```ts
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});
```

**tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
    "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**src/index.css**

```css
@import "tailwindcss";
@import "tw-animate-css";
```

```sh
bunx shadcn init
bun dev
```


```sh
bunx --bun shadcn@latest add dropdown-menu
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add navigation-menu
```

## Presentación

1. Header
2. Background
3. Projects
4. Author / Tecnologies
5. Footer

```sh
bun run build
```

### Cosas por hacer
Manejo de Memoria cache
Circulo de cambio de tema

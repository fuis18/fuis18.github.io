# Mi página personal

[![CI](https://github.com/fuis18/fuis18.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/fuis18/fuis18.github.io/actions/workflows/ci.yml)
![Astro](https://img.shields.io/badge/Astro-7.3.1-black?logo=astro&logoColor=white)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)

Hecho en Astro para rendimiento, minimizando dependencias y que se siga viendo fascinante.

**Demo:** https://fuis18.is-a.dev · [English](README.md)

[![Página principal en modo oscuro](src/assets/img/img-portafolio.png)](https://fuis18.is-a.dev)

## Características

- i18n en 4 idiomas (en, es, ja, de) con Paraglide, persistente entre páginas
- Modo oscuro/claro y modo grafo interactivo con vis-network
- Blog con tags y tiempo de lectura localizados por idioma
- 100% estático (SSG), publicado en GitHub Pages

## Stack

- [Astro 7](https://astro.build) + TypeScript
- [Paraglide JS](https://www.npmjs.com/package/@inlang/paraglide-js) para i18n
- [vis-network](https://vis-network.js.org) para el grafo
- [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) para pruebas
- [Prettier](https://prettier.io) para formateo

## Comandos

```sh
pnpm dev              # servidor de desarrollo
pnpm build && pnpm preview
pnpm test             # unitarias (Vitest)
pnpm test:e2e         # E2E (Playwright)
pnpm typecheck        # chequeo de tipos (tsc --noEmit)
pnpm format           # formateo (Prettier)
pnpm paraglide        # compilar mensajes de i18n
```

## Cambios

Empecé con [All-Projects](https://fuis18.github.io/All-Projects) con JS puro; al ponerle el modo oscuro encontré una paleta que me gustaba.

Luego, al aprender React, lo rehice pero quedó a medias ([commit](https://github.com/fuis18/fuis18.github.io/tree/53beb8944b794f0cea5b3e7ead396b7e2afcf6ec)) para dedicarme a estudiar Astro y configurar mi entorno de Linux.

Gracias a involucrarme más, pude crear una web que me refleja mejor como ingeniero y como persona.

## Inspiración

- Inspiración principal: [@raexera](https://github.com/raexera)
- Inspiración secundaria: [@notkimu](https://github.com/notKimu), [@Equs](https://github.com/corecommit), [@vaxry](https://github.com/vaxerski)
- Otros agradecimientos: [@oscarbeaumont](https://otbeaumont.me/), [@jaimepine](https://discover.me/jamie), [@mati](https://github.com/rosymati), [@caarclos](https://github.com/caarlos0)

## Licencia

MIT · ver [LICENSE](LICENSE) (declarada en [package.json](package.json))

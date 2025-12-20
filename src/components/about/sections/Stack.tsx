import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

// import Nodes from "@/assets/main-svg/nodes-svgrepo-com.svg?react";
import Menu from "@/assets/main-svg/menu-four-svgrepo-com.svg?react";
import IconTheme from "@/components/main/IconTheme";

import Rust from "@/assets/dev-svg/rust-logo.svg?react";
import RustDark from "@/assets/dev-svg/rust-logo-dark.svg?react";
import JavaScript from "@/assets/dev-svg/javascript-logo.svg?react";
import JavaScriptDark from "@/assets/dev-svg/javascript-logo-dark.svg?react";
import TypeScript from "@/assets/dev-svg/typescript-logo.svg?react";
import TypeScriptDark from "@/assets/dev-svg/typescript-logo-dark.svg?react";
import Shell from "@/assets/dev-svg/powershell-logo.svg?react";
import ShellDark from "@/assets/dev-svg/powershell-logo-dark.svg?react";
import Python from "@/assets/dev-svg/python-logo.svg?react";
import PythonDark from "@/assets/dev-svg/python-logo-dark.svg?react";
import Java from "@/assets/dev-svg/java-logo.svg?react";
import JavaDark from "@/assets/dev-svg/java-logo-dark.svg?react";

import Reactsvg from "@/assets/dev-svg/react-logo.svg?react";
import ReactsvgDark from "@/assets/dev-svg/react-logo-dark.svg?react";
import Tailwind from "@/assets/dev-svg/tailwindcss-logo.svg?react";
import TailwindDark from "@/assets/dev-svg/tailwindcss-logo-dark.svg?react";
import Nextjs from "@/assets/dev-svg/nextjs-logo.svg?react";
import NextjsDark from "@/assets/dev-svg/nextjs-logo-dark.svg?react";
import Shadcnui from "@/assets/dev-svg/shadcnui-logo.svg?react";
import ShadcnuiDark from "@/assets/dev-svg/shadcnui-logo-dark.svg?react";
import Reacthookform from "@/assets/dev-svg/reacthookform-logo.svg?react";
import Zod from "@/assets/dev-svg/zod-logo.svg?react";
import ZodDark from "@/assets/dev-svg/zod-logo-dark.svg?react";
import Motion from "@/assets/dev-svg/motion-logo-dark.svg?react";
import MotionDark from "@/assets/dev-svg/motion-logo.svg?react";

import NestJS from "@/assets/dev-svg/nestjs-logo.svg?react";
import NestJSDark from "@/assets/dev-svg/nestjs-logo-dark.svg?react";
import Prisma from "@/assets/dev-svg/prisma-logo.svg?react";
import PrismaDark from "@/assets/dev-svg/prisma-logo-dark.svg?react";
import Fastify from "@/assets/dev-svg/fastify-logo.svg?react";
import Express from "@/assets/dev-svg/express-logo.svg?react";

import Vite from "@/assets/dev-svg/vite-logo.svg?react";
import ViteDark from "@/assets/dev-svg/vite-logo-dark.svg?react";
import Tauri from "@/assets/dev-svg/tauri-logo.svg?react";
import TauriDark from "@/assets/dev-svg/tauri-logo-dark.svg?react";
import Ratatui from "@/assets/dev-svg/ratatui-logo.svg?react";
import Bevy from "@/assets/dev-svg/bevy-logo.svg?react";
import BevyDark from "@/assets/dev-svg/bevy-logo-dark.svg?react";

import PostgreSQL from "@/assets/dev-svg/postgresql-logo.svg?react";
import PostgreSQLDark from "@/assets/dev-svg/postgresql-logo-dark.svg?react";
import SQLite from "@/assets/dev-svg/sqlite-logo.svg?react";
import SQLiteDark from "@/assets/dev-svg/sqlite-logo-dark.svg?react";
import Qdrant from "@/assets/dev-svg/qdrant-logo.svg?react";
import QdrantDark from "@/assets/dev-svg/qdrant-logo-dark.svg?react";

import Bun from "@/assets/dev-svg/bun-logo.svg?react";
import BunDark from "@/assets/dev-svg/bun-logo-dark.svg?react";
import Npm from "@/assets/dev-svg/npm-logo.svg?react";
import NpmDark from "@/assets/dev-svg/npm-logo-dark.svg?react";
import Tokio from "@/assets/dev-svg/tokio-logo.svg?react";
import Neovim from "@/assets/dev-svg/neovim-logo.svg?react";
import NeovimDark from "@/assets/dev-svg/neovim-logo-dark.svg?react";
import VSCode from "@/assets/dev-svg/vscode-logo.svg?react";
import VSCodeDark from "@/assets/dev-svg/vscode-logo-dark.svg?react";

import Docker from "@/assets/dev-svg/docker-logo.svg?react";
import DockerDark from "@/assets/dev-svg/docker-logo-dark.svg?react";
import Nginx from "@/assets/dev-svg/nginx-logo.svg?react";
import NginxDark from "@/assets/dev-svg/nginx-logo-dark.svg?react";
import Git from "@/assets/dev-svg/git-logo.svg?react";
import GitDark from "@/assets/dev-svg/git-logo-dark.svg?react";

const Stack = () => {
	const { t } = useTranslation("pages");
	return (
		<div className="flex">
			<div className="flex flex-col items-center">
				<Button
					variant="ghost"
					className="border-b border-r rounded-none p-(--padding-s)"
				>
					<Menu className="fill-foreground" />
				</Button>
				{/* <Button
					variant="ghost"
					className="svg-nofill border-b border-r rounded-none p-(--padding-s)"
				>
					<Nodes className="fill-foreground" />
				</Button> */}
			</div>
			<div className="p-(--padding-x) flex flex-col gap-(--padding-s) w-full">
				<h2>{t("about.stack.title")}</h2>
				<div className="section-container">
					<fieldset className="section">
						<legend>{t("about.stack.languages")}</legend>
						<IconTheme
							Light={Rust}
							Dark={RustDark}
							label="Rust"
							className="path"
						/>
						<IconTheme
							Light={JavaScript}
							Dark={JavaScriptDark}
							label="JavaScript"
							className="path"
						/>
						<IconTheme
							Light={TypeScript}
							Dark={TypeScriptDark}
							label="TypeScript"
							className="path"
						/>
						<IconTheme
							Light={Shell}
							Dark={ShellDark}
							label="Shell"
							className="svg"
						/>
						<IconTheme
							Light={Python}
							Dark={PythonDark}
							label="Python"
							className="path"
						/>
						<IconTheme
							Light={Java}
							Dark={JavaDark}
							label="Java"
							className="path"
						/>
					</fieldset>
					<fieldset className="section">
						<legend>{t("about.stack.frontend")}</legend>
						<IconTheme
							Light={Reactsvg}
							Dark={ReactsvgDark}
							label="Reactsvg"
							className="path"
						/>
						<IconTheme
							Light={Tailwind}
							Dark={TailwindDark}
							label="Tailwind"
							className="path"
						/>
						<IconTheme
							Light={Shadcnui}
							Dark={ShadcnuiDark}
							label="Shadcnui"
							className="path"
						/>
						<IconTheme
							Light={Nextjs}
							Dark={NextjsDark}
							label="Nextjs"
							className="path"
						/>
						<IconTheme Light={Reacthookform} label="Reacthookform" />
						<IconTheme
							Light={Zod}
							Dark={ZodDark}
							label="Zod"
							className="path"
						/>
						<IconTheme
							Light={Motion}
							Dark={MotionDark}
							label="Motion"
							className="svg"
						/>
					</fieldset>
					<fieldset className="section">
						<legend>{t("about.stack.backend")}</legend>
						<IconTheme
							Light={NestJS}
							Dark={NestJSDark}
							label="NestJS"
							className="path"
						/>
						<IconTheme
							Light={Prisma}
							Dark={PrismaDark}
							label="Prisma"
							className="path"
						/>
						<IconTheme Light={Fastify} label="Fastify" />
						<IconTheme Light={Express} label="Express" />
						<div className="icon-theme">
							<div className="text-4xl">Axum (Rust)</div>
							<span className="icon-tooltip">Axum (Rust)</span>
						</div>
					</fieldset>
					<fieldset className="section">
						<legend>{t("about.stack.frameworks")}</legend>
						<IconTheme
							Light={Vite}
							Dark={ViteDark}
							label="Vite"
							className="svg"
						/>
						<IconTheme
							Light={Tauri}
							Dark={TauriDark}
							label="Tauri"
							className="path"
						/>
						<IconTheme Light={Ratatui} label="Ratatui" />
						<IconTheme
							Light={Bevy}
							Dark={BevyDark}
							label="Bevy"
							className="path"
						/>
					</fieldset>
					<fieldset className="section">
						<legend>{t("about.stack.databases")}</legend>
						<IconTheme
							Light={PostgreSQL}
							Dark={PostgreSQLDark}
							label="PostgreSQL"
							className="path"
						/>
						<IconTheme
							Light={SQLite}
							Dark={SQLiteDark}
							label="SQLite"
							className="path"
						/>
						<IconTheme Light={Qdrant} Dark={QdrantDark} label="Qdrant" />
					</fieldset>
					<fieldset className="section">
						<legend>{t("about.stack.devtools")}</legend>
						<IconTheme
							Light={Bun}
							Dark={BunDark}
							label="Bun"
							className="path"
						/>
						<IconTheme
							Light={Npm}
							Dark={NpmDark}
							label="Npm"
							className="path"
						/>
						<IconTheme Light={Tokio} label="Tokio" />
						<IconTheme
							Light={Neovim}
							Dark={NeovimDark}
							label="Neovim"
							className="path"
						/>
						<IconTheme
							Light={VSCode}
							Dark={VSCodeDark}
							label="VSCode"
							className="path"
						/>
					</fieldset>
					<fieldset className="section">
						<legend>{t("about.stack.opstools")}</legend>
						<IconTheme
							Light={Docker}
							Dark={DockerDark}
							label="Docker"
							className="path"
						/>
						<IconTheme
							Light={Nginx}
							Dark={NginxDark}
							label="Nginx"
							className="path"
						/>
						<IconTheme
							Light={Git}
							Dark={GitDark}
							label="Git"
							className="path"
						/>
					</fieldset>
					{/* <fieldset className="section">
						<legend>Practices</legend>
						<div>Clean Architecture</div>
						<div>Modular Monolith</div>
						<div>REST APIs</div>
						<div>API Versioning</div>
						<div>i18n</div>
						<div>Type-safe systems</div>
					</fieldset> */}
				</div>
			</div>
		</div>
	);
};

export default Stack;

// src/routes.tsx
import type { ReactElement } from "react";
import { PageWrapper } from "./components/system/PageWrapper";
import i18n from "./lib/i18n";

const modules = import.meta.glob("./pages/**/*.tsx", { eager: true });

type RouteItem = {
	path: string;
	element: ReactElement;
	title: string;
};

export const routes: RouteItem[] = Object.entries(modules).map(
	([filePath, module]) => {
		const parts = filePath.split("/");

		const file = parts.pop()!.replace(".tsx", "");
		const folder = parts.pop()!;

		let routePath = "/";
		let title = "Fuis18 - Web";

		// 1. HOME -> /
		if (folder === "pages" && file === "home") {
			routePath = "/";
			title = "Fuis18 - Home";
		}

		// 2. Páginas normales como news.tsx, about.tsx
		else if (folder === "pages" && file !== "page") {
			routePath = `/${file.toLowerCase()}`;
			title = `Fuis18 - ${file.charAt(0).toUpperCase() + file.slice(1)}`;
		}

		// 3. Carpetas numéricas -> proyectos /pages/0, /pages/1, etc.
		else if (!isNaN(Number(folder)) && file === "page") {
			const id = Number(folder);
			const projectTitle = i18n.t(`projects.items.${id}.title`);
			routePath = `/pages/${id}`;
			title =
				projectTitle !== `projects.items.${id}.title`
					? `Fuis18 - ${projectTitle}`
					: "Fuis18 - Proyecto";
		}

		const Component = (module as any).default;

		return {
			path: routePath,
			title,
			element: (
				<PageWrapper title={title}>
					<Component />
				</PageWrapper>
			),
		};
	}
);

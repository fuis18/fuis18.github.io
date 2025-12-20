// src/pages/home.tsx
import Main from "@/components/main/Main";
import ProjectInput from "@/components/main/ProjectInput";
import { useTranslation } from "react-i18next";

import projectsEs from "@/locales/es/projects.json";

type ProjectsJson = typeof projectsEs;
type ProjectsItems = ProjectsJson["items"];

const Projects = () => {
	const { t } = useTranslation("projects");

	const items = t("items", { returnObjects: true }) as ProjectsItems;

	return (
		<Main title={t("title")} className="cont__projects">
			{Object.entries(items).map(([id, data]) => (
				<ProjectInput key={id} id={Number(id)} title={data.title} />
			))}
		</Main>
	);
};

export default Projects;

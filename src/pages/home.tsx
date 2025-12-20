// src/pages/home.tsx
import Card from "@/components/main/Card";
import Main from "@/components/main/Main";
import { useTranslation } from "react-i18next";

import Code from "@/assets/main-svg/terminal.svg?react";
import Repo from "@/assets/main-svg/repo-svgrepo-com.svg?react";
import Contact from "@/assets/main-svg/at-svgrepo-com.svg?react";
import Kofi from "@/assets/main-svg/ko-fi-svgrepo-com.svg?react";
import Project from "@/assets/main-svg/zip-svgrepo-com.svg?react";
import Youtube from "@/assets/main-svg/youtube.svg?react";

const Home = () => {
	const { t } = useTranslation("common");
	return (
		<Main title={t("nav.home")} className="cont__flex">
			<div className="character-container"></div>
			<div className="cards-container">
				<Card
					name={t("nav.about")}
					Icon={Code}
					className="svg-nofill"
					link="/about"
				/>
				<Card
					name={t("nav.repositories")}
					Icon={Repo}
					className="svg-fill"
					link="/repositories"
				/>
				<Card
					name={t("nav.contact")}
					Icon={Contact}
					className="svg-fill"
					link="/contact"
				/>
				<Card
					name={t("nav.donate")}
					Icon={Kofi}
					className="svg-fill"
					link="/donate"
					newtab={true}
				/>
				<Card
					name={t("nav.projects")}
					Icon={Project}
					className="svg-fill"
					link="/projects"
				/>
				<Card
					name="Youtube"
					Icon={Youtube}
					className="svg-fill"
					link="https://www.youtube.com/@fuis18"
					newtab={true}
				/>
			</div>
		</Main>
	);
};

export default Home;

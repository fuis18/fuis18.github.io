import Main from "@/components/main/Main";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import AboutTabs from "@/components/about/AboutTabs";
import Summary from "@/components/about/sections/Summary";
import Stack from "@/components/about/sections/Stack";
import Workspace from "@/components/about/sections/Workspace";

type Section = "summary" | "stack" | "workspace";

const About = () => {
	const [active, setActive] = useState<Section>("summary");
	const { t } = useTranslation("pages");

	return (
		<Main title={t(t("about.title"))} className="cont__flex">
			<AboutTabs active={active} onChange={setActive} />

			<div className="border-2 m-1 md:max-h-80 lg:max-h-96 xl:max-h-128 overflow-y-auto rounded-md w-full">
				<AnimatePresence mode="wait">
					<motion.div
						key={active}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2 }}
					>
						{active === "summary" && <Summary />}
						{active === "stack" && <Stack />}
						{active === "workspace" && <Workspace />}
					</motion.div>
				</AnimatePresence>
			</div>
		</Main>
	);
};

export default About;

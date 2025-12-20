import Card from "@/components/main/Card";
import Main from "@/components/main/Main";
import { useTranslation } from "react-i18next";

import Archlinux from "@/assets/main-svg/archlinux.svg?react";
import Leaf from "@/assets/main-svg/leaf.svg?react";
import Lighning from "@/assets/main-svg/lightning.svg?react";

const Repositories = () => {
	const { t } = useTranslation("pages");
	return (
		<Main
			title={t(t("repositories.title"))}
			className="cont__flex cards-container"
		>
			<Card
				name="dotfiles"
				link="https://github.com/Fuis18/dotfiles"
				Icon={Archlinux}
				newtab={true}
				description="I use Archlinux by the way"
			></Card>
			<Card
				name="Healthy life"
				link="https://github.com/Fuis18/Healthy-Life"
				Icon={Leaf}
				newtab={true}
				description="Un trabajo para una amiga .-."
			></Card>
			<Card
				name="JS Projects"
				link="https://github.com/Fuis18/All-Projects"
				Icon={Lighning}
				newtab={true}
				description="Mis comienzos"
			></Card>
		</Main>
	);
};

export default Repositories;

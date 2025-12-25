import Card from "@/components/main/Card";
import Main from "@/components/main/Main";
import { useTranslation } from "react-i18next";

import Mail from "@/assets/main-svg/mail.svg?react";
import Signal from "@/assets/main-svg/signal.svg?react";
import Github from "@/assets/main-svg/github.svg?react";
import X from "@/assets/main-svg/x.svg?react";
import Instagram from "@/assets/main-svg/instagram.svg?react";

const Contact = () => {
	const { t } = useTranslation("pages");

	return (
		<Main title={t(t("contact.title"))} className="cont__flex cards-container">
			<Card
				name={t("contact.mail")}
				link="mailto:fuis18@proton.me"
				Icon={Mail}
				className="svg-nofill"
				newtab={true}
				description="F18mail"
			></Card>
			<Card
				name="Signal"
				link="https://signal.me/#eu/5pstdQ7MVNxtUo2e3ppSEXVG-wocHFwIMg1LVKSKR4oYrNKjmudM546j-nviX1WC"
				Icon={Signal}
				newtab={true}
				description="fuis.18"
			></Card>
			<Card
				name="GitHub"
				link="https://github.com/Fuis18"
				Icon={Github}
				className="svg-nofill"
				newtab={true}
				description="Fuis18"
			></Card>
			<Card
				name="X"
				link="https://x.com/Fuis018"
				Icon={X}
				newtab={true}
				description="@Fuis018"
			></Card>
			<Card
				name="Instagram"
				link="https://www.instagram.com/fuis018"
				Icon={Instagram}
				newtab={true}
				className="svg-nofill"
				description="@fuis018"
			></Card>
		</Main>
	);
};

export default Contact;

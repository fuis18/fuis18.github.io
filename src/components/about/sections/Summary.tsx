import { useTranslation } from "react-i18next";

const Summary = () => {
	const { t } = useTranslation("pages");
	return (
		<div className="gap-4 flex flex-col p-(--padding-x)">
			<h2>{t("about.summary.title")}</h2>
			<p>{t("about.summary.paraph1")}</p>
			<p>{t("about.summary.paraph2")}</p>
			<p>{t("about.summary.paraph3")}</p>
			<p>{t("about.summary.paraph4")}</p>
		</div>
	);
};

export default Summary;

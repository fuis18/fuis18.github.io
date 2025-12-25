import Main from "@/components/main/Main";
import { useTranslation } from "react-i18next";

const News = () => {
	const { t } = useTranslation("pages");
	return <Main title={t("news.title")} className="cont__flex"></Main>;
};

export default News;

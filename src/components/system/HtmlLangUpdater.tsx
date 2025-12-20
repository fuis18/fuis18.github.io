import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const HtmlLangUpdater = () => {
	const { i18n } = useTranslation();

	useEffect(() => {
		const lang = i18n.language.slice(0, 2);
		document.documentElement.setAttribute("lang", lang);
	}, [i18n.language]);

	return null;
};

export default HtmlLangUpdater;

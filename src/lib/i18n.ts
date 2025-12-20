import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pagesDe from "@/locales/de/pages.json";
import commonDe from "@/locales/de/common.json";
import projectsDe from "@/locales/de/projects.json";

import pagesEn from "@/locales/en/pages.json";
import commonEn from "@/locales/en/common.json";
import projectsEn from "@/locales/en/projects.json";

import commonEs from "@/locales/es/common.json";
import pagesEs from "@/locales/es/pages.json";
import projectsEs from "@/locales/es/projects.json";

import pagesJp from "@/locales/jp/pages.json";
import commonJp from "@/locales/jp/common.json";
import projectsJp from "@/locales/jp/projects.json";

i18n.use(initReactI18next).init({
	lng: "en",
	fallbackLng: "en",

	interpolation: {
		escapeValue: false,
		defaultVariables: {},
	},

	ns: ["common", "pages", "projects"],
	defaultNS: "common",

	resources: {
		de: {
			pages: pagesDe,
			common: commonDe,
			projects: projectsDe,
		},
		en: {
			pages: pagesEn,
			common: commonEn,
			projects: projectsEn,
		},
		es: {
			pages: pagesEs,
			common: commonEs,
			projects: projectsEs,
		},
		jp: {
			pages: pagesJp,
			common: commonJp,
			projects: projectsJp,
		},
	},
});

export default i18n;

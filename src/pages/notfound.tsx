import Main from "@/components/main/Main";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFound() {
	const { t } = useTranslation("common");

	return (
		<Main title={t("notfound.title")}>
			<div className="notfound">
				<h2>{t("notfound.subtitle")}</h2>
				<p>{t("notfound.message")}</p>
				<Button variant={"outline"} className="mt-4 p-[5px]" asChild>
					<Link to="/">{t("buttons.goHome")}</Link>
				</Button>
			</div>
		</Main>
	);
}

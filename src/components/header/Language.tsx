import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Language = () => {
	const { i18n } = useTranslation();

	const changeLang = (lang: string) => {
		i18n.changeLanguage(lang);
	};

	const currentLang = i18n.language.slice(0, 2).toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="language-trigger">
				<Button variant={"ghost"}>{currentLang}</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="language-content">
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => changeLang("de")}
				>
					DE
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => changeLang("en")}
				>
					EN
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => changeLang("es")}
				>
					ES
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => changeLang("jp")}
				>
					JP
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Language;

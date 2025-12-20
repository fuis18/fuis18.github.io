import { useEffect, useState } from "react";
import { useTheme } from "@/components/system/Theme-provider";

type IconThemeProps = {
	Light: React.FC<React.SVGProps<SVGSVGElement>>;
	Dark?: React.FC<React.SVGProps<SVGSVGElement>>;
	className?: string;
	label?: string;
};

const IconTheme = ({ Light, Dark, className, label }: IconThemeProps) => {
	const { theme } = useTheme();
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		if (theme === "system") {
			const media = window.matchMedia("(prefers-color-scheme: dark)");
			setResolvedTheme(media.matches ? "dark" : "light");

			const listener = (e: MediaQueryListEvent) =>
				setResolvedTheme(e.matches ? "dark" : "light");

			media.addEventListener("change", listener);
			return () => media.removeEventListener("change", listener);
		}

		setResolvedTheme(theme);
	}, [theme]);

	if (!Dark) {
		return (
			<div className="icon-theme single">
				<Light />
				{label && <span className="icon-tooltip">{label}</span>}
			</div>
		);
	}

	return (
		<div className={`icon-theme ${resolvedTheme} ${className}`}>
			<Light className="icon light" />
			<Dark className="icon dark" />
			{label && <span className="icon-tooltip">{label}</span>}
		</div>
	);
};

export default IconTheme;

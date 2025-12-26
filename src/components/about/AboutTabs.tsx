import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type Props = {
	active: string;
	onChange: (v: any) => void;
};

const items = ["summary", "stack", "workspace"] as const;

export default function AboutTabs({ active, onChange }: Props) {
	const { t } = useTranslation("pages");

	return (
		<ul className="about__tabs">
			{items.map((item) => (
				<button
					key={item}
					onClick={() => onChange(item)}
					className="relative cursor-pointer pb-2 w-fit"
				>
					<motion.span
						animate={{
							color:
								active === item
									? "var(--accent-foreground)"
									: "var(--foreground)",
						}}
					>
						{t(`about.${item}.title`)}
					</motion.span>

					{active === item && (
						<motion.div
							layoutId="underline"
							className="absolute left-0 bottom-0 h-0.5 w-full bg-foreground"
						/>
					)}
				</button>
			))}
		</ul>
	);
}

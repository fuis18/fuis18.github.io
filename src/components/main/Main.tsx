import type { ReactNode } from "react";

type MainProps = {
	title: string;
	className?: string;
	children?: ReactNode;
	fProject?: string; // opcional
};

const Main = ({ title, className = "", children, fProject }: MainProps) => {
	return (
		<main role="main">
			<h1 className={`main-h1 ${fProject ? fProject + "__h1" : ""}`}>
				{title}
			</h1>

			<div className={`main__container ${className}`}>{children}</div>
		</main>
	);
};

export default Main;

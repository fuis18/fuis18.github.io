import type { ReactNode } from "react";

type Props = {
	title?: string;
	children: ReactNode;
};

export const PageWrapper = ({ title, children }: Props) => {
	if (title) {
		document.title = title;
	}

	return <div className="page-wrapper">{children}</div>;
};

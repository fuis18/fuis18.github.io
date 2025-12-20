// src/App.tsx
import type { ReactNode } from "react";
import "./App.css";
import { ThemeProvider } from "./components/system/Theme-provider";
import HtmlLangUpdater from "./components/system/HtmlLangUpdater";
import Header from "@/components/header/Header";

function App({ children }: { children?: ReactNode }) {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<HtmlLangUpdater />
			<Header></Header>
			{children}
		</ThemeProvider>
	);
}

export default App;

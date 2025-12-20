import ImgZoom from "@/components/main/ImgZoom";
import { useTranslation } from "react-i18next";

const Workspace = () => {
	const { t } = useTranslation("pages");
	return (
		<div className="p-(--padding-x)">
			<h2>{t("about.workspace.title")}</h2>
			<ImgZoom src="/img/workspace.png"></ImgZoom>
			<div className="section-container">
				<fieldset className="section">
					<legend>Work Environment</legend>
					<div>Arch linux</div>
					<div>Ironbar</div>
					<div>Kitty</div>
					<div>rclone</div>
					<div>Obsidian</div>
					<div>Brave</div>
					<div>Yazi</div>
					<div>Yofi</div>
				</fieldset>
				<fieldset className="section">
					<legend>Background Services</legend>
					<div>Oxker</div>
					<div>Syncthing</div>
				</fieldset>
			</div>
		</div>
	);
};

export default Workspace;

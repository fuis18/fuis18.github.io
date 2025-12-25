import IconTheme from "@/components/main/IconTheme";
import ImgZoom from "@/components/main/ImgZoom";
import { useTranslation } from "react-i18next";

import Archlinux from "@/assets/main-svg/archlinux.svg?react";
import ArchlinuxDark from "@/assets/main-svg/archlinux-dark.svg?react";
import Obsidian from "@/assets/app-svg/obsidian-logo.svg?react";
import ObsidianDark from "@/assets/app-svg/obsidian-logo-dark.svg?react";
import Brave from "@/assets/app-svg/brave-logo.svg?react";
import BraveDark from "@/assets/app-svg/brave-logo-dark.svg?react";
import Syncthing from "@/assets/app-svg/syncthing-logo.svg?react";
import SyncthingDark from "@/assets/app-svg/syncthing-logo-dark.svg?react";
import RClone from "@/assets/app-svg/rclone-logo.svg?react";
import RCloneDark from "@/assets/app-svg/rclone-logo-dark.svg?react";

const Workspace = () => {
	const { t } = useTranslation("pages");
	return (
		<div className="p-(--padding-x) flex flex-col gap-(--padding-s) w-full">
			<h2>{t("about.workspace.title")}</h2>
			<ImgZoom src="/img/workspace.png"></ImgZoom>
			<div className="section-container">
				<fieldset className="section">
					<legend>{t("about.workspace.environment")}</legend>
					<IconTheme
						Light={Archlinux}
						Dark={ArchlinuxDark}
						label="Arch Linux"
					/>
					<div className="icon-theme">
						<div className="text-3xl">Ironbar</div>
						<span className="icon-tooltip">Ironbar</span>
					</div>
					<div className="icon-theme">
						<div className="text-3xl">Kitty</div>
						<span className="icon-tooltip">Kitty</span>
					</div>
					<IconTheme Light={RClone} Dark={RCloneDark} label="RClone" />
					<IconTheme Light={Obsidian} Dark={ObsidianDark} label="Obsidian" />
					<IconTheme Light={Brave} Dark={BraveDark} label="Brave" />
					<div className="icon-theme">
						<div className="text-3xl">Yazi</div>
						<span className="icon-tooltip">Yazi</span>
					</div>
					<div className="icon-theme">
						<div className="text-3xl">Yofi</div>
						<span className="icon-tooltip">Yofi</span>
					</div>
				</fieldset>
				<fieldset className="section">
					<legend>{t("about.workspace.services")}</legend>
					<div className="icon-theme">
						<div className="text-3xl">Oxker</div>
						<span className="icon-tooltip">Oxker</span>
					</div>
					<IconTheme Light={Syncthing} Dark={SyncthingDark} label="Syncthing" />
				</fieldset>
			</div>
		</div>
	);
};

export default Workspace;

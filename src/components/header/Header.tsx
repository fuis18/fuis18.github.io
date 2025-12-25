import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "../ui/navigation-menu";
import Config from "./Config";
import Home from "./Home";
import Language from "./Language";
import Mode from "./Mode";
import News from "./News";
import Time from "./Time";
import "./header.css";

const Header = () => {
	return (
		<NavigationMenu className="header" role="banner">
			<NavigationMenuList className="flex-wrap h-10">
				<NavigationMenuItem className="header-item">
					<NavigationMenuLink asChild>
						<Home></Home>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="header-item">
					<Time></Time>
				</NavigationMenuItem>
			</NavigationMenuList>
			<NavigationMenuList className="flex-wrap h-10">
				<NavigationMenuItem className="header-item">
					<NavigationMenuLink asChild>
						<News></News>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="header-item">
					<NavigationMenuLink>
						<Mode></Mode>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="header-item">
					<NavigationMenuLink>
						<Language></Language>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="header-item">
					<NavigationMenuLink asChild>
						<Config></Config>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default Header;

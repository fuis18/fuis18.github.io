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
			<NavigationMenuList className="flex-wrap">
				<NavigationMenuItem className="mx-px">
					<NavigationMenuLink asChild>
						<Home></Home>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="mx-px">
					<Time></Time>
				</NavigationMenuItem>
			</NavigationMenuList>
			<NavigationMenuList className="flex-wrap">
				<NavigationMenuItem className="mx-px">
					<NavigationMenuLink asChild>
						<News></News>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="mx-px">
					<NavigationMenuLink>
						<Mode></Mode>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="mx-px">
					<NavigationMenuLink>
						<Language></Language>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="mx-px">
					<NavigationMenuLink asChild>
						<Config></Config>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default Header;

/** @format */
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "./ui/navigation-menu";

import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	return (
		<>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<button onClick={logout}>Logout</button>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<button onClick={() => navigate("/Login")}>
							Login
						</button>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<button onClick={() => navigate("/")}>Home</button>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</>
	);
}

/** @format */

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Search, Home, MessageCircle, Bell } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
	const { user, logout } = useContext(AuthContext);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="sticky top-0 z-50 border-b backdrop-blur-sm">
			<div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
				{/* LOGO */}
				<Link to="/" className="font-bold text-lg">
					CollageC
				</Link>

				{/* DESKTOP NAV */}
				<div className="hidden md:flex items-center gap-1">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link to="/">Home</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>

							<NavigationMenuItem>
								<NavigationMenuTrigger>
									Explore
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<div className="w-50 p-1">
										<Link
											to="/topics"
											className="block px-2 py-1 border-b"
										>
											Topics
										</Link>
										<Link
											to="/trending"
											className="block px-2 py-1 border-b"
										>
											Trending
										</Link>
										<Link
											to="/popular"
											className="block px-2 py-1 border-b"
										>
											Popular
										</Link>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>

							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link to="/chat">Messages</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				{/* RIGHT ACTIONS */}
				<div className="hidden md:flex items-center gap-2">
					{/* SEARCH */}
					<input
						type="text"
						placeholder="Search..."
						className="px-3 py-2 rounded-md border"
					/>

					{/* USER MENU */}
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full"
								>
									<Avatar>
										<AvatarImage
											src={user.profile?.avatar}
										/>
										<AvatarFallback>
											{user.name?.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end">
								<DropdownMenuLabel>
									{user.name}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link to={`/profile/${user._id}`}>
										Profile
									</Link>
								</DropdownMenuItem>
								{/* <DropdownMenuItem asChild>
									<Link to="/settings">Settings</Link>
								</DropdownMenuItem> */}
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={logout}>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<>
							<Button variant="ghost" asChild>
								<Link to="/Login">Login</Link>
							</Button>
							<Button asChild>
								<Link to="/Signup">Sign Up</Link>
							</Button>
						</>
					)}
				</div>

				{/* MOBILE MENU */}
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild className="md:hidden">
						<Button variant="ghost" size="icon">
							<Menu className="w-5 h-5" />
						</Button>
					</SheetTrigger>

					<SheetContent side="right">
						<div className="flex flex-col space-y-2 mt-8 gap-1 px-4">
							<Link to="/" onClick={() => setIsOpen(false)}>
								Home
							</Link>
							<Link to="/chat" onClick={() => setIsOpen(false)}>
								Messages
							</Link>
							<Link
								to="/notifications"
								onClick={() => setIsOpen(false)}
							>
								Notifications
							</Link>

							<hr />

							{user ? (
								<div className="space-y-2 flex flex-col">
									<Link
										to={`/profile/${user._id}`}
										onClick={() => setIsOpen(false)}
									>
										{user.name}'s Profile
									</Link>
									<Link
										to="/settings"
										onClick={() => setIsOpen(false)}
									>
										Settings
									</Link>
									<Button
										variant="outline"
										className="w-full"
										onClick={() => {
											logout();
											setIsOpen(false);
										}}
									>
										Logout
									</Button>
								</div>
							) : (
								<div className="space-y-2">
									<Button
										asChild
										variant="outline"
										className="w-full"
									>
										<Link to="/Login">Login</Link>
									</Button>
									<Button asChild className="w-full">
										<Link to="/Signup">Sign Up</Link>
									</Button>
								</div>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}

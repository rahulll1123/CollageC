/** @format */

import Navbar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
// import {Footer} from '../components/Footer';

export const NavFoot = () => {
	// const test = useAuth();
	// console.log(test);
	return (
		<div>
			<Navbar />
			<main className="grow flex align-middle">
				<Outlet />
			</main>
			<Toaster />
			{/* <Footer /> */}
		</div>
	);
};

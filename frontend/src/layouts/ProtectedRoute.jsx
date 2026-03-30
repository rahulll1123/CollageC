/** @format */
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
export const ProtectedRoute = () => {
	const auth = useContext(AuthContext);
	// console.log(test);
	if (auth.loading) {
		return <h1>Waiting...</h1>;
	}
	if (!auth.user) {
		return <Navigate to="/Login" replace />;
	}
	return <Outlet />;
};

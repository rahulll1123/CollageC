/** @format */

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// 1. Handle Page Refresh (The "Heartbeat")
	const checkAuth = async () => {
		try {
			const res = await axios.get("/api/auth/me"); // Your server endpoint
			setUser(res.data);
		} catch (err) {
			setUser(null);
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const logout = async () => {
		await axios.get("/api/auth/logout");
		setUser(null);
	};

	const auth = {
		user,
		setUser,
		loading,
		logout,
		checkAuth,
	};

	return (
		<AuthContext.Provider value={{ user, setUser, loading, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, AuthContext };

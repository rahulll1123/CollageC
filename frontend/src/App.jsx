/** @format */

import axios from "axios";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AllPosts from "./pages/AllPosts";
import { NavFoot } from "./layouts/NavFoot";
import "./index.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import Navbar from "./components/Navbar";

axios.defaults.baseURL = "http://localhost:5500";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Navbar />
				<div className="App">
					<Routes>
						{/* <Route element={<NavFoot />}> */}
						<Route path="/Login" element={<Login />} />
						<Route path="/Signup" element={<Signup />} />
						<Route element={<ProtectedRoute />}>
							<Route path="/" element={<AllPosts />} />
						</Route>
						{/* </Route> */}
						<Route path="/*" element={<AllPosts />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;

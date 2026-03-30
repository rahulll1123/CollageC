/** @format */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z
		.string()
		.min(8, "Must be at least 8 characters")
		.regex(/[A-Z]/, "Include an uppercase letter")
		.regex(/[a-z]/, "Include a lowercase letter")
		.regex(/[^a-zA-Z0-9]/, "Include a symbol"),
});

export default function Login() {
	const navigate = useNavigate();
	const { setUser } = useContext(AuthContext);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data) => {
		try {
			// Axios call with JSON data
			const response = await axios.post("/api/auth/login", data);
			console.log("Success:", response.data);
			toast.success("Login successful!", {
				position: "top-center",
			});
			setUser(response.data.user);
			navigate("/");
		} catch (err) {
			if (err.response)
				toast.error(err.response.data.message, {
					position: "top-center",
				});
			console.error("Login Error:", err.response?.data || err.message);
		}
	};

	return (
		<div className="w-full h-dvh flex justify-center items-center">
			<Card className="w-full h-fit flex-col max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardAction>
						<Button variant="link" asChild>
							<Link to="/Signup">Sign Up</Link>
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="grid gap-4"
					>
						{/* Email Field */}
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								{...register("email")}
								className={
									errors.email ? "border-destructive" : ""
								}
							/>
							{errors.email && (
								<p className="text-sm font-medium text-destructive">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password Field */}
						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link
									to="/"
									className="text-xs opacity-50 hover:underline"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								{...register("password")}
								className={
									errors.password ? "border-destructive" : ""
								}
							/>
							{errors.password && (
								<p className="text-sm font-medium text-destructive">
									{errors.password.message}
								</p>
							)}
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Logging in..." : "Login"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

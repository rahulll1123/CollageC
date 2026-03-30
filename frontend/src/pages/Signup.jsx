/** @format */

import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const signupSchema = z.object({
	name: z.string().min(5, "required"),
	email: z.email("Invalid Email Address"),
	password: z
		.string()
		.min(8, "Must be at least 8 characters")
		.regex(/[A-Z]/, "Include an uppercase letter")
		.regex(/[a-z]/, "Include a lowercase letter")
		.regex(/[^a-zA-Z0-9]/, "Include a symbol"),
});

export default function Signup() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data) => {
		try {
			// Axios call with JSON data
			console.log(data);
			const response = await axios.post("/api/auth/register", data);
			console.log("Success:", response.data);
			toast.success("Signup successful! Please login.", {
				position: "top-center",
			});
			navigate("/Login");
		} catch (err) {
			toast.error(err.response.data.message, {
				position: "top-center",
			});
			console.error("Signup Error:", err.response?.data || err.message);
		}
	};

	return (
		<div className="w-full h-dvh flex justify-center items-center">
			<Card className="w-full h-fit flex-col max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Signup</CardTitle>
					<CardAction>
						<Button variant="Link" asChild>
							<Link to="/Login">Login</Link>
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="grid gap-4"
					>
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="rahul kumar"
								{...register("name")}
								className={
									errors.name ? "border-destructive" : ""
								}
							/>
							{errors.name && (
								<p className="text-sm font-medium text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>
						<div className="grid gap-2 ">
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

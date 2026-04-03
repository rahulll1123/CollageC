/** @format */

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function authRegister(req, res) {
	const { name, email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}
		const salt = await bcrypt.genSalt(10);

		if (!password) {
			return res.status(400).json({ message: "Password is required" });
		}
		if (!password || typeof password !== "string") {
			return res
				.status(400)
				.json({ message: "Invalid password provided" });
		}
		const hashedPassword = await bcrypt.hash(password, salt);

		user = new User({
			name,
			email,
			password: hashedPassword,
		});
		await user.save();

		return res.status(201).json({
			message: "User created successfully",
			user: { name: user.name, email: user.email },
		});
	} catch (error) {
		console.error("Registration Error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
}
async function authLogin(req, res) {
	try {
		const { email, password } = req.body;
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		if (!password || typeof password !== "string") {
			return res
				.status(400)
				.json({ message: "Invalid password provided" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const authuser = { id: user._id, name: user.name, email: user.email };
		const token = jwt.sign(authuser, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		const resuser = {
			_id: user._id,
			name: user.name,
			email: user.email,
			status: user.status,
			profile: {
				avatar: user.avatar,
			},
		};

		return res.status(201).json({
			message: "User Login successfully",
			user: resuser,
		});
	} catch (error) {
		console.error("Login Error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
}

async function authLogout(req, res) {
	res.clearCookie("token", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Lax",
	});

	return res.status(200).json({ message: "User logged out successfully" });
}

async function verifyMe(req, res) {
	try {
		const user = await User.findById(req.user.id).select(
			"avatar _id name email status",
		);
		console.log(user);

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
}

export { authRegister, authLogin, authLogout, verifyMe };

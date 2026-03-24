/** @format */

import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import chatRoutes from "./src/routes/chat.route.js";
import authMiddleware from "./src/middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";

// configuration
dotenv.config();
await connectDB();

const Port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", authMiddleware, chatRoutes);
// Start the server
app.listen(Port, () => {
	console.log(`Server is running on port ${Port}`);
});

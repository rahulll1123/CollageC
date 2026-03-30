/** @format */

import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import chatRoutes from "./src/routes/chat.route.js";
import { protect } from "./src/middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import { UploadImage } from "./src/middlewares/upload.middleware.js";
import postRoutes from "./src/routes/post.route.js";
import LogRequest from "./src/middlewares/logs.middleware.js";
import cors from "cors";

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

// configuration
dotenv.config();
await connectDB();

const Port = process.env.PORT || 3000;
const app = express();
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(LogRequest);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", protect, chatRoutes);
app.use("/api/post", protect, UploadImage, postRoutes);

// Start the server
app.listen(Port, () => {
	console.log(`Server is running on port ${Port}`);
});

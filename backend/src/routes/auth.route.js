/** @format */

import { Router } from "express";
import {
	authRegister,
	authLogin,
	authLogout,
	verifyMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

// import express from "express";

const router = Router();

// Define your authentication routes here

router.post("/register", authRegister);
router.post("/login", authLogin);
router.get("/logout", authLogout);
router.get("/me", protect, verifyMe);

export default router;

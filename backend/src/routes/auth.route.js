/** @format */

import { Router } from "express";
import {
	authRegister,
	authLogin,
	authLogout,
} from "../controllers/auth.controller.js";
// import express from "express";

const router = Router();

// Define your authentication routes here

router.post("/register", authRegister);
router.post("/login", authLogin);
router.get("/logout", authLogout);

export default router;

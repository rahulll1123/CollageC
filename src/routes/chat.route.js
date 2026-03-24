/** @format */

import { Router } from "express";
import {
	startChat,
	getChats,
	getChatById,
	createGroupChat,
} from "../controllers/chat.controller.js";

const router = Router();

router.get("/start-chat/:userId", startChat);
router.get("/chats", getChats);
router.get("/:id", getChatById);
router.post("/group", createGroupChat);

export default router;

/** @format */

import { Router } from "express";
import { sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.post("/:chatId", sendMessage);
router.get("/:chatId", latestMessages);
router.post("/update/:messageId", updateMessage);
router.delete("/:messageId", deleteMessage);

export default router;

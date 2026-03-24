/** @format */

import mongoose from "mongoose";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

async function sendMessage(req, res) {
	try {
		const { chatId } = req.params;
		const { content } = req.body;

		const chat = await Chat.findById(chatId);
		if (!chat) {
			return res.status(404).json({ error: "Chat not found" });
		}

		const message = new Message({
			chat: chatId,
			content,
		});

		await message.save();
		res.status(201).json(message);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

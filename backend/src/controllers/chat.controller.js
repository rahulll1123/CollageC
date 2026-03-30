/** @format */

import mongoose from "mongoose";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

async function getChatById(req, res) {
	const chatId = req.params.id;
	try {
		const chat = await Chat.findById(chatId).populate(
			"participants",
			"name email",
		);
		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}
		res.json(chat);
	} catch (error) {
		res.status(500).json({ message: "Error fetching chat" });
	}
}

async function getChats(req, res) {
	try {
		const chats = await Chat.find({ participants: req.user.id })
			.select("_id participants lastMessages")
			.populate("participants", "_id name profile")
			.lean();
		res.json(chats);
	} catch (error) {
		res.status(500).json({ message: "Error fetching chats" });
	}
}
async function startChat(req, res) {
	try {
		const userId = req.params.userId;
		const user = await User.findById(userId).select("name email");
		const selfUser = await User.findById(req.user.id).select("name email");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!selfUser) {
			return res.status(404).json({ message: "Self user not found" });
		}
		let existingChat = await Chat.findOne({
			participants: { $all: [user._id, selfUser._id] },
		})
			.and({ type: "private" })
			.select("_id participants lastMessages")
			.lean();
		if (existingChat) {
			return res.status(200).json(existingChat);
		}
		const chat = new Chat({
			participants: [user._id, selfUser._id],
		});
		await chat.save();
		res.status(201).json(chat);
	} catch (error) {
		res.status(500).json({ message: "Error starting chat" });
	}
}

async function createGroupChat(req, res) {
	try {
		const { chatName, participantIds } = req.body;
		if (!chatName || !participantIds || participantIds.length < 2) {
			return res.status(400).json({
				message: "Chat name and at least 2 participants are required",
			});
		}

		for (const id of participantIds) {
			const participant = await User.findById(id)
				.select("name email")
				.lean();
			if (!participant) {
				return res
					.status(404)
					.json({ message: `User with ID ${id} not found` });
			}
		}

		const chat = new Chat({
			type: "group",
			chatName,
			participants: participantIds,
		});

		await chat.save();
		res.status(201).json(chat);
	} catch (error) {
		res.status(500).json({ message: "Error creating group chat" });
	}
}

export { getChatById, getChats, startChat, createGroupChat };

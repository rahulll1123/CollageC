/** @format */

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["text", "image", "file"],
			default: "text",
		},
		content: { type: String, required: true },
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
	},
	{ timestamps: true },
);

export default mongoose.model("Message", messageSchema);

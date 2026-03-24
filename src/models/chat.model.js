/** @format */
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["private", "group"],
			default: "private",
		},
		chatName: { type: String, default: "" },
		avatar: { type: String, default: "" },
		bio: { type: String, default: "" },
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		lastMessages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model("Chat", chatSchema);

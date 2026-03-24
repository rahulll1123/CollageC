/** @format */

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		images: [{ type: String }],
		description: { type: String, required: true },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	},
	{ timestamps: true },
);

export default mongoose.model("Post", postSchema);

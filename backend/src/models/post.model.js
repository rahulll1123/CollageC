/** @format */

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: { type: String, required: true },
		images: [{ type: String }],
		description: { type: String, required: true },
		tags: [{ type: String }],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true },
);

postSchema.index({ title: "text", description: "text", tags: "text" });

postSchema.virtual("likeCount").get(function () {
	return this.likes.length;
});

postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Post", postSchema);

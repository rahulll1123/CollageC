/** @format */

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
	{
		bio: { type: String, default: "" },
		college: { type: String, default: "" },
		avatar: { type: String, default: "" },
		topics: [{ type: String }],
		topPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
	},
	{ timestamps: true },
);

export default mongoose.model("Profile", profileSchema);

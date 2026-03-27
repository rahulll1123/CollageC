/** @format */

import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profile: {
			bio: { type: String, default: "" },
			college: { type: String, default: "" },
			avatar: { type: String, default: "" },
			topics: [{ type: String }],
			topPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		},
		status: {
			type: String,
			enum: ["online", "offline", "do_not_disturb"],
			default: "offline",
		},
	},
	{ timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

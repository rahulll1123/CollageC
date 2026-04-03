/** @format */

import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String, default: "" },
		profile: {
			bio: { type: String, default: "" },
			college: { type: String, default: "" },
			skills: [{ type: String }],
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

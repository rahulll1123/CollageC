/** @format */

import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profile: { type: Schema.Types.ObjectId, ref: "Profile", default: null },
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

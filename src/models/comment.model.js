/** @format */

import mongoos from "mongoose";

const commentSchema = new mongoos.Schema(
	{
		content: { type: String, required: true },
		user: {
			type: mongoos.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		comments: [{ type: mongoos.Schema.Types.ObjectId, ref: "Comment" }],
	},
	{ timestamps: true },
);

export default mongoos.model("Comment", commentSchema);

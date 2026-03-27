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
		post: {
			type: mongoos.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		parentComment: {
			type: mongoos.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},
		likes: [{ type: mongoos.Schema.Types.ObjectId, ref: "User" }],
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

commentSchema.virtual("likeCount").get(function () {
	return this.likes.length;
});

commentSchema.set("toObject", { virtuals: true });
commentSchema.set("toJSON", { virtuals: true });

export default mongoos.model("Comment", commentSchema);

/** @format */

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		parentComment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

commentSchema.virtual("likeCount").get(function () {
	return this.likes.length;
});

commentSchema.statics.getCommentPipeline = function (userId) {
	return [
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "user",
			},
		},
		{ $unwind: "$user" },
		{
			$addFields: {
				hasLiked: {
					$in: [
						new mongoose.Types.ObjectId(userId),
						{ $ifNull: ["$likes", []] },
					],
				},
			},
		},
		{
			$project: {
				likes: 0,
				__v: 0,
				"user.password": 0,
				"user.email": 0,
				"user.profile": 0,
				"user.createdAt": 0,
				"user.updatedAt": 0,
				"user.__v": 0,
			},
		},
	];
};

commentSchema.statics.getComment = function (postId, userId) {
	return this.aggregate([
		{
			$match: {
				post: new mongoose.Types.ObjectId(postId),
				parentComment: null,
			},
		},
		...this.getCommentPipeline(userId),
	]);
};

commentSchema.statics.getReply = function (parentCommentId, userId) {
	return this.aggregate([
		{
			$match: {
				// post: new mongoose.Types.ObjectId(postId),	// unnecessary
				parentComment: new mongoose.Types.ObjectId(parentCommentId),
			},
		},
		...this.getCommentPipeline(userId),
	]);
};

commentSchema.statics.addLike = function (commentId, userId) {
	return this.findByIdAndUpdate(
		commentId,
		{ $addToSet: { likes: userId } },
		{ select: "_id" },
	);
};

commentSchema.statics.removeLike = function (commentId, userId) {
	return this.findByIdAndUpdate(
		commentId,
		{ $pull: { likes: userId } },
		{ select: "_id" },
	);
};

commentSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Comment", commentSchema);

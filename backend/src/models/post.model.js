/** @format */

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
			default: null,
		},
		title: { type: String, required: true },
		images: [{ type: String }],
		description: { type: String, required: true },
		tags: [{ type: String }],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true },
);

postSchema.virtual("likeCount").get(function () {
	return this.likes.length;
});

postSchema.statics.getPostPipeline = function (userId) {
	return [
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				pipeline: [{ $project: { name: 1, _id: 1, avatar: 1 } }],
				as: "user",
			},
		},
		{ $unwind: "$user" },
		{
			$lookup: {
				from: "comments",
				localField: "_id",
				foreignField: "post",
				pipeline: [
					{ $match: { parentComment: null } },
					{ $count: "total" },
				],
				as: "comments",
			},
		},
		{
			$addFields: {
				hasLiked: {
					$in: [
						new mongoose.Types.ObjectId(userId),
						{ $ifNull: ["$likes", []] },
					],
				},
				likeCount: { $size: { $ifNull: ["$likes", []] } },
				commentCount: {
					$ifNull: [{ $arrayElemAt: ["$comments.total", 0] }, 0],
				},
			},
		},
		{
			$project: {
				likes: 0,
				__v: 0,
				comments: 0,
			},
		},
	];
};

postSchema.statics.getPost = function (postId, userId) {
	return this.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(postId) } },
		...this.getPostPipeline(userId),
	]);
};

postSchema.statics.getUserPost = function (postUserId, userId) {
	return this.aggregate([
		{ $match: { user: new mongoose.Types.ObjectId(postUserId) } },
		...this.getPostPipeline(userId),
	]);
};

postSchema.statics.getFeed = function (userId, skip, limit) {
	return this.aggregate([
		{ $skip: skip },
		{ $limit: limit },
		...this.getPostPipeline(userId),
	]);
};

postSchema.statics.addLike = async function (postId, userId) {
	try {
		const post = await this.findByIdAndUpdate(
			postId,
			{ $addToSet: { likes: userId } },
			{ select: "_id" },
		);
		return post;
	} catch (error) {
		throw error;
	}
};

postSchema.statics.removeLike = async function (postId, userId) {
	try {
		const post = await this.findByIdAndUpdate(
			postId,
			{ $pull: { likes: userId } },
			{ select: "_id" },
		);
		return post;
	} catch (error) {
		throw error;
	}
};

postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

postSchema.index({ user: 1, title: 1 }, { unique: true });

const Post = mongoose.model("Post", postSchema);

export default mongoose.model("Post", postSchema);

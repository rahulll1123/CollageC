/** @format */

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		status: {
			type: String,
			enum: ["idea", "in progress", "completed", "on hold"],
			default: "idea",
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		collaborators: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				role: { type: String, default: "developer" },
			},
		],
		tags: [{ type: String }],
		lookingFor: String,
		stars: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true },
);

projectSchema.statics.getProjectPipeline = function (userId) {
	return [
		{
			$lookup: {
				from: "users",
				localField: "creator",
				foreignField: "_id",
				as: "creator",
				pipeline: [{ $project: { name: 1, _id: 1, avatar: 1 } }],
				as: "creator",
			},
		},
		{ $unwind: "$creator" },
		{
			$addFields: {
				starCount: { $size: { $ifNull: ["$stars", []] } },
				hasStarred: {
					$in: [
						new mongoose.Types.ObjectId(userId),
						{ $ifNull: ["$stars", []] },
					],
				},
			},
		},
		{
			$project: {
				stars: 0,
				__v: 0,
			},
		},
	];
};

projectSchema.statics.getAllProjects = function (userId) {
	return this.aggregate(this.getProjectPipeline(userId));
};

projectSchema.statics.hasStarred = function (projectId, userId) {
	return this.findOne({
		_id: projectId,
		stars: { $in: [userId] },
	}).then((project) => !!project);
};

const Project = mongoose.model("Project", projectSchema);

export default Project;

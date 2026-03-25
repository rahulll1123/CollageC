/** @format */

import mongoose from "mongoose";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Profile from "../models/profile.model.js";

async function createPost(req, res) {
	try {
		const { title, description, images } = req.body;
		const profile = await Profile.findOne({ user: req.user.id });
		if (!profile) {
			return res.status(404).json({ message: "Profile not found" });
		}
		if (!title || !description) {
			return res
				.status(400)
				.json({ message: "Title and description are required" });
		}
		const post = new Post({ title, description, images });
		await post.save();

		if (profile) {
			profile.posts.push(post._id);
			await profile.save();
		}

		res.status(201).json(post);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

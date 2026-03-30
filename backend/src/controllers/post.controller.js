/** @format */
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import user from "../models/user.model.js";

export async function createPost(req, res) {
	try {
		const { title, description, images } = req.body;
		if (!title || !description) {
			return res
				.status(400)
				.json({ message: "Title and description are required" });
		}
		const userProfile = await user.findById(req.user.id).select("profile");
		if (!userProfile) {
			return res.status(404).json({ message: "User not found" });
		}

		const existingPost = await Post.findOne({ title, user: req.user.id });
		if (existingPost) {
			return res.status(400).json({
				message: "You have already created a post with this title",
			});
		}

		const post = new Post({
			user: req.user.id,
			title,
			description,
			images,
		});
		await post.save();

		if (userProfile.profile) {
			let len = userProfile.profile.topPosts.length;
			if (len >= 10) {
				userProfile.profile.topPosts.shift();
			}
			userProfile.profile.topPosts.push(post._id);
			await userProfile.save();
		}
		res.status(201).json(post);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function getPost(req, res) {
	try {
		const post = await Post.findById(req.params.Id).populate(
			"user",
			"name profile.avatar",
		);

		if (!post) return res.status(404).json({ message: "Post not found" });

		res.status(200).json(post);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function getPostComments(req, res) {
	try {
		const { page = 1, limit = 10 } = req.query; // Get pagination from query params
		const skip = (page - 1) * limit;

		const comments = await Comment.find({
			post: req.params.Id,
			parentComment: null, // Fetch top-level comments first
		})
			.populate("user", "name profile.avatar")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const totalComments = await Comment.countDocuments({
			post: req.params.Id,
		});

		res.status(200).json({
			comments,
			currentPage: page,
			totalPages: Math.ceil(totalComments / limit),
			totalComments,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function getUserPosts(req, res) {
	try {
		const posts = await Post.find({ user: req.params.Id }).populate(
			"user",
			"name profile.avatar",
		);
		res.status(200).json(posts);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}
export async function getAllPosts(req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = 10;
		const skip = (page - 1) * limit;
		// update this method as it is very slow (later)
		const posts = await Post.find()
			.populate("user", "name profile.avatar")
			.skip(skip)
			.limit(limit);
		res.status(200).json(posts);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}
export async function updatePost(req, res) {
	try {
		const post = await Post.findById(req.params.Id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (post.user.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		const { title, description, images } = req.body;
		if (title) post.title = title;
		if (description) post.description = description;
		if (images && images.length > 0) post.images = images;
		await post.save();
		res.status(200).json(post);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}
export async function deletePost(req, res) {
	try {
		const post = await Post.findById(req.params.Id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (post.user.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		await post.deleteOne();

		await user.updateOne(
			{ _id: req.user.id },
			{ $pull: { "profile.topPosts": post._id } },
		);

		await Comment.deleteMany({ post: req.params.Id });

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function createComment(req, res) {
	try {
		const { content, parentCommentId = null } = req.body;
		if (!content) {
			return res.status(400).json({ message: "Content is required" });
		}
		const post = await Post.findById(req.params.Id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		let duplicateComment = await Comment.findOne({
			user: req.user.id,
			content,
			post: req.params.Id,
			isDeleted: false,
			parentComment: parentCommentId,
		});
		if (duplicateComment) {
			return res
				.status(400)
				.json({ message: "You have already made this comment" });
		}

		const comment = new Comment({
			content,
			user: req.user.id,
			post: req.params.Id,
			parentComment: parentCommentId,
		});
		await comment.save();
		res.status(201).json(comment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function updateComment(req, res) {
	try {
		const { content } = req.body;
		const comment = await Comment.findById(req.params.Id);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}
		if (comment.user.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		if (content) comment.content = content;
		await comment.save();
		res.status(200).json(comment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}
export async function deleteComment(req, res) {
	try {
		const comment = await Comment.findById(req.params.Id);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}
		if (comment.user.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		await comment.updateOne({ content: "Deleted", isDeleted: true });
		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function addLike(req, res) {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (post.likes.includes(req.user.id)) {
			return res
				.status(400)
				.json({ message: "You have already liked this post" });
		}
		post.likes.push(req.user.id);
		await post.save();
		res.status(200).json({ message: "Post liked successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function removeLike(req, res) {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (!post.likes.includes(req.user.id)) {
			return res
				.status(400)
				.json({ message: "You have not liked this post" });
		}
		post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
		await post.save();
		res.status(200).json({ message: "Post unliked successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

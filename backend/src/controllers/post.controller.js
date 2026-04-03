/** @format */
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export async function createPost(req, res) {
	try {
		const {
			project = null,
			title,
			description,
			images,
			tags = [],
		} = req.body;
		if (!title || !description) {
			return res
				.status(400)
				.json({ message: "Title and description are required" });
		}

		const existingPost = await Post.findOne({
			title,
			user: req.user.id,
		})
			.select("_id")
			.lean();
		if (existingPost) {
			return res.status(400).json({
				message: "You have already created a post with this title",
			});
		}

		const user = await User.findById(req.user.id).select("profile");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const post = new Post({
			user: req.user.id,
			project,
			title,
			description,
			images,
			tags,
		});
		await post.save();

		user.updateOne({
			$push: { "profile.topPosts": post._id },
			$slice: -10,
		}).exec();

		if (user.profile) {
			let len = user.profile.topPosts.length;
			if (len >= 10) {
				user.profile.topPosts.shift();
			}
			user.profile.topPosts.push(post._id);
			await user.save();
		}
		res.status(201).json(post);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function getPost(req, res) {
	try {
		const post = await Post.getPost(req.params.postId, req.user?.id);

		if (!post) return res.status(404).json({ message: "Post not found" });

		res.status(200).json(post);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function getUserPosts(req, res) {
	try {
		const posts = await Post.getUserPost(req.params.userId, req.user?.id);

		if (!posts || posts.length === 0) {
			return res
				.status(404)
				.json({ message: "No posts found for this user" });
		}

		res.status(200).json(posts);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function getAllPosts(req, res) {
	try {
		const page = parseInt(req.query?.page) || 1;
		const limit = parseInt(req.query?.limit) || 10;
		const skip = (page - 1) * limit;
		// update this method as it is very slow (later)
		const posts = await Post.getFeed(req.user.id, skip, limit);
		res.status(200).json(posts);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function updatePost(req, res) {
	try {
		const post = await Post.findById(req.params.postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (post.user.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		const { title, description, images = [] } = req.body;
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
		const { postId } = req.params;
		const userId = req.user.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (post.user.toString() !== userId) {
			return res.status(403).json({
				message: "Unauthorized",
			});
		}

		await Promise.all([
			post.deleteOne(),
			User.updateOne(
				{ _id: userId },
				{ $pull: { "profile.topPosts": post._id } },
			),
			Comment.deleteMany({ post: postId }),
		]);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function addLike(req, res) {
	try {
		const post = await Post.addLike(req.params.postId, req.user.id);
		if (!post) {
			return res.status(404).json({ message: "Post Not Found" });
		}

		return res.status(200).json({ message: "Post liked successfully" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
}

export async function removeLike(req, res) {
	try {
		const post = await Post.removeLike(req.params.postId, req.user.id);
		if (!post) {
			return res.status(400).json({ message: "Post not found" });
		}

		return res.status(200).json({ message: "Post unliked successfully" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
}

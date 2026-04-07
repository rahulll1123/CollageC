/** @format */

import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

export async function getPostComments(req, res) {
	try {
		const allComments = await Comment.getComment(
			req.params.postId,
			req.user.id,
		).exec();

		res.status(200).json(allComments);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function getReplies(req, res) {
	try {
		const replies = await Comment.getReplies(
			req.params.commentId,
			req.user.id,
		);
		return res.status(200).json(replies);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function createComment(req, res) {
	try {
		const { content = null, parentCommentId = null } = req.body;
		if (!content) {
			return res.status(400).json({ message: "Content is required" });
		}

		const postId = req.params.postId;

		console.log(postId);
		const post = await Post.findById(postId).select("_id").lean();
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// basic current : Handle in client by desabling button
		// future : add hashing to prevent duplicate comment

		const comment = new Comment({
			content,
			user: req.user.id,
			post: postId,
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
		const comment = await Comment.findById(req.params.commentId).select(
			"user content",
		);
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
		const comment = await Comment.findById(req.params.commentId);
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

export async function likeComment(req, res) {
	try {
		const comment = await Comment.addLike(
			req.params.commentId,
			req.user.id,
		);
		if (!comment) {
			return res.status(400).json({ message: "Comment not found" });
		}
		res.status(200).json({ message: "Comment liked successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function unlikeComment(req, res) {
	try {
		const comment = await Comment.removeLike(
			req.params.commentId,
			req.user.id,
		);
		if (!comment) {
			return res.status(400).json({ message: "Comment not found" });
		}

		res.status(200).json({ message: "Comment unliked successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

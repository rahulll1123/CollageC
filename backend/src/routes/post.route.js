/** @format */

import express from "express";
const router = express.Router();

// Import your controllers
import {
	createPost,
	getPost,
	getAllPosts,
	getUserPosts,
	updatePost,
	deletePost,
	createComment,
	getPostComments, // The new chunked route
	updateComment,
	deleteComment,
	addLike,
	removeLike,
	likeComment,
	unlikeComment,
} from "../controllers/post.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

// Post Routes
router.route("/").get(getAllPosts).post(protect, createPost);

router.route("/user/:userId").get(getUserPosts);
router
	.route("/comments/:commentId")
	.put(protect, updateComment)
	.delete(protect, deleteComment);

router.post("/comments/:commentId/like", protect, likeComment);
router.post("/comments/:commentId/unlike", protect, unlikeComment);

router
	.route("/:postId")
	.get(getPost)
	.put(protect, updatePost)
	.delete(protect, deletePost);

router
	.route("/:postId/comments")
	.get(getPostComments) // Use this for lazy loading/scrolling
	.post(protect, createComment);

router.route("/:postId/like").post(protect, addLike);
router.route("/:postId/unlike").post(protect, removeLike);

export default router;

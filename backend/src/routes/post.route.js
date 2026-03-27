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
} from "../controllers/post.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

// Post Routes
router.route("/").get(getAllPosts).post(protect, createPost);

router.route("/user/:Id").get(getUserPosts);
router
	.route("/comments/:Id")
	.put(protect, updateComment)
	.delete(protect, deleteComment);

router
	.route("/:Id")
	.get(getPost)
	.put(protect, updatePost)
	.delete(protect, deletePost);

router
	.route("/:Id/comments")
	.get(getPostComments) // Use this for lazy loading/scrolling
	.post(protect, createComment);

router.route("/like/:id").post(protect, addLike);
router.route("/unlike/:id").post(protect, removeLike);

export default router;

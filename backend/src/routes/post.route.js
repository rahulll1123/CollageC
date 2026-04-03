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
	addLike,
	removeLike,
} from "../controllers/post.controller.js";

import {
	createComment,
	getPostComments,
} from "../controllers/comment.controller.js";

// import { protect } from "../middlewares/auth.middleware.js";

// Post Routes
router
	.route("/")
	.get(getAllPosts) // feed all post (wip to add quer for personalized feed)
	.post(createPost); // create Post (wip add reference to Project)

router.route("/user/:userId").get(getUserPosts); // all post of a user (profile)

router.route("/:postId").get(getPost).put(updatePost).delete(deletePost);

router
	.route("/:postId/comments")
	.get(getPostComments) // only root comments on post with paging
	.post(createComment); // create root comment / reply on comment

router.route("/:postId/like").post(addLike).delete(removeLike);

export default router;

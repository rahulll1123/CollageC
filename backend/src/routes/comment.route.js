/** @format */

import { Router } from "express";
import {
	deleteComment,
	likeComment,
	unlikeComment,
	updateComment,
	getReplies,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/:commentId").put(updateComment).delete(deleteComment);
router.route("/:commentId/like").post(likeComment).delete(unlikeComment);
router.route("/:commentId/reply").get(getReplies);

export default router;

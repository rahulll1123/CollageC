/** @format */

import { Router } from "express";

const router = Router();

router.post("/create/:Id", createPost);
router.get("/get/:Id", getPost);
router.get("/getAll/:page", getAllPosts);
router.delete("/delete/:Id", deletePost);
router.put("/update/:Id", updatePost);

router.post("/comment/create/:Id", createComment);
router.get("/comment/get/:Id", getComment);
router.delete("/comment/delete/:Id", deleteComment);
router.put("/comment/update/:Id", updateComment);

export default router;

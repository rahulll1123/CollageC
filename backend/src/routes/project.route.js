/** @format */

import { Router } from "express";
import {
	createProject,
	getProject,
	updateProject,
	deleteProject,
	addCollaborator,
	removeCollaborator,
	addStar,
	removeStar,
	getProjectCard,
	getAllProjects,
} from "../controllers/project.controller.js";

const router = Router();

router.route("/").post(createProject).get(getAllProjects);

router
	.route("/:projectId")
	.get(getProject)
	.put(updateProject)
	.delete(deleteProject);

router.get("/:projectId/card", getProjectCard);

router
	.route("/:projectId/collaborators")
	.post(addCollaborator)
	.delete(removeCollaborator);

router.route("/:projectId/stars").post(addStar).delete(removeStar);
export default router;

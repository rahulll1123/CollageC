/** @format */

import Project from "../models/project.model.js";

export async function createProject(req, res) {
	try {
		const { name, description, tags } = req.body;
		if (!name) {
			return res.status(400).json({ message: "Name is required" });
		}
		const project = new Project({
			name,
			description,
			creator: req.user.id,
			tags: tags || [],
		});
		await project.save();
		res.status(201).json(project);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getAllProjects(req, res) {
	try {
		const projects = await Project.getAllProjects(req.user.id);

		res.status(200).json(projects);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getProject(req, res) {
	try {
		const project = await Project.findById(req.params.projectId)
			.select("-stars")
			.populate("creator", "_id name avatar")
			.populate("collaborators.user", "_id name avatar")
			.lean();
		const hasStarred = await Project.hasStarred(
			req.params.projectId,
			req.user.id,
		);

		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}
		res.status(200).json({ ...project, hasStarred });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getProjectCard(req, res) {
	try {
		const project = await Project.findById(req.params.projectId).select(
			"-stars",
		);
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}
		res.status(200).json(project);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function updateProject(req, res) {
	try {
		const { name, description, tags, lookingFor } = req.body;

		const project = await Project.findById(req.params.projectId).select(
			"-stars",
		);
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		if (project.creator.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		if (name) project.name = name;
		if (description) project.description = description;
		if (tags) project.tags = tags;
		if (lookingFor) project.lookingFor = lookingFor;
		await project.save();
		res.status(200).json(project);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function deleteProject(req, res) {
	try {
		const project = await Project.findById(req.params.projectId).select(
			"-stars",
		);

		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		if (project.creator.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		await project.remove();

		res.status(200).json({ message: "Project deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function addCollaborator(req, res) {
	try {
		const { userId, role } = req.body;

		const project = await Project.findById(req.params.projectId).select(
			"-stars",
		);

		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		if (project.creator.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		const isAlreadyCollaborator = project.collaborators.some(
			(collab) => collab.user.toString() === userId,
		);

		if (isAlreadyCollaborator) {
			return res.status(400).json({
				message: "User is already a collaborator on this project",
			});
		}

		project.collaborators.push({
			user: userId,
			role: role || "developer",
		});

		await project.save();

		return res.status(200).json(project);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

export async function removeCollaborator(req, res) {
	try {
		const { userId } = req.body;

		const project = await Project.findById(req.params.projectId).select(
			"-stars",
		);
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}
		if (project.creator.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		const originalLength = project.collaborators.length;

		project.collaborators = project.collaborators.filter(
			(collab) => collab.user.toString() !== userId,
		);

		if (project.collaborators.length === originalLength) {
			return res
				.status(400)
				.json({ message: "User is not a collaborator" });
		}
		await project.save();
		return res.status(200).json(project);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

export async function addStar(req, res) {
	try {
		const project = await Project.findByIdAndUpdate(req.params.projectId, {
			$addToSet: { stars: req.user.id },
		}).select("_id");

		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		return res
			.status(200)
			.json({ message: "Project starred successfully" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

export async function removeStar(req, res) {
	try {
		const project = await Project.findByIdAndUpdate(req.params.projectId, {
			$pull: { stars: req.user.id },
		}).select("_id");

		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		return res
			.status(200)
			.json({ message: "Project unstarred successfully" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

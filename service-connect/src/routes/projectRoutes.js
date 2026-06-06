import express from "express";
import {
  createNewProject,
  showEditProjectForm,
  showNewProjectForm,
  showProjectDetails,
  showProjects,
  updateExistingProject,
} from "../controllers/projectsController.js";
import { requireLogin, requireRole } from "../middleware/authMiddleware.js";

export const projectRouter = express.Router();

projectRouter.get("/projects", showProjects);
projectRouter.get("/new-project", requireLogin, requireRole("admin"), showNewProjectForm);
projectRouter.post("/new-project", requireLogin, requireRole("admin"), createNewProject);
projectRouter.get("/edit-project/:id", requireLogin, requireRole("admin"), showEditProjectForm);
projectRouter.post("/edit-project/:id", requireLogin, requireRole("admin"), updateExistingProject);
projectRouter.get("/project/:id", showProjectDetails);

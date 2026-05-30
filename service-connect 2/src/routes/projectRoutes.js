import express from "express";
import {
  createNewProject,
  showEditProjectForm,
  showNewProjectForm,
  showProjectDetails,
  showProjects,
  updateExistingProject,
} from "../controllers/projectsController.js";

export const projectRouter = express.Router();

projectRouter.get("/projects", showProjects);
projectRouter.get("/new-project", showNewProjectForm);
projectRouter.post("/new-project", createNewProject);
projectRouter.get("/edit-project/:id", showEditProjectForm);
projectRouter.post("/edit-project/:id", updateExistingProject);
projectRouter.get("/project/:id", showProjectDetails);

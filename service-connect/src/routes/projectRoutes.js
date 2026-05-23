import express from "express";
import {
  showProjectDetails,
  showProjects,
} from "../controllers/projectsController.js";

export const projectRouter = express.Router();

projectRouter.get("/projects", showProjects);
projectRouter.get("/project/:id", showProjectDetails);

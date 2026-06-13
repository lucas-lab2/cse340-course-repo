import express from "express";
import {
  addProjectVolunteer,
  removeProjectVolunteer,
} from "../controllers/volunteersController.js";
import { requireLogin } from "../middleware/authMiddleware.js";

export const volunteerRouter = express.Router();

volunteerRouter.post("/project/:id/volunteer", requireLogin, addProjectVolunteer);
volunteerRouter.post("/project/:id/volunteer/remove", requireLogin, removeProjectVolunteer);

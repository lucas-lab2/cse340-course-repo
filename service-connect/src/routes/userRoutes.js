import express from "express";
import { showUsers } from "../controllers/usersController.js";
import { requireLogin, requireRole } from "../middleware/authMiddleware.js";

export const userRouter = express.Router();

userRouter.get("/users", requireLogin, requireRole("admin"), showUsers);

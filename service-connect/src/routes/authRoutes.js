import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  showDashboard,
  showLoginForm,
  showRegisterForm,
} from "../controllers/authController.js";
import { requireLogin } from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

authRouter.get("/register", showRegisterForm);
authRouter.post("/register", registerUser);
authRouter.get("/login", showLoginForm);
authRouter.post("/login", loginUser);
authRouter.get("/logout", logoutUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/dashboard", requireLogin, showDashboard);

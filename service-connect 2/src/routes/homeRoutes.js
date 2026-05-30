import express from "express";
import { showHome } from "../controllers/homeController.js";

export const homeRouter = express.Router();

homeRouter.get("/", showHome);

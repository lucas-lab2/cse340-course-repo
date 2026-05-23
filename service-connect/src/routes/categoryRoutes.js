import express from "express";
import {
  showCategories,
  showCategoryDetails,
} from "../controllers/categoriesController.js";

export const categoryRouter = express.Router();

categoryRouter.get("/categories", showCategories);
categoryRouter.get("/category/:id", showCategoryDetails);

import express from "express";
import {
  createNewCategory,
  showAssignCategoriesForm,
  showCategories,
  showCategoryDetails,
  showEditCategoryForm,
  showNewCategoryForm,
  updateAssignedCategories,
  updateExistingCategory,
} from "../controllers/categoriesController.js";
import { requireLogin, requireRole } from "../middleware/authMiddleware.js";

export const categoryRouter = express.Router();

categoryRouter.get("/categories", showCategories);
categoryRouter.get("/new-category", requireLogin, requireRole("admin"), showNewCategoryForm);
categoryRouter.post("/new-category", requireLogin, requireRole("admin"), createNewCategory);
categoryRouter.get("/edit-category/:id", requireLogin, requireRole("admin"), showEditCategoryForm);
categoryRouter.post("/edit-category/:id", requireLogin, requireRole("admin"), updateExistingCategory);
categoryRouter.get("/project/:id/categories", requireLogin, requireRole("admin"), showAssignCategoriesForm);
categoryRouter.post("/project/:id/categories", requireLogin, requireRole("admin"), updateAssignedCategories);
categoryRouter.get("/category/:id", showCategoryDetails);

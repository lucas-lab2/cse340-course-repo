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

export const categoryRouter = express.Router();

categoryRouter.get("/categories", showCategories);
categoryRouter.get("/new-category", showNewCategoryForm);
categoryRouter.post("/new-category", createNewCategory);
categoryRouter.get("/edit-category/:id", showEditCategoryForm);
categoryRouter.post("/edit-category/:id", updateExistingCategory);
categoryRouter.get("/project/:id/categories", showAssignCategoriesForm);
categoryRouter.post("/project/:id/categories", updateAssignedCategories);
categoryRouter.get("/category/:id", showCategoryDetails);

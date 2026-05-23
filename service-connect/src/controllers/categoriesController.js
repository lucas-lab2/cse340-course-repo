import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
} from "../models/categories.js";

export const showCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      title: "Service Project Categories",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const showCategoryDetails = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await getCategoryById(categoryId);

    if (!category) {
      res.status(404).render("not-found", {
        title: "Category Not Found",
        message: "The category you requested could not be found.",
      });
      return;
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render("category-details", {
      title: category.name,
      category,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

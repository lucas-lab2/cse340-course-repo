import {
  createCategory,
  getAllCategories,
  getCategoriesByProjectId,
  getCategoryById,
  getProjectsByCategoryId,
  updateCategoriesForProject,
  updateCategory,
} from "../models/categories.js";
import { getProjectById } from "../models/projects.js";

const getCategoryFormData = (body) => ({
  name: body.name?.trim() || "",
});

const validateCategory = ({ name }) => {
  const errors = [];

  if (!name) {
    errors.push("Category name is required.");
  }

  if (name && name.length < 3) {
    errors.push("Category name must be at least 3 characters long.");
  }

  if (name.length > 100) {
    errors.push("Category name must not be longer than 100 characters.");
  }

  return errors;
};

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

export const showNewCategoryForm = async (req, res) => {
  res.render("category-form", {
    title: "Create New Category",
    formAction: "/new-category",
    submitLabel: "Create Category",
    category: { name: "" },
    errors: [],
  });
};

export const createNewCategory = async (req, res, next) => {
  try {
    const category = getCategoryFormData(req.body);
    const errors = validateCategory(category);

    if (errors.length > 0) {
      res.status(400).render("category-form", {
        title: "Create New Category",
        formAction: "/new-category",
        submitLabel: "Create Category",
        category,
        errors,
      });
      return;
    }

    const newCategory = await createCategory(category.name);
    req.flash("success", `Category ${newCategory.name} was created successfully.`);
    res.redirect("/categories");
  } catch (error) {
    if (error.code === "23505") {
      const category = getCategoryFormData(req.body);
      res.status(400).render("category-form", {
        title: "Create New Category",
        formAction: "/new-category",
        submitLabel: "Create Category",
        category,
        errors: ["A category with that name already exists."],
      });
      return;
    }

    next(error);
  }
};

export const showEditCategoryForm = async (req, res, next) => {
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

    res.render("category-form", {
      title: "Edit Category",
      formAction: `/edit-category/${category.categoryId}`,
      submitLabel: "Update Category",
      category,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

export const updateExistingCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const category = getCategoryFormData(req.body);
    const errors = validateCategory(category);

    if (errors.length > 0) {
      res.status(400).render("category-form", {
        title: "Edit Category",
        formAction: `/edit-category/${categoryId}`,
        submitLabel: "Update Category",
        category,
        errors,
      });
      return;
    }

    const updatedCategory = await updateCategory(categoryId, category.name);

    if (!updatedCategory) {
      res.status(404).render("not-found", {
        title: "Category Not Found",
        message: "The category you requested could not be found.",
      });
      return;
    }

    req.flash("success", `Category ${updatedCategory.name} was updated successfully.`);
    res.redirect(`/category/${updatedCategory.categoryId}`);
  } catch (error) {
    if (error.code === "23505") {
      const categoryId = Number(req.params.id);
      const category = getCategoryFormData(req.body);
      res.status(400).render("category-form", {
        title: "Edit Category",
        formAction: `/edit-category/${categoryId}`,
        submitLabel: "Update Category",
        category,
        errors: ["A category with that name already exists."],
      });
      return;
    }

    next(error);
  }
};

export const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const project = await getProjectById(projectId);

    if (!project) {
      res.status(404).render("not-found", {
        title: "Project Not Found",
        message: "The service project you requested could not be found.",
      });
      return;
    }

    const allCategories = await getAllCategories();
    const currentCategories = await getCategoriesByProjectId(projectId);
    const currentCategoryIds = currentCategories.map((category) => category.categoryId);

    res.render("assign-categories", {
      title: "Assign Categories",
      project,
      allCategories,
      currentCategoryIds,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAssignedCategories = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const project = await getProjectById(projectId);

    if (!project) {
      res.status(404).render("not-found", {
        title: "Project Not Found",
        message: "The service project you requested could not be found.",
      });
      return;
    }

    const submittedCategories = req.body.categoryIds || [];
    const categoryIds = Array.isArray(submittedCategories)
      ? submittedCategories.map(Number)
      : [Number(submittedCategories)];
    const validCategoryIds = categoryIds.filter((categoryId) => Number.isInteger(categoryId));

    await updateCategoriesForProject(projectId, validCategoryIds);
    req.flash("success", `Categories for ${project.name} were updated successfully.`);
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

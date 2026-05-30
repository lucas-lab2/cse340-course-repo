import { getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../models/projects.js";

const getProjectFormData = (body) => ({
  organizationId: Number(body.organizationId),
  name: body.name?.trim() || "",
  description: body.description?.trim() || "",
  projectDate: body.projectDate?.trim() || "",
});

const validateProject = ({ organizationId, name, description, projectDate }) => {
  const errors = [];

  if (!organizationId || !Number.isInteger(organizationId)) {
    errors.push("A partner organization is required.");
  }

  if (!name) {
    errors.push("Project name is required.");
  }

  if (name && name.length < 3) {
    errors.push("Project name must be at least 3 characters long.");
  }

  if (name.length > 100) {
    errors.push("Project name must not be longer than 100 characters.");
  }

  if (!description) {
    errors.push("Project description is required.");
  }

  if (description && description.length < 10) {
    errors.push("Project description must be at least 10 characters long.");
  }

  if (!projectDate) {
    errors.push("Project date is required.");
  }

  if (projectDate && Number.isNaN(Date.parse(projectDate))) {
    errors.push("Project date must be a valid date.");
  }

  return errors;
};

const renderProjectForm = async ({ res, title, formAction, submitLabel, project, errors, status = 200 }) => {
  const organizations = await getAllOrganizations();

  res.status(status).render("project-form", {
    title,
    formAction,
    submitLabel,
    project,
    organizations,
    errors,
  });
};

export const showProjects = async (req, res, next) => {
  try {
    const projects = await getAllProjects();

    res.render("projects", {
      title: "Service Projects",
      projects,
    });
  } catch (error) {
    next(error);
  }
};

export const showProjectDetails = async (req, res, next) => {
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

    const categories = await getCategoriesByProjectId(projectId);

    res.render("project-details", {
      title: project.name,
      project,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const showNewProjectForm = async (req, res, next) => {
  try {
    await renderProjectForm({
      res,
      title: "Create New Service Project",
      formAction: "/new-project",
      submitLabel: "Create Project",
      project: {
        organizationId: "",
        name: "",
        description: "",
        projectDate: "",
      },
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

export const createNewProject = async (req, res, next) => {
  try {
    const project = getProjectFormData(req.body);
    const errors = validateProject(project);

    if (errors.length > 0) {
      await renderProjectForm({
        res,
        title: "Create New Service Project",
        formAction: "/new-project",
        submitLabel: "Create Project",
        project,
        errors,
        status: 400,
      });
      return;
    }

    const newProject = await createProject(project);
    req.flash("success", `Project ${newProject.name} was created successfully.`);
    res.redirect(`/project/${newProject.projectId}`);
  } catch (error) {
    next(error);
  }
};

export const showEditProjectForm = async (req, res, next) => {
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

    await renderProjectForm({
      res,
      title: "Edit Service Project",
      formAction: `/edit-project/${project.projectId}`,
      submitLabel: "Update Project",
      project,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

export const updateExistingProject = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const project = getProjectFormData(req.body);
    const errors = validateProject(project);

    if (errors.length > 0) {
      await renderProjectForm({
        res,
        title: "Edit Service Project",
        formAction: `/edit-project/${projectId}`,
        submitLabel: "Update Project",
        project,
        errors,
        status: 400,
      });
      return;
    }

    const updatedProject = await updateProject(projectId, project);

    if (!updatedProject) {
      res.status(404).render("not-found", {
        title: "Project Not Found",
        message: "The service project you requested could not be found.",
      });
      return;
    }

    req.flash("success", `Project ${updatedProject.name} was updated successfully.`);
    res.redirect(`/project/${updatedProject.projectId}`);
  } catch (error) {
    next(error);
  }
};

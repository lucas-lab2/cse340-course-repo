import { getAllProjects, getProjectById } from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";

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

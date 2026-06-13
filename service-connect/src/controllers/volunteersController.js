import { getProjectById } from "../models/projects.js";
import {
  addVolunteerToProject,
  removeVolunteerFromProject,
} from "../models/volunteers.js";

const getSafeRedirectPath = (path, fallback) => {
  if (path === "/dashboard") {
    return path;
  }

  return fallback;
};

export const addProjectVolunteer = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.session.user.userId;
    const project = await getProjectById(projectId);

    if (!project) {
      res.status(404).render("not-found", {
        title: "Project Not Found",
        message: "The service project you requested could not be found.",
      });
      return;
    }

    await addVolunteerToProject(userId, projectId);
    req.flash("success", `You are now volunteering for ${project.name}.`);
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export const removeProjectVolunteer = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.session.user.userId;
    const redirectTo = getSafeRedirectPath(req.body.redirectTo, `/project/${projectId}`);
    const project = await getProjectById(projectId);

    if (!project) {
      res.status(404).render("not-found", {
        title: "Project Not Found",
        message: "The service project you requested could not be found.",
      });
      return;
    }

    await removeVolunteerFromProject(userId, projectId);
    req.flash("success", `You are no longer volunteering for ${project.name}.`);
    res.redirect(redirectTo);
  } catch (error) {
    next(error);
  }
};

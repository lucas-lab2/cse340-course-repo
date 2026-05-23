import {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganizationId,
} from "../models/organizations.js";

export const showOrganizations = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();

    res.render("organizations", {
      title: "Organizations",
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

export const showOrganizationDetails = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.id);
    const organization = await getOrganizationById(organizationId);

    if (!organization) {
      res.status(404).render("not-found", {
        title: "Organization Not Found",
        message: "The organization you requested could not be found.",
      });
      return;
    }

    const projects = await getProjectsByOrganizationId(organizationId);

    res.render("organization-details", {
      title: organization.name,
      organization,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

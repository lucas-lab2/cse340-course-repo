import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganizationId,
  updateOrganization,
} from "../models/organizations.js";

const getOrganizationFormData = (body) => ({
  name: body.name?.trim() || "",
  description: body.description?.trim() || "",
  imageUrl: body.imageUrl?.trim() || "/images/organization.svg",
});

const validateOrganization = ({ name, description, imageUrl }) => {
  const errors = [];

  if (!name) {
    errors.push("Organization name is required.");
  }

  if (name && name.length < 3) {
    errors.push("Organization name must be at least 3 characters long.");
  }

  if (name.length > 100) {
    errors.push("Organization name must not be longer than 100 characters.");
  }

  if (!description) {
    errors.push("Organization description is required.");
  }

  if (description && description.length < 10) {
    errors.push("Organization description must be at least 10 characters long.");
  }

  if (!imageUrl) {
    errors.push("Image URL is required.");
  }

  if (imageUrl.length > 255) {
    errors.push("Image URL must not be longer than 255 characters.");
  }

  return errors;
};

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

export const showNewOrganizationForm = async (req, res) => {
  res.render("organization-form", {
    title: "Create New Organization",
    formAction: "/new-organization",
    submitLabel: "Create Organization",
    organization: {
      name: "",
      description: "",
      imageUrl: "/images/organization.svg",
    },
    errors: [],
  });
};

export const createNewOrganization = async (req, res, next) => {
  try {
    const organization = getOrganizationFormData(req.body);
    const errors = validateOrganization(organization);

    if (errors.length > 0) {
      res.status(400).render("organization-form", {
        title: "Create New Organization",
        formAction: "/new-organization",
        submitLabel: "Create Organization",
        organization,
        errors,
      });
      return;
    }

    const newOrganization = await createOrganization(organization);
    req.flash("success", `Organization ${newOrganization.name} was created successfully.`);
    res.redirect(`/organization/${newOrganization.organizationId}`);
  } catch (error) {
    if (error.code === "23505") {
      const organization = getOrganizationFormData(req.body);
      res.status(400).render("organization-form", {
        title: "Create New Organization",
        formAction: "/new-organization",
        submitLabel: "Create Organization",
        organization,
        errors: ["An organization with that name already exists."],
      });
      return;
    }

    next(error);
  }
};

export const showEditOrganizationForm = async (req, res, next) => {
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

    res.render("organization-form", {
      title: "Edit Organization",
      formAction: `/edit-organization/${organization.organizationId}`,
      submitLabel: "Update Organization",
      organization: {
        name: organization.name,
        description: organization.description,
        imageUrl: organization.image,
      },
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

export const updateExistingOrganization = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.id);
    const organization = getOrganizationFormData(req.body);
    const errors = validateOrganization(organization);

    if (errors.length > 0) {
      res.status(400).render("organization-form", {
        title: "Edit Organization",
        formAction: `/edit-organization/${organizationId}`,
        submitLabel: "Update Organization",
        organization,
        errors,
      });
      return;
    }

    const updatedOrganization = await updateOrganization(organizationId, organization);

    if (!updatedOrganization) {
      res.status(404).render("not-found", {
        title: "Organization Not Found",
        message: "The organization you requested could not be found.",
      });
      return;
    }

    req.flash("success", `Organization ${updatedOrganization.name} was updated successfully.`);
    res.redirect(`/organization/${updatedOrganization.organizationId}`);
  } catch (error) {
    if (error.code === "23505") {
      const organizationId = Number(req.params.id);
      const organization = getOrganizationFormData(req.body);
      res.status(400).render("organization-form", {
        title: "Edit Organization",
        formAction: `/edit-organization/${organizationId}`,
        submitLabel: "Update Organization",
        organization,
        errors: ["An organization with that name already exists."],
      });
      return;
    }

    next(error);
  }
};

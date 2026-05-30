import express from "express";
import {
  createNewOrganization,
  showEditOrganizationForm,
  showNewOrganizationForm,
  showOrganizationDetails,
  showOrganizations,
  updateExistingOrganization,
} from "../controllers/organizationsController.js";

export const organizationRouter = express.Router();

organizationRouter.get("/organizations", showOrganizations);
organizationRouter.get("/new-organization", showNewOrganizationForm);
organizationRouter.post("/new-organization", createNewOrganization);
organizationRouter.get("/edit-organization/:id", showEditOrganizationForm);
organizationRouter.post("/edit-organization/:id", updateExistingOrganization);
organizationRouter.get("/organization/:id", showOrganizationDetails);

import express from "express";
import {
  createNewOrganization,
  showEditOrganizationForm,
  showNewOrganizationForm,
  showOrganizationDetails,
  showOrganizations,
  updateExistingOrganization,
} from "../controllers/organizationsController.js";
import { requireLogin, requireRole } from "../middleware/authMiddleware.js";

export const organizationRouter = express.Router();

organizationRouter.get("/organizations", showOrganizations);
organizationRouter.get("/new-organization", requireLogin, requireRole("admin"), showNewOrganizationForm);
organizationRouter.post("/new-organization", requireLogin, requireRole("admin"), createNewOrganization);
organizationRouter.get("/edit-organization/:id", requireLogin, requireRole("admin"), showEditOrganizationForm);
organizationRouter.post("/edit-organization/:id", requireLogin, requireRole("admin"), updateExistingOrganization);
organizationRouter.get("/organization/:id", showOrganizationDetails);

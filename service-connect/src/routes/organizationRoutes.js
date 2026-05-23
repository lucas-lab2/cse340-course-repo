import express from "express";
import {
  showOrganizationDetails,
  showOrganizations,
} from "../controllers/organizationsController.js";

export const organizationRouter = express.Router();

organizationRouter.get("/organizations", showOrganizations);
organizationRouter.get("/organization/:id", showOrganizationDetails);

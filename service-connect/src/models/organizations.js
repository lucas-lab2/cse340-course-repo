import { query } from "../database.js";

export const getAllOrganizations = async () => {
  const result = await query(
    `SELECT
      organization_id AS "organizationId",
      name,
      description,
      image_url AS "image"
    FROM organizations
    ORDER BY name;`
  );

  return result.rows;
};

export const getOrganizationById = async (organizationId) => {
  const result = await query(
    `SELECT
      organization_id AS "organizationId",
      name,
      description,
      image_url AS "image"
    FROM organizations
    WHERE organization_id = $1;`,
    [organizationId]
  );

  return result.rows[0];
};

export const getProjectsByOrganizationId = async (organizationId) => {
  const result = await query(
    `SELECT
      project_id AS "projectId",
      name,
      description,
      project_date AS "projectDate"
    FROM projects
    WHERE organization_id = $1
    ORDER BY project_date, name;`,
    [organizationId]
  );

  return result.rows;
};

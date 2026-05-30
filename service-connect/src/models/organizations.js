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

export const createOrganization = async ({ name, description, imageUrl }) => {
  const result = await query(
    `INSERT INTO organizations (name, description, image_url)
    VALUES ($1, $2, $3)
    RETURNING organization_id AS "organizationId", name, description, image_url AS "image";`,
    [name, description, imageUrl]
  );

  return result.rows[0];
};

export const updateOrganization = async (organizationId, { name, description, imageUrl }) => {
  const result = await query(
    `UPDATE organizations
    SET name = $1,
      description = $2,
      image_url = $3
    WHERE organization_id = $4
    RETURNING organization_id AS "organizationId", name, description, image_url AS "image";`,
    [name, description, imageUrl, organizationId]
  );

  return result.rows[0];
};

export const getProjectsByOrganizationId = async (organizationId) => {
  const result = await query(
    `SELECT
      project_id AS "projectId",
      name,
      description,
      TO_CHAR(project_date, 'YYYY-MM-DD') AS "projectDate"
    FROM projects
    WHERE organization_id = $1
    ORDER BY project_date, name;`,
    [organizationId]
  );

  return result.rows;
};

import { query } from "../database.js";

export const getAllProjects = async () => {
  const result = await query(
    `SELECT
      p.project_id AS "projectId",
      p.name,
      p.description,
      TO_CHAR(p.project_date, 'YYYY-MM-DD') AS "projectDate",
      o.organization_id AS "organizationId",
      o.name AS "organizationName"
    FROM projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    WHERE p.project_date >= CURRENT_DATE
    ORDER BY p.project_date, p.name
    LIMIT 5;`
  );

  return result.rows;
};

export const getProjectById = async (projectId) => {
  const result = await query(
    `SELECT
      p.project_id AS "projectId",
      p.name,
      p.description,
      TO_CHAR(p.project_date, 'YYYY-MM-DD') AS "projectDate",
      o.organization_id AS "organizationId",
      o.name AS "organizationName"
    FROM projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;`,
    [projectId]
  );

  return result.rows[0];
};

export const createProject = async ({ organizationId, name, description, projectDate }) => {
  const result = await query(
    `INSERT INTO projects (organization_id, name, description, project_date)
    VALUES ($1, $2, $3, $4)
    RETURNING project_id AS "projectId", name, description, TO_CHAR(project_date, 'YYYY-MM-DD') AS "projectDate";`,
    [organizationId, name, description, projectDate]
  );

  return result.rows[0];
};

export const updateProject = async (projectId, { organizationId, name, description, projectDate }) => {
  const result = await query(
    `UPDATE projects
    SET organization_id = $1,
      name = $2,
      description = $3,
      project_date = $4
    WHERE project_id = $5
    RETURNING project_id AS "projectId", name, description, TO_CHAR(project_date, 'YYYY-MM-DD') AS "projectDate";`,
    [organizationId, name, description, projectDate, projectId]
  );

  return result.rows[0];
};

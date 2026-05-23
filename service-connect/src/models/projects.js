import { query } from "../database.js";

export const getAllProjects = async () => {
  const result = await query(
    `SELECT
      p.project_id AS "projectId",
      p.name,
      p.description,
      p.project_date AS "projectDate",
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
      p.project_date AS "projectDate",
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

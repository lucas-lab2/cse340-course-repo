import { query } from "../database.js";

export const getAllProjects = async () => {
  const result = await query(
    `SELECT
      p.project_id AS "projectId",
      p.name,
      p.description,
      o.name AS "organizationName"
    FROM projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    ORDER BY p.name;`
  );

  return result.rows;
};

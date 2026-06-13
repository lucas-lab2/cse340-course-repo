import { query } from "../database.js";

export const addVolunteerToProject = async (userId, projectId) => {
  const result = await query(
    `INSERT INTO project_volunteers (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING
    RETURNING user_id AS "userId", project_id AS "projectId";`,
    [userId, projectId]
  );

  return result.rows[0];
};

export const removeVolunteerFromProject = async (userId, projectId) => {
  const result = await query(
    `DELETE FROM project_volunteers
    WHERE user_id = $1
      AND project_id = $2
    RETURNING user_id AS "userId", project_id AS "projectId";`,
    [userId, projectId]
  );

  return result.rows[0];
};

export const isUserVolunteeringForProject = async (userId, projectId) => {
  const result = await query(
    `SELECT 1
    FROM project_volunteers
    WHERE user_id = $1
      AND project_id = $2;`,
    [userId, projectId]
  );

  return result.rowCount > 0;
};

export const getVolunteerProjectsByUserId = async (userId) => {
  const result = await query(
    `SELECT
      p.project_id AS "projectId",
      p.name,
      p.description,
      TO_CHAR(p.project_date, 'YYYY-MM-DD') AS "projectDate",
      o.organization_id AS "organizationId",
      o.name AS "organizationName"
    FROM project_volunteers pv
    JOIN projects p
      ON pv.project_id = p.project_id
    JOIN organizations o
      ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.project_date, p.name;`,
    [userId]
  );

  return result.rows;
};

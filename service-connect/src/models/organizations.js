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

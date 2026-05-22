import { query } from "../database.js";

export const getAllCategories = async () => {
  const result = await query(
    `SELECT
      category_id AS "categoryId",
      name
    FROM categories
    ORDER BY name;`
  );

  return result.rows;
};

import { pool, query } from "../database.js";

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

export const getCategoryById = async (categoryId) => {
  const result = await query(
    `SELECT
      category_id AS "categoryId",
      name
    FROM categories
    WHERE category_id = $1;`,
    [categoryId]
  );

  return result.rows[0];
};

export const createCategory = async (name) => {
  const result = await query(
    `INSERT INTO categories (name)
    VALUES ($1)
    RETURNING category_id AS "categoryId", name;`,
    [name]
  );

  return result.rows[0];
};

export const updateCategory = async (categoryId, name) => {
  const result = await query(
    `UPDATE categories
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id AS "categoryId", name;`,
    [name, categoryId]
  );

  return result.rows[0];
};

export const getCategoriesByProjectId = async (projectId) => {
  const result = await query(
    `SELECT
      c.category_id AS "categoryId",
      c.name
    FROM categories c
    JOIN project_categories pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;`,
    [projectId]
  );

  return result.rows;
};

export const getProjectsByCategoryId = async (categoryId) => {
  const result = await query(
    `SELECT
      p.project_id AS "projectId",
      p.name,
      p.description,
      TO_CHAR(p.project_date, 'YYYY-MM-DD') AS "projectDate",
      o.organization_id AS "organizationId",
      o.name AS "organizationName"
    FROM projects p
    JOIN project_categories pc
      ON p.project_id = pc.project_id
    JOIN organizations o
      ON p.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date, p.name;`,
    [categoryId]
  );

  return result.rows;
};

export const updateCategoriesForProject = async (projectId, categoryIds) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM project_categories WHERE project_id = $1;", [projectId]);

    for (const categoryId of categoryIds) {
      await client.query(
        `INSERT INTO project_categories (project_id, category_id)
        VALUES ($1, $2);`,
        [projectId, categoryId]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

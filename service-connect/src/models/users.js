import { query } from "../database.js";

export const getAllUsers = async () => {
  const result = await query(
    `SELECT
      user_id AS "userId",
      name,
      email,
      role
    FROM users
    ORDER BY role, name, email;`
  );

  return result.rows;
};

export const getUserByEmail = async (email) => {
  const result = await query(
    `SELECT
      user_id AS "userId",
      name,
      email,
      password_hash AS "passwordHash",
      role
    FROM users
    WHERE email = $1;`,
    [email]
  );

  return result.rows[0];
};

export const getUserById = async (userId) => {
  const result = await query(
    `SELECT
      user_id AS "userId",
      name,
      email,
      role
    FROM users
    WHERE user_id = $1;`,
    [userId]
  );

  return result.rows[0];
};

export const createUser = async ({ name, email, passwordHash, role = "user" }) => {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id AS "userId", name, email, role;`,
    [name, email, passwordHash, role]
  );

  return result.rows[0];
};

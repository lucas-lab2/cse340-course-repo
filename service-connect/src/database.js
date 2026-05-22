import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
const isLocalDatabase = databaseUrl?.includes("localhost") || databaseUrl?.includes("127.0.0.1");

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl && !isLocalDatabase ? { rejectUnauthorized: false } : false,
});

export const query = async (text, params = []) => {
  const result = await pool.query(text, params);
  return result;
};

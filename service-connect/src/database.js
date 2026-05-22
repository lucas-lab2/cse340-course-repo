import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Check your .env file.");
}

const isLocalDatabase =
  databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
});

export const query = async (text, params = []) => {
  const result = await pool.query(text, params);
  return result;
};
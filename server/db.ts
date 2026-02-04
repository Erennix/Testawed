import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema.ts";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

// Allow the app to run without a database for simple deployments.
export const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;
export const db = databaseUrl ? drizzle(pool, { schema }) : null;

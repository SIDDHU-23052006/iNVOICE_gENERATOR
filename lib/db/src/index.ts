import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  // During local development fallback or compile-time check, we can avoid throwing
  // if we don't call query methods immediately.
}

const sql = neon(databaseUrl || "");
export const db = drizzle(sql, { schema });

export * from "./schema";

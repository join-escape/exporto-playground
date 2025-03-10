import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle as drizzleLocal, LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/db/schema";

// This allows us to use different databases in different environments
let db: DrizzleD1Database<typeof schema> | LibSQLDatabase<typeof schema>;

// For local development
if (process.env.NODE_ENV === "development") {
  const client = createClient({
    url: "file:./local.db",
  });
  db = drizzleLocal(client, { schema });
} else {
  // In production on Cloudflare, D1 is injected into the environment
  // This will be handled by the Cloudflare runtime
  db = drizzle(DrizzleD1Database, { schema });
}

export { db };

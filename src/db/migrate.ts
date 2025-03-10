import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const runMigrations = async () => {
  const client = createClient({
    url: "file:./local.db",
  });

  const db = drizzle(client);

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "src/db/migrations" });

  console.log("Migrations completed!");
  process.exit(0);
};

runMigrations().catch((error) => {
  console.error("Error running migrations:", error);
  process.exit(1);
});

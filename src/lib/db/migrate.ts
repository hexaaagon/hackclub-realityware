import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "@/lib/db/index";

const runMigrate = async () => {
  console.log("⏳ Running Database migrations...");
  const start = Date.now();

  // Database Migrations
  await migrate(db, { migrationsFolder: "src/lib/db/migrations" });

  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});

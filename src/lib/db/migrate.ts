import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "@/lib/db/index";

const runMigrate = async () => {
  if (!process.env.SUPABASE_DATABASE_SESSION_POOLER_NOT_RECOMMENDED) {
    throw new Error("DATABASE_URL is not defined");
  }

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

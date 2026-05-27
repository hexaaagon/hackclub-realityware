import { spawnSync } from "node:child_process";

const shouldSkip =
  process.env.SKIP_DB_MIGRATIONS === "1" ||
  process.env.SKIP_DB_MIGRATIONS === "true";

const hasRequiredEnv = Boolean(
  process.env.SUPABASE_DATABASE_TRANSACTION_POOLER,
);

if (shouldSkip) {
  console.log("ℹ️  Skipping database migrations (SKIP_DB_MIGRATIONS set)");
  process.exit(0);
}

if (!hasRequiredEnv) {
  console.log(
    "ℹ️  Skipping database migrations (SUPABASE_DATABASE_TRANSACTION_POOLER not set)",
  );
  process.exit(0);
}

const result = spawnSync("bun", ["run", "migrate"], { stdio: "inherit" });
process.exit(result.status ?? 1);

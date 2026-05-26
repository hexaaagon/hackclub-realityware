import type { env as defaultEnv } from "@realityware/env";
import type { env as slackEnv } from "@realityware/env/slack";
import { createEnv } from "@t3-oss/env-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import z from "zod";

export type DefaultEnv = typeof defaultEnv;
export type SlackEnv = typeof slackEnv;
export type Envs = DefaultEnv | SlackEnv;

export function isSlackEnv(env: Envs): env is SlackEnv {
  return (env as SlackEnv).SLACK_APP_TOKEN !== undefined;
}

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
  },
  runtimeEnv: process.env,
});

export const client = postgres(env.DATABASE_URL);
export const db = drizzle({ client });

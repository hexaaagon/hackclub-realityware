import type { AuthType } from "@realityware/auth/server";
import type { account } from "@realityware/database/schema/user";
import { Hono } from "hono";
import type { HonoOptions } from "hono/hono-base";
import type { Schema } from "hono/types";

export type BackendEnv = {
  Bindings: AuthType;
  Variables: AuthType & {
    account: typeof account.$inferSelect & {
      session: AuthType["session"];
    };
  };
};

export function HonoApp<CustomSchema extends Schema>(
  params?: HonoOptions<BackendEnv>,
) {
  return new Hono<BackendEnv, CustomSchema>(params);
}

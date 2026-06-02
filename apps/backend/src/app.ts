import type { AuthType } from "@realityware/auth/server";
import { Hono } from "hono";
import type { HonoOptions } from "hono/hono-base";
import type { Schema } from "hono/types";

export function HonoApp<CustomSchema extends Schema>(
  params?: HonoOptions<{ Bindings: AuthType; Variables: AuthType }>,
) {
  return new Hono<{ Bindings: AuthType; Variables: AuthType }, CustomSchema>(
    params,
  );
}

import type { AuthType } from "@realityware/auth/server";
import { Hono } from "hono";
import type { HonoOptions } from "hono/hono-base";

export const HonoApp = (
  params?: HonoOptions<{ Bindings: AuthType; Variables: AuthType }>,
) => new Hono<{ Bindings: AuthType; Variables: AuthType }>(params);

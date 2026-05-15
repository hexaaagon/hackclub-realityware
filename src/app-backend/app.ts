import { Hono } from "hono";
import type { HonoOptions } from "hono/hono-base";
import { type AuthType } from "@/lib/auth";

export const HonoApp = (
  params?: HonoOptions<{ Bindings: AuthType; Variables: AuthType }>,
) => new Hono<{ Bindings: AuthType; Variables: AuthType }>(params);

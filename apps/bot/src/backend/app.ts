import { Hono } from "hono";
import type { HonoOptions } from "hono/hono-base";

export const HonoApp = (params?: HonoOptions<object>) => new Hono(params);

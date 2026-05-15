import { Hono } from "hono";
export const router = new Hono<{ Bindings: AuthType }>();

import { type AuthType, auth } from "@/lib/auth";

router.on(["GET", "POST"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

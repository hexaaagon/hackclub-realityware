import { HonoApp } from "../app";
export const router = HonoApp();

import { auth } from "@realityware/auth/server";

router.on(["GET", "POST"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

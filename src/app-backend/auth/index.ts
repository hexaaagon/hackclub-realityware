import { HonoApp } from "../app";
export const router = HonoApp();

import { auth } from "@/lib/auth";

router.on(["GET", "POST"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

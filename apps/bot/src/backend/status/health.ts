import { authorizationProxy } from "../../lib/authorization";
import { HonoApp } from "../app";
export const router = HonoApp();

router.get("/", authorizationProxy, (c) => {
  return c.json({
    uptime: process.uptime(),
    time: Date.now(),
  });
});

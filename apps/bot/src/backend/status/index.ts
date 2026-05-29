import { authorizationProxy } from "../../lib/authorization";
import { getCurrentGitHash } from "../../lib/git";
import { HonoApp } from "../app";
export const router = HonoApp();

router.get("/", authorizationProxy, async (c) => {
  const gitHash = await getCurrentGitHash();

  return c.json({
    gitHash,
    uptime: process.uptime(),
  });
});

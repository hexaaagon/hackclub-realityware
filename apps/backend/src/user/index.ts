import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

export const userRouter = HonoApp().get("/", authMiddleware(), async (c) => {
  const account = c.get("account");

  return c.json({
    success: true,
    account,
  });
});

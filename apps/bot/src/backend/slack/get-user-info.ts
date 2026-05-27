import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { app } from "../../app";
import { HonoApp } from "../app";
export const router = HonoApp();

router.get(
  "/",
  zValidator(
    "query",
    z.object({
      slackId: z.string().startsWith("U"),
    }),
  ),
  async (c) => {
    const { slackId } = c.req.query();
    if (!slackId) {
      return c.json({ error: "Missing slackId parameter" }, 400);
    }

    const result = app.client.users.info({
      user: slackId,
    });

    const userInfo = await result;

    if (!userInfo.ok) {
      return c.json({ error: "Failed to fetch user info" }, 500);
    }

    return c.json(userInfo);
  },
);

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

router.post(
  "/message",
  zValidator(
    "json",
    z.object({
      channel: z.string().regex(/^(U|C)/),
      message: z
        .object({
          blocks: z.array(
            z.object({ type: z.string(), text: z.any() }).loose(),
          ),
        })
        .optional(),
      text: z.string(),
    }),
  ),
  async (c) => {
    const { slackId, message, text } = c.req.valid("json");

    try {
      const result = await app.client.chat.postMessage({
        channel: slackId,
        blocks: message?.blocks,
        text,
      });

      if (!result.ok) {
        return c.json({ error: "Failed to send message" }, 500);
      }

      return c.json({ success: true, ts: result.ts });
    } catch (error) {
      console.error("Error sending message:", error);
      return c.json({ error: "Failed to send message" }, 500);
    }
  },
);

router.delete(
  "/message",
  zValidator(
    "json",
    z.object({
      channel: z.string(),
      ts: z.string(),
    }),
  ),
  async (c) => {
    const { channel, ts } = c.req.valid("json");

    try {
      const result = await app.client.chat.delete({
        channel,
        ts,
      });

      if (!result.ok) {
        return c.json({ error: "Failed to delete message" }, 500);
      }

      return c.json({ success: true });
    } catch (error) {
      console.error("Error deleting message:", error);
      return c.json({ error: "Failed to delete message" }, 500);
    }
  },
);

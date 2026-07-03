import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { HonoApp } from "../app";

export const rsvpRouter = HonoApp().get(
  "/",
  zValidator(
    "query",
    z.object({
      email: z.email(),
      anon_id: z.string(),
    }),
  ),
  async (c) => {
    const { email } = c.req.valid("query");

    return c.redirect(
      `https://realityware.fillout.com/rsvp?email=${encodeURIComponent(email)}`,
    );
  },
);

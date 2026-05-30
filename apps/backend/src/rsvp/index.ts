import { zValidator } from "@hono/zod-validator";
import { auth } from "@realityware/auth/server";
import { env } from "@realityware/env";
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
    const { email } = c.req.query();

    if (email.startsWith(env.SIGNUP_ACCESS_BYPASS_PREFIX || "")) {
      const data = await auth.api.signInWithOAuth2({
        body: {
          providerId: "hca",
          additionalData: {
            login_hint: email,
            anon_id: c.req.query("anon_id"),
          },
        },
      });

      return c.redirect(data.url);
    }

    return c.redirect(
      `https://realityware.fillout.com/rsvp?email=${encodeURIComponent(email)}`,
    );
  },
);

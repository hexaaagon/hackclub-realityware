import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { HonoApp } from "../app";
export const router = HonoApp();

router.get(
  "/",
  zValidator(
    "query",
    z.object({
      email: z.email(),
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

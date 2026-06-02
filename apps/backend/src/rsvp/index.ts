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
      const { response, headers: responseHeaders } =
        await auth.api.signInWithOAuth2({
          returnHeaders: true,
          headers: c.req.raw.headers,
          body: {
            providerId: "hca",
            additionalData: {
              login_hint: email,
              anon_id: c.req.query("anon_id"),
            },
          },
        });

      if (responseHeaders) {
        const setCookies = responseHeaders.getSetCookie?.() ?? [];
        if (setCookies.length > 0) {
          for (const cookie of setCookies) {
            c.res.headers.append("set-cookie", cookie);
          }
        } else {
          const setCookie = responseHeaders.get("set-cookie");
          if (setCookie) {
            c.header("set-cookie", setCookie);
          }
        }
      }

      return c.redirect(response.url);
    }

    return c.redirect(
      `https://realityware.fillout.com/rsvp?email=${encodeURIComponent(email)}`,
    );
  },
);

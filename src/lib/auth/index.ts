import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "hackclub",
          discoveryUrl:
            "https://auth.hackclub.com/.well-known/openid-configuration",
          clientId: process.env.HCA_CLIENT_ID,
          clientSecret: process.env.HCA_CLIENT_SECRET,
          scopes: [
            "openid",
            "email",
            "name",
            "profile",
            "verification_status",
            "slack_id",
          ],
        },
      ],
    }),
    nextCookies(),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;

      if (!newSession) {
        return;
      }

      // Store auth event data in response headers for client-side tracking
      const { user } = newSession;
      const authEvent: Record<string, string> = {
        userId: user.id,
        userEmail: user.email || "",
        userName: user.name || "",
        userCreatedAt: user.createdAt?.toString() || "",
      };

      if (ctx.path.startsWith("/callback/identity")) {
        const isNewUser =
          newSession.session.createdAt.getTime() === user.createdAt.getTime();
        authEvent.eventType = isNewUser ? "user_signed_up" : "user_signed_in";
        authEvent.method = "hackclub-identity";
      }

      // Set custom header for client to read
      if (authEvent.eventType && ctx.context.responseHeaders) {
        ctx.context.responseHeaders.set(
          "X-Auth-Event",
          JSON.stringify(authEvent),
        );
      }
    }),
    before: createAuthMiddleware(async (ctx) => {
      // Store request path for error tracking
      if (ctx.context.responseHeaders) {
        ctx.context.responseHeaders.set("X-Auth-Path", ctx.path);
      }
    }),
  },
});

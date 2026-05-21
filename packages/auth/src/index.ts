import { db } from "@realityware/database";
import * as schema from "@realityware/database/schema/auth";
import { supabaseService } from "@realityware/database/supabase/service-server";
import { env } from "@realityware/env";
import {
  captureServerless,
  getPostHogServer,
} from "@realityware/telemetry/server";
import { encryptData, encryptPlugin } from "@realityware/util/crypto";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  user: {
    additionalFields: {
      encrypted_name: { type: "string", required: true },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["hca", "hackatime"],
      allowDifferentEmails: true,
    },
    encryptOAuthTokens: true,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/oauth2") {
        const { login_hint: loginHint } = ctx.body.additionalData;

        // validate login_hint thing to prevent abuse
        if (!loginHint || typeof loginHint !== "string") {
          throw new APIError("BAD_REQUEST", {
            message: "Missing or invalid login_hint",
          });
        }

        // rsvp thing i supposed
        if (env.NEXT_PUBLIC_SIGNUP_ACCESS_DISABLED) {
          if (
            (loginHint || "").startsWith(env.SIGNUP_ACCESS_BYPASS_PREFIX || "")
          ) {
            ctx.body.login_hint = loginHint.replace(
              env.SIGNUP_ACCESS_BYPASS_PREFIX || "",
              "",
            );
          } else {
            throw new APIError("UNAUTHORIZED", {
              message: "what are u doing lil bro",
            });
          }
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      const userId =
        ctx.context.session?.user.id || ctx.context.newSession?.user.id;

      const newSession = ctx.context.newSession;
      if (!newSession) return;

      // 2. Capture Successful OAuth2 Logins/Sign-Ups
      if (ctx.path.startsWith("/oauth2/callback/")) {
        try {
          await supabaseService.rpc("set_user_id", { user_id: userId });
        } catch (e) {
          console.error("Supabase identify failed", e);
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, _context) => {
          if (user.name) {
            user.encrypted_name = await encryptData(user.name);
            user.name = "encrypted";
          }

          return { data: user };
        },
      },
    },
  },
  plugins: [
    encryptPlugin(),
    genericOAuth({
      config: [
        {
          providerId: "hca",
          discoveryUrl:
            "https://auth.hackclub.com/.well-known/openid-configuration",
          clientId: env.HCA_CLIENT_ID,
          clientSecret: env.HCA_CLIENT_SECRET,
          scopes: [
            "openid",
            "email",
            "name",
            "profile",
            "verification_status",
            "slack_id",
          ],
          authorizationUrlParams: (ctx) => {
            const loginHint = ctx.body.additionalData?.login_hint as string;
            const params: Record<string, string> = {};

            if (loginHint) {
              params.login_hint = loginHint;
            }

            return params;
          },
        },
        {
          providerId: "hackatime",
          clientId: env.HACKATIME_CLIENT_ID,
          clientSecret: env.HACKATIME_CLIENT_SECRET,
          authorizationUrl: "https://hackatime.hackclub.com/oauth/authorize",
          tokenUrl: "https://hackatime.hackclub.com/oauth/token",
          userInfoUrl: "https://hackatime.hackclub.com/api/v1/authenticated/me",
          getUserInfo: async (tokens) => {
            const response = await fetch(
              "https://hackatime.hackclub.com/api/v1/authenticated/me",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              },
            );

            if (!response.ok) {
              throw new Error("Failed to fetch user info from Hackatime");
            }

            const data = (await response.json()) as {
              id: number;
              emails: string[];
              slack_id: string | null;
              github_username: string;
              trust_factor:
                | {
                    trust_level: "yellow";
                    trust_score: 3;
                  }
                | {
                    trust_level: "green";
                    trust_score: 2;
                  }
                | {
                    trust_level: "red";
                    trust_score: 1;
                  }
                | {
                    trust_level: "blue";
                    trust_score: 0;
                  };
            };

            return {
              id: data.id,
              email: data.emails[0] || null,
              name: data.github_username,
              emailVerified: true,
            };
          },
          scopes: ["profile", "read"],
        },
      ],
    }),
    nextCookies(),
  ],
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

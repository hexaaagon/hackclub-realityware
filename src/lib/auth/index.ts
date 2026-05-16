import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import { env } from "@/env";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema/auth";
import { decryptData, encryptData } from "../actions/crypto";
import { supabaseService } from "../db/supabase/service-server";

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
      // storing the auth path for posthog nerds
      if (ctx.context.responseHeaders) {
        ctx.context.responseHeaders.set("X-Auth-Path", ctx.path);
      }

      if (ctx.path === "/sign-in/oauth2") {
        // validate login_hint thing to prevent abuse
        const { login_hint: loginHint } = ctx.body.additionalData;
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
      const userId = ctx.context.session?.user.id;
      if (userId) {
        console.log("user id:", userId);

        try {
          await supabaseService.rpc("set_user_id", { user_id: userId });
        } catch {
          console.error("failed to set user id for supabase client");
          // TODO: setup posthog error tracking here
        }
      } else {
        console.log("no user id?");
      }

      const newSession = ctx.context.newSession;
      if (!newSession) return;

      // storing the auth event for posthog nerds
      const { user } = newSession;
      const authEvent: Record<string, string> = {
        userId: user.id,
        userEmail: user.email || "",
        userName: user.name || "",
        userCreatedAt: user.createdAt?.toString() || "",
      };

      if (ctx.path.startsWith("/callback/hca")) {
        const isNewUser =
          newSession.session.createdAt.getTime() === user.createdAt.getTime();
        authEvent.eventType = isNewUser ? "user_signed_up" : "user_signed_in";
        authEvent.method = "hca";
      }

      if (authEvent.eventType && ctx.context.responseHeaders) {
        ctx.context.responseHeaders.set(
          "X-Auth-Event",
          JSON.stringify(authEvent),
        );
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
    {
      id: "decrypt-session-pii",
      hooks: {
        after: [
          {
            matcher: (context) => context.path === "/get-session",
            handler: createAuthMiddleware(async (ctx) => {
              const returned = ctx.context.returned;
              if (!returned || typeof returned !== "object") return;

              const sessionResponse = returned as {
                user?: {
                  encrypted_name?: string | null;
                  name?: string | null;
                } | null;
              };

              const user = sessionResponse.user;
              if (!user) return;

              const encryptedName = user.encrypted_name;
              if (!encryptedName) return;

              try {
                user.name = await decryptData(encryptedName);
              } catch {
                console.error(
                  "Failed to decrypt user name for session response",
                );
                user.name = null;
              }
            }),
          },
        ],
      },
    },
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

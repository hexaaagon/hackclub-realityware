import posthog from "@realityware/telemetry";
import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  fetchOptions: {
    onError: (ctx) => {
      const error = new Error(ctx.error.message || "Authentication error");

      posthog.captureException(error, {
        tags: {
          code: ctx.error.code,
          status: ctx.error.status,
          source: "better-auth-client",
        },
        extra: {
          response: ctx.response,
          error: ctx.error,
        },
      });

      posthog.capture("auth_error", {
        message: ctx.error.message,
        code: ctx.error.code,
        status: ctx.error.status,
        $exception: true,
      });
    },
  },
  plugins: [genericOAuthClient()],
});

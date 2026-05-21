import { authClient } from "@realityware/auth/client";
import { env } from "@realityware/env";
import posthog from "posthog-js";

export const initialize = async () => {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST_API,
    ui_host: env.NEXT_PUBLIC_POSTHOG_HOST_UI,
    defaults: "2025-11-30",
  });

  const auth = await authClient.getSession();

  if (auth.data) {
    posthog.identify(posthog.get_distinct_id(), {
      email: auth.data.user.email,
      name: auth.data.user.name,
      admin: `${env.NEXT_PUBLIC_APP_URL}/admin/user/${auth.data.user.id}?source=telemetry`,
    });
  }
};

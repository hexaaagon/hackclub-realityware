import { env } from "@realityware/env";
import posthog from "posthog-js";

export const initialize = () =>
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST_API,
    ui_host: env.NEXT_PUBLIC_POSTHOG_HOST_UI,
    defaults: "2025-11-30",
  });

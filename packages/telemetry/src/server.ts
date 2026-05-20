import { env } from "@realityware/env";
import { PostHog } from "posthog-node";

let posthogInstance: PostHog | null = null;

export function getPostHogServer() {
  if (!posthogInstance) {
    posthogInstance = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST_API,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogInstance;
}

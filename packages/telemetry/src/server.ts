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

export async function captureServerless(
  params: Parameters<PostHog["captureImmediate"]>[0],
) {
  const client = getPostHogServer();
  try {
    await client.captureImmediate(params);
  } catch (error) {
    console.error("Failed to forward event to PostHog:", error);
  }
}

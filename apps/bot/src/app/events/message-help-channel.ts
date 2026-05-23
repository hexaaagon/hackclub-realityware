import type { App } from "@slack/bolt";
import { setLastProcessedMessageTs } from "../../data";
import type { EventHandlerArgs, EventManifest } from "../lib/handler";
import { checkFAQ } from "../lib/hcai";
import { CallPriority, rateLimitedCall } from "../lib/rateLimiter";
import { createTicket, resolveTicket } from "../lib/ticket";

export const manifest: EventManifest = {
  title: "Help Channel Handler",
  event: "message",
};

export async function handler(
  app: App,
  { event, client, logger }: EventHandlerArgs<"message">,
) {
  const helpChannel = process.env.HELP_CHANNEL;
  if (!helpChannel) {
    logger.error("❌ HELP_CHANNEL environment variable is not set");
    return;
  }

  // Only process new messages in the help channel (not thread replies)
  if (event.channel !== helpChannel || event.thread_ts) return;
  const subtype = (event as any).subtype;
  if (subtype && subtype !== "file_share") return; // Skip edited messages, etc.

  const message = event as {
    text: string;
    ts: string;
    channel: string;
    user: string;
  };
  const ticket = await createTicket(message, client, logger);

  // Update last processed message timestamp
  setLastProcessedMessageTs(message.ts);

  // Check FAQ in background (fire and forget)
  if (ticket && message.text) {
    (async () => {
      try {
        const faqResult = await checkFAQ(message.text);
        if (faqResult) {
          // Post FAQ as reply in the same thread
          await rateLimitedCall(
            "chat.postMessage",
            () =>
              client.chat.postMessage({
                channel: message.channel,
                thread_ts: message.ts,
                text:
                  faqResult +
                  "\n\nPlease reply in this thread if this doesn't answer your question!",
              }),
            CallPriority.Normal,
          );

          await resolveTicket(ticket, "system", client, logger); // Auto-resolve with FAQ answer
        }
      } catch (error) {
        logger.warn("Failed to check FAQ:", error);
      }
    })();
  }
}

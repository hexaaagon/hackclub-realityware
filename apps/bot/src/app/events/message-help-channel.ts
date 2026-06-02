import type { App, GenericMessageEvent } from "@slack/bolt";
import { setLastProcessedMessageTs } from "../../lib/database";
import type { EventHandlerArgs, EventManifest } from "../../lib/handler";
import { createTicket } from "../../lib/ticket";

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

  const messageEvent = event as GenericMessageEvent;

  // Only process new messages in the help channel (not thread replies)
  if (messageEvent.channel !== helpChannel || messageEvent.thread_ts) return;
  const subtype = messageEvent.subtype;
  if (subtype && subtype !== "file_share") return; // Skip edited messages, etc.

  if (!messageEvent.ts || !messageEvent.user || !messageEvent.channel) return;

  const message = messageEvent as {
    text: string;
    ts: string;
    channel: string;
    user: string;
  };

  await createTicket(message, client, logger);
  setLastProcessedMessageTs(message.ts);
}

import type { App } from "@slack/bolt";
import type { EventHandlerArgs, EventManifest } from "../lib/handler";
import { getCachedBotUserId } from "../lib/slack";
import { updateQueueMessage } from "../lib/ticket";

export const manifest: EventManifest = {
  title: "Ticket Channel Queue Reposter",
  event: "message",
};

export async function handler(
  app: App,
  { event, client, logger }: EventHandlerArgs<"message">,
) {
  const ticketsChannel = process.env.TICKETS_CHANNEL;
  if (!ticketsChannel) {
    logger.error("❌ TICKETS_CHANNEL environment variable is not set");
    return;
  }

  const message = event as any;

  // Debug logging
  if (event.channel === ticketsChannel) {
    logger.info(
      `📨 Message in tickets channel - user: ${message.user}, bot_id: ${message.bot_id}, thread: ${message.thread_ts}, subtype: ${message.subtype}`,
    );
  }

  // Only process new messages in tickets channel (not thread replies)
  if (event.channel !== ticketsChannel) return;
  if (message.thread_ts) return; // Skip thread replies
  if (message.subtype) return; // Skip edited messages, message_deleted, etc.

  // Skip bot messages - check if user is the bot itself
  if (!message.user) return; // No user means it's not a regular message
  const botUserId = getCachedBotUserId();
  if (botUserId && message.user === botUserId) return; // Skip messages from the bot itself
  if (message.bot_id) return; // Skip any bot messages

  logger.info(
    "📌 User message detected in tickets channel, reposting queue message",
  );

  // Repost queue message to keep it at the bottom
  await updateQueueMessage(client, logger, true);
}

import type { App } from "@slack/bolt";
import { isTicketChannelMember } from "../../data";
import type { EventHandlerArgs, EventManifest } from "../lib/handler";
import { handleStaffResponse, handleUserResponse } from "../lib/ticket";

export const manifest: EventManifest = {
  title: "Handle Ticket Responses",
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

  // Only process thread replies in the help channel
  if (!event.thread_ts || event.channel !== helpChannel) return;
  if (event.thread_ts === event.ts) return;
  const subtype = (event as any).subtype;
  if (subtype && subtype !== "file_share") return; // Skip edited messages, etc.

  const threadReply = event as {
    thread_ts: string;
    user: string;
    text?: string;
  };

  // Check if user is help staff
  if (isTicketChannelMember(threadReply.user)) {
    await handleStaffResponse(
      threadReply.user,
      threadReply.thread_ts,
      threadReply.text || "",
      client,
      logger,
    );
  } else {
    await handleUserResponse(threadReply.thread_ts, client, logger);
  }
}

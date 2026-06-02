import type { App, GenericMessageEvent } from "@slack/bolt";
import { TICKET_DELETED_MESSAGE } from "../../lib/constants";
import { getTicketByOriginalTs } from "../../lib/database";
import type { EventHandlerArgs, EventManifest } from "../../lib/handler";
import { resolveTicket } from "../../lib/ticket";

export const manifest: EventManifest = {
  title: "Help Channel Delete Resolver",
  event: "message",
};

export async function handler(
  app: App,
  { event, client, logger }: EventHandlerArgs<"message">,
) {
  console.log("uh i feel itchy");
  const helpChannel = process.env.HELP_CHANNEL;
  if (!helpChannel) {
    logger.error("❌ HELP_CHANNEL environment variable is not set");
    return;
  }

  const messageEvent = event as GenericMessageEvent;
  const msg = event as any;

  if (messageEvent.channel !== helpChannel) return;
  console.log("something happened");
  console.log(messageEvent);
  if (
    messageEvent.subtype !== "message_changed" ||
    msg.message.subtype !== "tombstone" ||
    msg.message.user !== "USLACKBOT" ||
    !msg.message.hidden
  )
    return;

  const ticket = getTicketByOriginalTs(msg.previous_message.ts);
  if (!ticket) return;

  await resolveTicket(ticket, "system", client, logger, TICKET_DELETED_MESSAGE);
}

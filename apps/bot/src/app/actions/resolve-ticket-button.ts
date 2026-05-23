import type { App } from "@slack/bolt";
import { getTicketByOriginalTs, isTicketChannelMember } from "../../data";
import type { ActionHandlerArgs, ActionManifest } from "../lib/handler";
import { CallPriority, rateLimitedCall } from "../lib/rateLimiter";
import { resolveTicket } from "../lib/ticket";

export const manifest: ActionManifest = {
  title: "Resolve Ticket Button",
  trigger: "resolve_ticket_button",
};

export async function handler(
  app: App,
  { body, ack, client, logger }: ActionHandlerArgs,
) {
  await ack();

  const userId = (body.user || {}).id;
  const messageTs =
    (body as any).message?.thread_ts || (body as any).message?.ts;

  if (!messageTs) return;

  const ticket = getTicketByOriginalTs(messageTs);
  if (!ticket) {
    logger.warn(`No ticket found for thread ${messageTs}`);
    return;
  }

  try {
    const messageInfo = await rateLimitedCall(
      "conversations.history",
      () =>
        client.conversations.history({
          channel: ticket.originalChannel,
          latest: ticket.originalTs,
          limit: 1,
          inclusive: true,
        }),
      CallPriority.High,
    );

    const isOriginalAuthor =
      messageInfo.messages &&
      messageInfo.messages[0] &&
      messageInfo.messages[0].user === userId;

    if (isOriginalAuthor || isTicketChannelMember(userId)) {
      const success = await resolveTicket(ticket, userId, client, logger);
      if (success) {
        logger.info(
          `Ticket ${ticket.originalTs} resolved via button by ${userId} (${isOriginalAuthor ? "original author" : "help staff"})`,
        );
      }
    } else {
      logger.info(
        `User ${userId} tried to resolve ticket but is neither OP nor help staff`,
      );
    }
  } catch (error) {
    logger.error("❌ Error handling resolve button:", error);
  }
}

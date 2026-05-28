import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { app } from "../../app";
import { authorizationProxy } from "../../lib/authorization";
import { getTicketByOriginalTs } from "../../lib/database";
import { resolveTicket } from "../../lib/ticket";
import { HonoApp } from "../app";
export const router = HonoApp();

router.get(
  "/",
  authorizationProxy,
  zValidator("query", z.object({ ticketTs: z.string() })),
  async (c) => {
    const { ticketTs } = c.req.valid("query");

    const ticket = getTicketByOriginalTs(ticketTs);
    if (!ticket) {
      return c.json({ error: "Ticket not found" }, 404);
    }

    return c.json({ ticket });
  },
);

router.patch(
  "/",
  authorizationProxy,
  zValidator(
    "json",
    z.object({
      ticketTs: z.string(),
      resolverId: z.string().startsWith("U").optional(),
    }),
  ),
  async (c) => {
    const { resolverId, ticketTs } = c.req.valid("json");

    const ticket = getTicketByOriginalTs(ticketTs);
    console.log(ticket);
    if (!ticket) {
      return c.json({ error: "Ticket not found" }, 404);
    }

    try {
      await resolveTicket(
        ticket,
        resolverId || "system",
        app.client,
        (app as any).logger,
      );
    } catch (error) {
      console.error("Error resolving ticket:", error);
      return c.json({ error: "Failed to resolve ticket" }, 500);
    }

    return c.json({ success: true });
  },
);

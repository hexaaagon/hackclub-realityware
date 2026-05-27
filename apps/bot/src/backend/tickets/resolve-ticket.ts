import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { app } from "../../app";
import { getTicketByOriginalTs } from "../../app/lib/database";
import { resolveTicket } from "../../app/lib/ticket";
import { HonoApp } from "../app";
export const router = HonoApp();

router.patch(
  "/",
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

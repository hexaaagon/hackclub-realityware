import {
  leaderboard,
  leaderboardHistory,
  metadata,
  ticket,
} from "@realityware/database/schema/ticket";
import { db } from "@realityware/database/slack";

// Cache of user IDs who have access to the tickets channel (help staff)
export let ticketChannelMembers: string[] = [];

/**
 * Checks if a user is a member of the tickets channel (i.e., help staff).
 */
export function isTicketChannelMember(userId: string): boolean {
  return ticketChannelMembers.includes(userId);
}

/**
 * Updates the cache of ticket channel members.
 */
export function setTicketChannelMembers(members: string[]) {
  ticketChannelMembers = members;
}

/**
 * Represents information about a ticket created from a help channel message.
 */
export interface TicketInfo {
  originalChannel: string;
  originalTs: string;
  ticketMessageTs: string;
  // List of help staff members who have responded to this ticket
  responders: string[];
  // Whether ticket is currently marked as resolved
  resolved: boolean;
  // Timestamp when the grace period timer should expire (null if no timer active)
  graceTimerExpiry: number | null;
  // Whether the ticket is force-kept open with !open command
  forceOpen: boolean;
  // Last message author's user ID to track who replied last
  lastResponderId: string | null;
  // Whether ticket currently needs help (shown in queue)
  inQueue: boolean;
  // The timestamp of the bot's "ticket closed" message (if exists)
  closureMessageTs?: string;
  // Timestamp of the last manual resolution (used to prevent immediate un-resolve)
  lastResolvedTs?: number;
}

/**
 * Represents a leaderboard entry for ticket resolutions.
 */
export interface LBEntry {
  slack_id: string;
  count_of_tickets: number;
}

// In-memory storage for tickets, keyed by ticket message timestamp
export const tickets: Record<string, TicketInfo> = {};

// Maps original message timestamps to ticket message timestamps for quick lookup
export const ticketsByOriginalTs: Record<string, string> = {};

// Tracks ticket resolutions for the current day's leaderboard
export let lbForToday: LBEntry[] = [];

// Timestamp of the last processed message in the help channel (for recovery)
let lastProcessedMessageTs: string | null = null;

/**
 * Persists all ticket and leaderboard data to PostgreSQL.
 */
export async function saveTicketData() {
  try {
    await db.transaction(async (tx) => {
      // Save tickets
      for (const [ts, ticketInfo] of Object.entries(tickets)) {
        await tx
          .insert(ticket)
          .values({
            ticketTs: ts,
            originalChannel: ticketInfo.originalChannel,
            originalTs: ticketInfo.originalTs,
            responders: ticketInfo.responders,
            resolved: ticketInfo.resolved,
            graceTimerExpiry: ticketInfo.graceTimerExpiry,
            forceOpen: ticketInfo.forceOpen,
            lastResponderId: ticketInfo.lastResponderId,
            inQueue: ticketInfo.inQueue,
            closureMessageTs: ticketInfo.closureMessageTs,
            lastResolvedTs: ticketInfo.lastResolvedTs,
          })
          .onConflictDoUpdate({
            target: ticket.ticketTs,
            set: {
              originalChannel: ticketInfo.originalChannel,
              originalTs: ticketInfo.originalTs,
              responders: ticketInfo.responders,
              resolved: ticketInfo.resolved,
              graceTimerExpiry: ticketInfo.graceTimerExpiry,
              forceOpen: ticketInfo.forceOpen,
              lastResponderId: ticketInfo.lastResponderId,
              inQueue: ticketInfo.inQueue,
              closureMessageTs: ticketInfo.closureMessageTs,
              lastResolvedTs: ticketInfo.lastResolvedTs,
            },
          });
      }

      // Save leaderboard
      await tx.delete(leaderboard);
      if (lbForToday.length > 0) {
        await tx.insert(leaderboard).values(
          lbForToday.map((entry) => ({
            slackId: entry.slack_id,
            countOfTickets: entry.count_of_tickets,
          })),
        );
      }

      // Save metadata
      if (lastProcessedMessageTs) {
        await tx
          .insert(metadata)
          .values({
            key: "lastProcessedMessageTs",
            value: lastProcessedMessageTs,
          })
          .onConflictDoUpdate({
            target: metadata.key,
            set: { value: lastProcessedMessageTs },
          });
      }
    });

    console.log("✅ Ticket data saved to PostgreSQL");
  } catch (error) {
    console.error("❌ Error saving ticket data to PostgreSQL:", error);
  }
}

/**
 * Loads all ticket and leaderboard data from PostgreSQL.
 * Returns true if data was loaded, false on error.
 */
export async function loadTicketData(): Promise<boolean> {
  try {
    // Clear existing data first
    Object.keys(tickets).forEach((key) => {
      delete tickets[key];
    });
    Object.keys(ticketsByOriginalTs).forEach((key) => {
      delete ticketsByOriginalTs[key];
    });
    lbForToday.length = 0;

    // Load tickets
    const ticketRows = await db.select().from(ticket);
    for (const row of ticketRows) {
      const ticketInfo: TicketInfo = {
        originalChannel: row.originalChannel,
        originalTs: row.originalTs,
        ticketMessageTs: row.ticketTs,
        responders: row.responders ?? [],
        resolved: row.resolved,
        graceTimerExpiry: row.graceTimerExpiry ?? null,
        forceOpen: row.forceOpen,
        lastResponderId: row.lastResponderId ?? null,
        inQueue: row.inQueue,
        closureMessageTs: row.closureMessageTs ?? undefined,
        lastResolvedTs: row.lastResolvedTs ?? undefined,
      };
      tickets[row.ticketTs] = ticketInfo;
      ticketsByOriginalTs[row.originalTs] = row.ticketTs;
    }

    // Load leaderboard
    const lbRows = await db.select().from(leaderboard);
    lbForToday = lbRows.map((row) => ({
      slack_id: row.slackId,
      count_of_tickets: row.countOfTickets,
    }));

    // Load metadata
    const metaRows = await db.select().from(metadata);
    for (const row of metaRows) {
      if (row.key === "lastProcessedMessageTs") {
        lastProcessedMessageTs = row.value || null;
      }
    }

    console.log(
      `✅ Loaded ${Object.keys(tickets).length} tickets from PostgreSQL`,
    );
    return true;
  } catch (error) {
    console.error("❌ Error loading ticket data from PostgreSQL:", error);
    return false;
  }
}

/**
 * Retrieves a ticket by its original message timestamp.
 */
export function getTicketByOriginalTs(originalTs: string): TicketInfo | null {
  const ticketTs = ticketsByOriginalTs[originalTs];
  return ticketTs ? (tickets[ticketTs] ?? null) : null;
}

/**
 * Retrieves a ticket by its ticket message timestamp.
 */
export function getTicketByTicketTs(ticketTs: string): TicketInfo | null {
  return tickets[ticketTs] ?? null;
}

/**
 * Adds a ticket resolution to the leaderboard.
 */
export function addResolution(userId: string) {
  const existing = lbForToday.find((entry) => entry.slack_id === userId);
  if (existing) {
    existing.count_of_tickets += 1;
    return;
  }

  lbForToday.push({
    slack_id: userId,
    count_of_tickets: 1,
  });
}

/**
 * Resets the leaderboard for a new day.
 */
export function resetLeaderboard() {
  lbForToday = [];
}

/**
 * Saves leaderboard to history before resetting for a new day.
 */
export async function saveLeaderboardHistory() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    for (const entry of lbForToday) {
      await db
        .insert(leaderboardHistory)
        .values({
          date: today,
          slackId: entry.slack_id,
          countOfTickets: entry.count_of_tickets,
        })
        .onConflictDoUpdate({
          target: [leaderboardHistory.date, leaderboardHistory.slackId],
          set: { countOfTickets: entry.count_of_tickets },
        });
    }
    console.log("✅ Leaderboard history saved");
  } catch (error) {
    console.error("❌ Error saving leaderboard history:", error);
  }
}

/**
 * Gets the last processed message timestamp.
 */
export function getLastProcessedMessageTs(): string | null {
  return lastProcessedMessageTs;
}

/**
 * Updates the last processed message timestamp.
 */
export function setLastProcessedMessageTs(ts: string) {
  lastProcessedMessageTs = ts;
}

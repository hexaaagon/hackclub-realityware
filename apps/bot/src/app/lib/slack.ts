import {
  isTicketChannelMember,
  lbForToday,
  resetLeaderboard,
  saveLeaderboardHistory,
  saveTicketData,
  setTicketChannelMembers,
} from "../../data";
import { STARTUP_MESSAGE } from "./constants";
import { CallPriority, rateLimitedCall } from "./rateLimiter";

let botUserId: string | null = null;

export function getCachedBotUserId(): string | null {
  return botUserId;
}

export async function getBotUserId(client: any): Promise<string | null> {
  try {
    const result: any = await rateLimitedCall(
      "auth.test",
      () => client.auth.test(),
      CallPriority.Low,
    );
    if (result.ok && result.user_id) {
      botUserId = result.user_id;
      console.log(`🤖 Bot user ID: ${botUserId}`);
      return botUserId;
    }
  } catch (error: any) {
    console.error("❌ Failed to get bot user ID:", error.message);
  }
  return null;
}

/**
 * Refreshes the cache of ticket channel members by fetching from Slack.
 */
export async function refreshTicketChannelMembers(
  client: any,
): Promise<boolean> {
  try {
    const ticketsChannel = process.env.TICKETS_CHANNEL;
    if (!ticketsChannel) {
      console.error("❌ TICKETS_CHANNEL environment variable is not set");
      return false;
    }

    console.log(`📋 Fetching members for channel: ${ticketsChannel}`);
    const result: any = await rateLimitedCall(
      "conversations.members",
      () =>
        client.conversations.members({
          channel: ticketsChannel,
        }),
      CallPriority.Low,
    );

    if (result.ok && result.members) {
      setTicketChannelMembers(result.members);
      console.log(
        `✅ Found ${result.members.length} members in tickets channel`,
      );
      return true;
    }

    console.warn(
      `⚠️  Failed to fetch members. Response: ${JSON.stringify(result)}`,
    );
    return false;
  } catch (error: any) {
    console.error("❌ Failed to fetch ticket channel members:", error.message);
    console.error(
      "   Make sure the bot has access to the channel and the TICKETS_CHANNEL ID is correct",
    );
    return false;
  }
}

/**
 * Sends a startup notification DM to a specified user.
 */
export async function notifyStartup(
  client: any,
  userId: string,
): Promise<boolean> {
  try {
    await rateLimitedCall(
      "chat.postMessage",
      () =>
        client.chat.postMessage({
          channel: userId,
          text: STARTUP_MESSAGE,
        }),
      CallPriority.Low,
    );
    console.log(`✅ Sent startup notification to <@${userId}>`);
    return true;
  } catch (error: any) {
    console.error(
      `❌ Failed to send startup notification to ${userId}:`,
      error.message,
    );
    return false;
  }
}

/**
 * Posts the daily leaderboard to the tickets channel and resets it.
 */
export async function postLeaderboardAndReset(client: any) {
  try {
    const ticketsChannel = process.env.TICKETS_CHANNEL;
    if (!ticketsChannel) {
      console.error("❌ TICKETS_CHANNEL environment variable is not set");
      return;
    }

    const staffLB = lbForToday.filter((entry) =>
      isTicketChannelMember(entry.slack_id),
    );

    if (staffLB.length === 0) {
      console.log("📊 No staff resolutions today, skipping leaderboard");
    } else {
      const sortedLB = staffLB.sort(
        (a, b) => b.count_of_tickets - a.count_of_tickets,
      );
      const leaderboardText = sortedLB
        .map(
          (entry, index) =>
            `${index + 1}. <@${entry.slack_id}> resolved *${entry.count_of_tickets}*`,
        )
        .join("\n");

      await rateLimitedCall(
        "chat.postMessage",
        () =>
          client.chat.postMessage({
            channel: ticketsChannel,
            text: `📊 Today's Top Resolvers:\n${leaderboardText}`,
          }),
        CallPriority.Low,
      );
    }

    // Save leaderboard to history before resetting
    await saveLeaderboardHistory();
    resetLeaderboard();
    await saveTicketData();
  } catch (error) {
    console.error("❌ Error posting leaderboard:", error);
  }
}

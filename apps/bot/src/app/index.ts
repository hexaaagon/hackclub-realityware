import { env } from "@realityware/env/slack";
import { App, LogLevel } from "@slack/bolt";
import { app as honoApp } from "../backend";
import {
  AUTO_SAVE_INTERVAL_MS,
  LEADERBOARD_POST_INTERVAL_MS,
  MEMBER_REFRESH_INTERVAL_MS,
  STARTUP_NOTIFICATION_USER_ID,
  TIMER_CHECK_INTERVAL_MS,
} from "../lib/constants";
import { loadTicketData } from "../lib/database";
import { actionHandler, eventHandler } from "../lib/handler";
import {
  getBotUserId,
  notifyStartup,
  postLeaderboardAndReset,
  refreshTicketChannelMembers,
} from "../lib/slack";

export const app = new App({
  token: env.SLACK_BOT_TOKEN,
  appToken: env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.WARN,
});
export const client = app.client;

const EXPLICIT_DISCONNECT_ERROR =
  "Unhandled event 'server explicit disconnect'";

process.on("uncaughtException", (error) => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes(EXPLICIT_DISCONNECT_ERROR)) {
    console.error(
      "❌ Slack socket-mode explicitly disconnected during connect. This typically indicates an invalid/revoked SLACK_APP_TOKEN or missing connections:write scope. Verify your Slack app token and try again.",
    );
    process.exit(1);
  }

  console.error("❌ Uncaught exception:", error);
  process.exit(1);
});

async function startBot() {
  try {
    eventHandler(app);
    actionHandler(app);

    await loadTicketData();
    await app.start();

    console.log("⚡️ Slack Bolt app is running!");

    // Send startup notification
    const client = app.client;
    if (STARTUP_NOTIFICATION_USER_ID) {
      await notifyStartup(client, STARTUP_NOTIFICATION_USER_ID);
    }

    // Get bot user ID for message filtering
    await getBotUserId(client);

    // Initialize ticket channel members cache
    const membersLoaded = await refreshTicketChannelMembers(client);
    if (!membersLoaded) {
      console.warn(
        "⚠️  Could not load ticket channel members initially. The bot will attempt to fetch them periodically.",
      );
    }

    // Perform startup recovery and scan for missed messages
    const { performStartupRecovery, scanForMissedMessages } = await import(
      "../lib/startupRecovery"
    );

    // Scan for missed messages (must run before regular recovery to catch offline messages)
    await scanForMissedMessages(client, console);

    // Run recovery in background (non-blocking)
    performStartupRecovery(client, console).catch((error) => {
      console.error("❌ Background recovery failed:", error);
    });

    // Refresh ticket channel members periodically
    setInterval(
      () => refreshTicketChannelMembers(client),
      MEMBER_REFRESH_INTERVAL_MS,
    );

    // Check grace timers periodically
    const { checkGraceTimers } = await import("../lib/ticket");
    setInterval(
      () => checkGraceTimers(client, console),
      TIMER_CHECK_INTERVAL_MS,
    );

    // Save ticket data periodically as a backup
    const { saveTicketData } = await import("../lib/database");
    setInterval(saveTicketData, AUTO_SAVE_INTERVAL_MS);

    // Post daily leaderboard and reset for next day
    setInterval(
      () => postLeaderboardAndReset(client),
      LEADERBOARD_POST_INTERVAL_MS,
    );
  } catch (error) {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  }
}

startBot();
export default {
  port: 3001,
  fetch: honoApp.fetch,
};

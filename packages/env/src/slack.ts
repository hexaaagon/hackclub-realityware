import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.url(),

    // Dashboard Integration
    DASHBOARD_URL: z.url(),
    DASHBOARD_BACKEND_URL: z.url(),
    DASHBOARD_BACKEND_TOKEN: z.string().min(64).max(64),

    // Slack Bot & App token
    SLACK_BOT_TOKEN: z.string(),
    SLACK_APP_TOKEN: z.string(),

    // Channels
    HELP_CHANNEL: z.string(),
    TICKETS_CHANNEL: z.string(),

    // Notification User
    STARTUP_NOTIFICATION_USER_ID: z.string().optional(),
  },
  runtimeEnv: process.env,
});

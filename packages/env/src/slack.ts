import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    SLACK_BOT_TOKEN: z.string(),
    SLACK_APP_TOKEN: z.string(),
    HELP_CHANNEL: z.string(),
    TICKETS_CHANNEL: z.string(),
    STARTUP_NOTIFICATION_USER_ID: z.string().optional(),
    WELCOME_MESSAGE_TEXT: z.string().optional(),
    TICKET_RESOLVED_MESSAGE: z.string().optional(),
  },
  runtimeEnv: process.env,
});

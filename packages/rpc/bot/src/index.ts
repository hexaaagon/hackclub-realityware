import type { BotAppType } from "@realityware/rpc-types";
import { hc } from "hono/client";

const baseUrl = process.env.SLACK_BOT_BACKEND_API;
if (!baseUrl) {
  throw new Error("Environment variable 'SLACK_BOT_BACKEND_API' is not set");
}

export const client = hc<BotAppType>(baseUrl);

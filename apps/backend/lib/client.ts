import { hc } from "hono/client";
import type { AppType } from "../src";

const baseUrl =
  process.env.DASHBOARD_BACKEND_URL ||
  `${process.env.NEXT_PUBLIC_APP_URL}/api` ||
  "/api";
export const client = hc<AppType>(baseUrl);

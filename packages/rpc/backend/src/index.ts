import type { BackendAppType } from "@realityware/rpc-types";
import { hc } from "hono/client";

const baseUrl =
  process.env.DASHBOARD_BACKEND_URL ||
  `${process.env.NEXT_PUBLIC_APP_URL}/api` ||
  "/api";
export const client = hc<BackendAppType>(baseUrl);

import type { AppType } from "@realityware/backend"
import { hc } from "hono/client"

const baseUrl = process.env.DASHBOARD_BACKEND_URL || process.env.NEXT_PUBLIC_APP_URL || "/api"
export const client = hc<AppType>(baseUrl);

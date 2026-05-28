import { env } from "@realityware/env/slack";
import type { Context, Next } from "hono";

export function authorizationProxy(
  c: Context,
  next: Next,
): Response | Promise<void> {
  const authHeader = c.req.header("authorization");
  if (!checkAuthorizationHeader(authHeader)) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
}

export function checkAuthorizationHeader(
  authHeader: string | undefined,
): boolean {
  if (!authHeader) return false;
  if (!authHeader.startsWith("Basic ")) return false;

  const token = authHeader.slice(6).trim();
  const expectedToken = env.DASHBOARD_BACKEND_TOKEN;
  return token === expectedToken;
}

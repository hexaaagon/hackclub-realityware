import { Hono } from "hono";
export const router = new Hono();

// auth routes
router.route("/auth/*", (await import("./auth")).router);

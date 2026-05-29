import { HonoApp } from "./app";
export const router = HonoApp();

// slack
router.route("/slack", (await import("./slack")).router);

// status
router.route("/status", (await import("./status")).router);
router.route("/status/health", (await import("./status/health")).router);

// tickets
router.route("/tickets", (await import("./tickets")).router);

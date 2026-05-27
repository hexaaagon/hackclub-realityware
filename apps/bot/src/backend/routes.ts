import { HonoApp } from "./app";
export const router = HonoApp();

// slack
router.route("/slack/*", (await import("./slack")).router);

// tickets
router.route("/tickets/*", (await import("./tickets")).router);

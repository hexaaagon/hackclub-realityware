import { HonoApp } from "./app";
export const router = HonoApp();

// slack
router.route(
  "/slack/get-user-info/*",
  (await import("./slack/get-user-info")).router,
);

// tickets
router.route(
  "/tickets/resolve/*",
  (await import("./tickets/resolve-ticket")).router,
);

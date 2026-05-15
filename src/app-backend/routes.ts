import { HonoApp } from "./app";
export const router = HonoApp();

router.route("/auth/*", (await import("./auth")).router);
router.route("/rsvp/*", (await import("./rsvp")).router);

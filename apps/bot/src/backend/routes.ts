import { HonoApp } from "./app";
import { router as slackRouter } from "./slack";
import { router as statusRouter } from "./status";
import { router as statusHealthRouter } from "./status/health";
import { router as ticketsRouter } from "./tickets";

export const router = HonoApp();

// slack
router.route("/slack", slackRouter);

// status
router.route("/status", statusRouter);
router.route("/status/health", statusHealthRouter);

// tickets
router.route("/tickets", ticketsRouter);

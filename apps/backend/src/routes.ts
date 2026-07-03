import { adminProjectRouter } from "./admin/projects";
import { adminUserRouter } from "./admin/users";
import { HonoApp } from "./app";
import { authRouter } from "./auth";
import { bountyRouter } from "./bounty";
import { leaderboardRouter } from "./leaderboard";
import { marketRouter } from "./market";
import { meRouter } from "./me";
import { projectsRouter } from "./projects";
import { rsvpRouter } from "./rsvp";
import { shopRouter } from "./shop";
import { userRouter } from "./user";
import { userProjectRouter } from "./user/projects";

export const router = HonoApp()
  .route("/auth", authRouter)
  .route("/rsvp", rsvpRouter)
  .route("/user", userRouter)
  .route("/user/projects", userProjectRouter)
  .route("/admin/users", adminUserRouter)
  .route("/admin/projects", adminProjectRouter)
  .route("/me", meRouter)
  .route("/shop", shopRouter)
  .route("/bounties", bountyRouter)
  .route("/leaderboard", leaderboardRouter)
  .route("/market", marketRouter)
  .route("/projects", projectsRouter)
  .route("/admin/users", adminUserRouter);
export type RouterRoutes = typeof router;

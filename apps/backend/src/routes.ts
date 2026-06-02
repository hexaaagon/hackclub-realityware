import { HonoApp } from "./app";
import { authRouter } from "./auth";
import { rsvpRouter } from "./rsvp";
import { userRouter } from "./user";
import { userProjectRouter } from "./user/projects";

export const router = HonoApp()
  .route("/auth", authRouter)
  .route("/rsvp", rsvpRouter)
  .route("/user", userRouter)
  .route("/user/projects", userProjectRouter);
export type RouterRoutes = typeof router;

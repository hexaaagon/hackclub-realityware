import { adminProjectRouter } from "./admin/projects";
import { adminUserRouter } from "./admin/users";
import { HonoApp } from "./app";
import { authRouter } from "./auth";
import { rsvpRouter } from "./rsvp";
import { userRouter } from "./user";
import { userProjectRouter } from "./user/projects";

export const router = HonoApp()
  .route("/auth", authRouter)
  .route("/rsvp", rsvpRouter)
  .route("/user", userRouter)
  .route("/user/projects", userProjectRouter)
  .route("/admin/users", adminUserRouter)
  .route("/admin/projects", adminProjectRouter);
export type RouterRoutes = typeof router;

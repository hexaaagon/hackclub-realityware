import { router } from "@/app-backend/routes";
import { HonoApp } from "./app";

export const app = HonoApp().basePath("/api");
export type AppType = typeof app;

app.route("/", router);

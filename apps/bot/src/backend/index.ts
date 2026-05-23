import { HonoApp } from "./app";
import { router } from "./routes";

export const app = HonoApp().basePath("/api");
export type AppType = typeof app;

app.route("/", router);

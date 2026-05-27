import { HonoApp } from "./app";
import { router } from "./routes";

export const app = HonoApp().basePath("/");
export type AppType = typeof app;

app.route("/", router);

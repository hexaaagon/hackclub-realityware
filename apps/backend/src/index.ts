import { HonoApp } from "./app";
import { type RouterRoutes, router } from "./routes";

export const app = HonoApp().basePath("/api");
export type AppType = RouterRoutes;

app.route("/", router);

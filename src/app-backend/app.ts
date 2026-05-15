import { Hono } from "hono";
import type { HonoOptions } from "hono/hono-base";
import type { AuthType } from "@/lib/auth";
import { router } from "./routes";

export const App = (...params: [HonoOptions<{ Bindings: AuthType }>]) =>
  new Hono<{ Bindings: AuthType }>(...params);
export const app = new Hono().basePath("/api");

app.route("/", router);

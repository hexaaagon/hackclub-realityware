import { zValidator } from "@hono/zod-validator";
import { db, eq } from "@realityware/database";
import { account } from "@realityware/database/schema/user";
import z from "zod";
import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

export const adminUserRouter = HonoApp()
  .get("/", authMiddleware("admin"), async (c) => {
    const users = await db.select().from(account);
    return c.json({ success: true, users });
  })
  .get("/:id", authMiddleware("admin"), async (c) => {
    const { id } = c.req.param();
    const user = await db
      .select()
      .from(account)
      .where(eq(account.id, Number(id)))
      .then(([user]) => user);

    return c.json({ user });
  })
  .patch(
    "/:id",
    authMiddleware("admin"),
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        shards: z.number().optional(),
      }),
    ),
    async (c) => {
      const body = await c.req.json();
      const { id } = c.req.param();

      const updatedUser = await db
        .update(account)
        .set({
          displayName: body.name,
          shards: body.shards,
        })
        .where(eq(account.id, Number(id)))
        .returning()
        .then(([user]) => user);

      return c.json({ user: updatedUser });
    },
  );

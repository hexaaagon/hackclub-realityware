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
  .get(
    "/:id",
    authMiddleware("admin"),
    zValidator(
      "param",
      z.object({
        id: z.string().regex(/^\d+$/).transform(Number),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = await db
        .select()
        .from(account)
        .where(eq(account.id, id))
        .then(([user]) => user);

      if (!user) {
        return c.json({ success: false, message: "User not found" }, 404);
      }

      return c.json({ success: true, user });
    },
  )
  .patch(
    "/:id",
    authMiddleware("admin"),
    zValidator(
      "param",
      z.object({
        id: z.string().regex(/^\d+$/).transform(Number),
      }),
    ),
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        shards: z.number().optional(),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");
      const { id } = c.req.valid("param");

      const updatedUser = await db
        .update(account)
        .set({
          displayName: body.name,
          shards: body.shards,
        })
        .where(eq(account.id, id))
        .returning()
        .then(([user]) => user);

      return c.json({ success: true, user: updatedUser });
    },
  );

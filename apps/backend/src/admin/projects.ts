import { zValidator } from "@hono/zod-validator";
import { db, eq } from "@realityware/database";
import { project, projectTypeEnum } from "@realityware/database/schema/project";
import { account } from "@realityware/database/schema/user";
import z from "zod";
import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

export const adminProjectRouter = HonoApp()
  .get("/", authMiddleware("admin"), async (c) => {
    const projectData = await Promise.all((await db.select().from(project)).sort((a, b) => a.id - b.id).map(async (data) => {
      const author = (await db.select().from(account).where(eq(account.id, data.userId)))[0];
      return { ...data, author };
    }))
    return c.json({ success: true, project: projectData });
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
      const projectData = await db
        .select()
        .from(project)
        .where(eq(project.id, id));

      if (!projectData) {
        return c.json({ success: false, message: "User not found" }, 404);
      }

      return c.json({
        success: true,
        project: projectData,
      });
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
        type: z.enum(projectTypeEnum.enumValues).optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        codeUrl: z.url().optional(),
        playableUrl: z.url().optional(),
        imageUrl: z.url().optional(),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");
      const { id } = c.req.valid("param");

      const updatedUser = await db
        .update(project)
        .set({
          type: body.type,
          name: body.name,
          description: body.description,
          codeUrl: body.codeUrl,
          playableUrl: body.playableUrl,
          imageUrl: body.imageUrl,
        })
        .where(eq(account.id, id))
        .returning()
        .then(([user]) => user);

      return c.json({ success: true, user: updatedUser });
    },
  );

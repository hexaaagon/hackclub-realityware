import { zValidator } from "@hono/zod-validator";
import { auth } from "@realityware/auth/server";
import { and, db, eq } from "@realityware/database";
import {
  project,
  projectTypeEnum,
  shippedProject,
} from "@realityware/database/schema/project";
import z from "zod";
import { HonoApp } from "../app";

export const userProjectRouter = HonoApp()
  .get("/", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ projects: [] });
    }

    const projects = await db
      .select()
      .from(project)
      .where(eq(project.userId, session.user.id));

    return c.json({ projects });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        type: z.enum(projectTypeEnum.enumValues),
        name: z.string(),
        description: z.string(),
        codeUrl: z.string(),
        playableUrl: z.string(),
        imageUrl: z.string(),
      }),
    ),
    async (c) => {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!session) {
        return c.json({ project: null });
      }

      const data = c.req.valid("json");

      const [newProject] = await db
        .insert(project)
        .values({
          userId: session.user.id,
          ...data,
        })
        .returning();

      return c.json({ project: newProject });
    },
  )
  .get("/:id", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ project: null });
    }

    const { id } = c.req.param();

    const projectData = await db
      .select()
      .from(project)
      .where(
        and(eq(project.id, Number(id)), eq(project.userId, session.user.id)),
      )
      .then((res) => res[0]);

    return c.json({ project: projectData });
  })
  .patch(
    "/:id",
    zValidator(
      "json",
      z.object({
        type: z.enum(projectTypeEnum.enumValues).optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        codeUrl: z.string().optional(),
        playableUrl: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    ),
    async (c) => {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!session) {
        return c.json({ project: null });
      }

      const { id } = c.req.param();

      const data = c.req.valid("json");

      const [updatedProject] = await db
        .update(project)
        .set(data)
        .where(
          and(eq(project.id, Number(id)), eq(project.userId, session.user.id)),
        )
        .returning();

      return c.json({ project: updatedProject });
    },
  )
  .delete("/:id", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ success: false });
    }

    const { id } = c.req.param();

    await db
      .delete(project)
      .where(
        and(eq(project.id, Number(id)), eq(project.userId, session.user.id)),
      );

    return c.json({ success: true });
  })
  .post("/:id/ship", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ success: false });
    }

    const { id } = c.req.param();

    const projectData = await db
      .select()
      .from(project)
      .where(
        and(eq(project.id, Number(id)), eq(project.userId, session.user.id)),
      )
      .then((res) => res[0]);

    if (!projectData) {
      return c.json({ success: false });
    }

    await db.insert(shippedProject).values({
      projectId: projectData.id,
    });

    return c.json({ success: true });
  });

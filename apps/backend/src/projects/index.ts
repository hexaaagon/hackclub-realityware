import { zValidator } from "@hono/zod-validator";
import { db, desc, eq, max } from "@realityware/database";
import { project, shippedProject } from "@realityware/database/schema/project";
import { account } from "@realityware/database/schema/user";
import z from "zod";
import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

// Featured project showcase: recent projects across the program with their
// author + latest shipped timestamp. (`project` has no created_at, so "time ago"
// derives from the latest project_shipped_status.shipped_at.)
export const projectsRouter = HonoApp().get(
  "/featured",
  authMiddleware(),
  zValidator(
    "query",
    z.object({ limit: z.coerce.number().int().min(1).max(24).optional() }),
  ),
  async (c) => {
    const { limit = 6 } = c.req.valid("query");

    const projects = await db
      .select({
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type,
        codeUrl: project.codeUrl,
        playableUrl: project.playableUrl,
        imageUrl: project.imageUrl,
        authorName: account.displayName,
        authorSlackId: account.slackId,
        authorAvatar: account.avatar,
        shippedAt: max(shippedProject.shippedAt),
      })
      .from(project)
      .innerJoin(account, eq(project.userId, account.id))
      .leftJoin(shippedProject, eq(shippedProject.projectId, project.id))
      .groupBy(project.id, account.id)
      .orderBy(desc(project.id))
      .limit(limit);

    return c.json({ success: true, projects });
  },
);

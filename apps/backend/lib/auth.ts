import { betterFetch } from "@better-fetch/fetch";
import { auth } from "@realityware/auth/server";
import { db, eq } from "@realityware/database";
import type { UserPermission } from "@realityware/database/schema/user";
import { account as accountTable } from "@realityware/database/schema/user";
import { profileSchema } from "@realityware/shared/schema/cachet/profile";
import type { Context, Next } from "hono";
import type { BackendEnv } from "../src/app";

export const authMiddleware =
  (role?: UserPermission | UserPermission[]) =>
  async (c: Context<BackendEnv>, next: Next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ success: false, message: "not-logged-in" });
    }

    let account = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.userId, session.user.id))
      .then((res) => res[0]);

    if (!account) {
      return c.json({ success: false, message: "account-not-found" });
    }

    if (account.updatedAt.getTime() < Date.now() - 1000 * 60 * 60 * 24) {
      const profile = await betterFetch(
        `https://cachet.dunkirk.sh/users/${account.slackId}`,
        {
          output: profileSchema,
        },
      );

      if (profile.data && !("message" in profile.data)) {
        const updated = (
          await db
            .update(accountTable)
            .set({
              displayName: profile.data.displayName,
              avatar: profile.data.imageUrl,
              updatedAt: new Date(),
            })
            .where(eq(accountTable.userId, session.user.id))
            .returning()
        )[0];

        if (updated) {
          account = updated;
        }
      }
    }

    if (role) {
      const permissions = account.permissions || [];
      if (Array.isArray(role)) {
        const matches = permissions.some((perm) =>
          role.includes(perm as UserPermission),
        );

        if (!matches) {
          return c.json({
            success: false,
            message: "insufficient-permissions",
          });
        }
      } else {
        if (!permissions.includes(role)) {
          return c.json({
            success: false,
            message: "insufficient-permissions",
          });
        }
      }
    }

    c.set("user", session.user);
    c.set("session", session.session);
    c.set("account", { ...account, session: session.session });

    return next();
  };

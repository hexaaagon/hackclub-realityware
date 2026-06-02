import { betterFetch } from "@better-fetch/fetch";
import { auth } from "@realityware/auth/server";
import { db, eq } from "@realityware/database";
import { account } from "@realityware/database/schema/user";
import { profileSchema } from "@realityware/shared/schema/cachet/profile";
import { HonoApp } from "../app";

export const userRouter = HonoApp().get("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ success: false });
  }

  let userAccount = await db
    .select()
    .from(account)
    .where(eq(account.userId, session.user.id))
    .then((res) => res[0]);

  if (
    (userAccount?.updatedAt.getTime() ?? 0) <
    Date.now() - 1000 * 60 * 60 * 24
  ) {
    const profile = await betterFetch(
      `https://cachet.dunkirk.sh/users/${userAccount?.slackId}`,
      {
        output: profileSchema,
      },
    );

    if (profile.data && !("message" in profile.data)) {
      userAccount = (
        await db
          .update(account)
          .set({
            displayName: profile.data.displayName,
            avatar: profile.data.imageUrl,
            updatedAt: new Date(),
          })
          .where(eq(account.userId, session.user.id))
          .returning()
      )[0];
    }
  }

  return c.json({
    success: true,
    account: { ...userAccount, session: session.session },
  });
});

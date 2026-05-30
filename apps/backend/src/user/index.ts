import { auth } from "@realityware/auth/server";
import { db, eq } from "@realityware/database";
import { account } from "@realityware/database/schema/user";
import { HonoApp } from "../app";

export const userRouter = HonoApp().get("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ user: null });
  }

  const user = await db
    .select()
    .from(account)
    .where(eq(account.userId, session.user.id))
    .then((res) => res[0]);

  return c.json({ user: { ...user, session: session.session } });
});

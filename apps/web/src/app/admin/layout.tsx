import { auth } from "@realityware/auth";
import { db, eq } from "@realityware/database";
import { account } from "@realityware/database/schema/user";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userData = await db
    .select()
    .from(account)
    .where(eq(account.userId, session?.user.id ?? ""))
    .limit(1);

  if (!session || !(userData[0].permissions || []).includes("admin"))
    return notFound();

  return children;
}

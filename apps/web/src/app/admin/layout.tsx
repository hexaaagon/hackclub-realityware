import { auth } from "@realityware/auth";
import { db, eq } from "@realityware/database";
import { account } from "@realityware/database/schema/user";
import { headers } from "next/headers";

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

  if (!session || !userData[0] || !userData[0].permissions.includes("admin")) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-red-500">
            Access Denied
          </h1>
          <p className="text-gray-700">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

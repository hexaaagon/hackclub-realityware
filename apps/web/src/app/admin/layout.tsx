import { auth } from "@realityware/auth";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return children;
}

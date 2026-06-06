import { auth } from "@realityware/auth";
import { db, eq } from "@realityware/database";
import { account } from "@realityware/database/schema/user";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { adminPermissions as permissions } from "../(_nav)/_permissions";
import { AppSidebar } from "../(_nav)/app-sidebar";
import { SiteBody } from "../(_nav)/site-body";
import { SiteHeader } from "../(_nav)/site-header";

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

  if (!session || !userData[0].permissions) return notFound();

  const matches = userData[0].permissions.some((perm) =>
    permissions.includes(perm),
  );
  if (!matches) {
    const memberMatch = userData[0].permissions.filter(
      (perm) => perm !== "member",
    );
    if (memberMatch.length === 0) {
      return notFound();
    }

    return redirect(`/admin/${memberMatch[0]}`);
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" permissions={userData[0].permissions} />
      <SidebarInset>
        <SiteHeader type="admin" />
        <SiteBody>{children}</SiteBody>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { client } from "@realityware/rpc-backend";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { fulfillmentPermissions as permissions } from "../(_nav)/_permissions";
import { AppSidebar } from "../(_nav)/app-sidebar";
import { SiteBody } from "../(_nav)/site-body";
import { SiteHeader } from "../(_nav)/site-header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = await headers();
  const user = await (
    await client.user.$get(
      {},
      {
        headers: Object.fromEntries(header.entries()),
      },
    )
  ).json();

  if (!user.success || !user.account.permissions) return notFound();

  const matches = user.account.permissions.some((perm) =>
    permissions.includes(perm),
  );
  if (!matches) {
    const memberMatch = user.account.permissions.filter(
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
          "--radius": "8px",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader type="fulfillment" />
        <SiteBody>{children}</SiteBody>
      </SidebarInset>
    </SidebarProvider>
  );
}

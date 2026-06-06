"use client";

import { ArrowUDownLeftIcon } from "@phosphor-icons/react";
import type { UserPermission } from "@realityware/database/schema/user";
import { client } from "@realityware/rpc-backend";
import type { InferResponseType } from "hono/client";
import Link from "next/link";
import type * as React from "react";
import useSWR from "swr";
import { NavBody } from "@/app/admin/(nav)/nav-body";
import { NavUser } from "@/app/admin/(nav)/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navs } from "./_links";

export type UserResponse = Exclude<
  InferResponseType<typeof client.user.$get>,
  string
>;

export function AppSidebar({
  permissions,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  permissions: UserPermission[];
}) {
  const account = useSWR<UserResponse>("api/user", async () => {
    const data = await client.user.$get({});

    if (data.ok) {
      const body = await data.json();
      return body;
    } else {
      return { success: false as false };
    }
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-2">
            <SidebarMenuButton
              asChild
              className="h-full w-max p-2 rounded-md hover:invert transition-all"
            >
              <Link href="/admin">
                <span className="text-3xl font-sacco">Realityware</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild className="w-max h-full">
              <Link href="/">
                <ArrowUDownLeftIcon />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navs.map((nav) => {
          if (!permissions.some((perm) => nav.permissions?.includes(perm))) return null;

          return <NavBody key={nav.title} items={nav} />;
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser isLoading={account.isLoading} user={account.data} />
      </SidebarFooter>
    </Sidebar>
  );
}

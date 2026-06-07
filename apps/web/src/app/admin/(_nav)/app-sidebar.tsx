"use client";

import { ArrowUDownLeftIcon } from "@phosphor-icons/react";
import type { UserPermission } from "@realityware/database/schema/user";
import type { client } from "@realityware/rpc-backend";
import type { InferResponseType } from "hono/client";
import Link from "next/link";
import type * as React from "react";
import { useEffect, useState } from "react";
import { NavBody } from "@/app/admin/(_nav)/nav-body";
import { NavUser } from "@/app/admin/(_nav)/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { navs } from "./_links";
import { NavSecondary } from "./nav-secondary";

export type UserResponse = Extract<
  InferResponseType<typeof client.user.$get>,
  { success: true }
>;

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: UserResponse;
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        {isMounted ? (
          navs.map((nav) => {
            if (
              !user.account.permissions?.some((perm) =>
                nav.permissions?.includes(perm),
              )
            )
              return null;

            return <NavBody key={nav.title} items={nav} />;
          })
        ) : (
          <div className="flex flex-col p-4 gap-8">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-2 w-1/4" />
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-2 w-1/4" />
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        )}
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

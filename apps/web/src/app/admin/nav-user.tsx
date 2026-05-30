"use client";

import {
  BellIcon,
  CreditCardIcon,
  DotsThreeVerticalIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { client } from "@realityware/rpc-backend";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { isLoading, data: user } = useSWR("api/user", async () => {
    const data = await client.user.$get();

    if (data.ok) {
      const body = await data.json();
      return body;
    } else {
      return { success: false as false };
    }
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isLoading ? (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    <Skeleton className="h-full w-full" />
                  </AvatarFallback>
                </Avatar>
              ) : user?.success ? (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.account.avatar}
                    alt={`${user.account.displayName}'s Avatar`}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.account.displayName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">?</AvatarFallback>
                </Avatar>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {isLoading ? (
                    <Skeleton className="h-full w-16" />
                  ) : user?.success ? (
                    user.account.displayName
                  ) : (
                    "?"
                  )}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.success ? user.account.email : "?"}
                </span>
              </div>
              <DotsThreeVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

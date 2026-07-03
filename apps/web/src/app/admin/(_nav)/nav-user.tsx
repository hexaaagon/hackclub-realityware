"use client";

import {
  BellIcon,
  CreditCardIcon,
  DotsThreeVerticalIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";

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
import type { UserResponse } from "./app-sidebar";

export function NavUser({ user }: { user: UserResponse }) {
  const { isMobile } = useSidebar();
  const isSuccess = user?.success === true;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isSuccess ? (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.account.avatar}
                    alt={`${user.account.displayName}'s Avatar`}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.account.displayName
                      .split(" ")
                      .map((part: string) => part[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className="h-8 w-8 rounded-full" />
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {isSuccess ? (
                    user.account.displayName
                  ) : (
                    <Skeleton className="h-3 w-2/3" />
                  )}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {isSuccess ? (
                    user.account.email
                  ) : (
                    <Skeleton className="h-2.5 w-1/3 mt-1" />
                  )}
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

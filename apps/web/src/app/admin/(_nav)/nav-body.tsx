"use client";
import { matchPathname } from "@realityware/util";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavSection } from "./_links";

export function NavBody({ items }: { items: NavSection }) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{items.title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.links.map((item) => {
          const isActive = matchPathname(item.url, pathname);
          const cleanUrl = item.url.replace(/\/\*/g, "");

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                variant={isActive ? "outline" : "default"}
                asChild
              >
                <Link href={cleanUrl as any} className="flex items-center">
                  {item.icon && <item.icon size={20} className="size-5!" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

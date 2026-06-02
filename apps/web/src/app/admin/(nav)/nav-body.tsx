"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { navSection } from "./links";

export function NavBody({ items }: { items: navSection }) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{items.title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.links.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              variant={
                item.strict
                  ? pathname === item.url
                    ? "outline"
                    : "default"
                  : pathname.startsWith(item.url)
                    ? "outline"
                    : "default"
              }
              asChild
            >
              <Link href={item.url} className="flex items-center">
                {item.icon && <item.icon size={20} className="size-5!" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

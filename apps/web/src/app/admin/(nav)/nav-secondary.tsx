"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: ReactNode;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showThemeToggle = isMounted && pathname.startsWith("/admin");

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {showThemeToggle ? (
            <SidebarMenuItem
              onClick={() => {
                const currentTheme = resolvedTheme ?? theme ?? "light";
                console.log(currentTheme);
                setTheme(currentTheme === "dark" ? "light" : "dark");
              }}
            >
              <SidebarMenuButton>
                {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
                Toggle Theme
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

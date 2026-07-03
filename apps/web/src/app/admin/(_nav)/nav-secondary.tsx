"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
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
                setTheme(currentTheme === "dark" ? "light" : "dark");
              }}
            >
              <SidebarMenuButton size="sm">
                {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
                Toggle Theme
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

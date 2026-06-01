"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();

  return (
    <NextThemesProvider
      forcedTheme={pathname.startsWith("/admin") ? undefined : "light"}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

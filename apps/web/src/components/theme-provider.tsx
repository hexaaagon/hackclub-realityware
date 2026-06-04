"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeAttribute = "class" | `data-${string}`;

export type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: ThemeAttribute | ThemeAttribute[];
  defaultTheme?: Theme;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  storageKey?: string;
  value?: Record<string, string>;
  themes?: Theme[];
};

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  systemTheme: "light" | "dark";
  forcedTheme?: Theme;
  themes: Theme[];
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const DEFAULT_THEMES: Theme[] = ["light", "dark"];

const isTheme = (value: string, themes: Theme[]) =>
  themes.includes(value as Theme);

const getSystemTheme = (media?: MediaQueryList) =>
  (media ?? window.matchMedia("(prefers-color-scheme: dark)")).matches
    ? "dark"
    : "light";

const applyTheme = ({
  attribute,
  value,
  themes,
  resolvedTheme,
  enableColorScheme,
}: {
  attribute: ThemeAttribute | ThemeAttribute[];
  value?: Record<string, string>;
  themes: Theme[];
  resolvedTheme: "light" | "dark";
  enableColorScheme: boolean;
}) => {
  const root = document.documentElement;
  const attributes = Array.isArray(attribute) ? attribute : [attribute];
  const themeClasses = themes
    .filter((theme) => theme !== "system")
    .map((theme) => value?.[theme] ?? theme);
  const resolvedValue = value?.[resolvedTheme] ?? resolvedTheme;

  for (const attr of attributes) {
    if (attr === "class") {
      root.classList.remove(...themeClasses);
      root.classList.add(resolvedValue);
    } else if (attr.startsWith("data-")) {
      root.setAttribute(attr, resolvedValue);
    }
  }

  if (enableColorScheme) {
    root.style.colorScheme = resolvedTheme;
  }
};

export function ThemeProvider({
  children,
  attribute = "data-theme",
  defaultTheme = "system",
  enableSystem = true,
  enableColorScheme = true,
  storageKey = "theme",
  value,
  themes = DEFAULT_THEMES,
}: ThemeProviderProps) {
  const pathname = usePathname();
  const forcedTheme: Theme | undefined = pathname.startsWith("/admin")
    ? undefined
    : "light";
  const availableThemes: Theme[] = enableSystem
    ? [...themes, "system"]
    : themes;

  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    try {
      const stored = localStorage.getItem(storageKey) ?? defaultTheme;
      return isTheme(stored, availableThemes)
        ? (stored as Theme)
        : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">(
    "light",
  );

  React.useEffect(() => {
    if (!enableSystem) {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemTheme(getSystemTheme(media));

    update();

    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, [enableSystem]);

  const resolvedTheme =
    forcedTheme ?? (theme === "system" ? systemTheme : theme);

  React.useEffect(() => {
    applyTheme({
      attribute,
      value,
      themes: availableThemes,
      resolvedTheme,
      enableColorScheme,
    });
  }, [attribute, value, enableColorScheme, availableThemes, resolvedTheme]);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch {
        // Ignore write errors (e.g. in private mode).
      }
    },
    [storageKey],
  );

  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
      forcedTheme,
      themes: availableThemes,
    }),
    [theme, setTheme, resolvedTheme, systemTheme, forcedTheme, availableThemes],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

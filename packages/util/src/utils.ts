import { env } from "@realityware/env";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string = "/") {
  path = path.startsWith("/") ? path : `/${path}`;

  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function matchPathname(patternStr: string, currentPathname: string) {
  const regexPattern = patternStr
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\/\*$/, "(?:/.*)?")
    .replace(/\*/g, ".*");

  const regex = new RegExp(`^${regexPattern}$`);

  return regex.test(currentPathname);
}

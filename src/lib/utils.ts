import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string = "/") {
  path = path.startsWith("/") ? path : `/${path}`;

  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

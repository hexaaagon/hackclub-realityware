import {
  AppWindowIcon,
  DeviceMobileIcon,
  GithubLogoIcon,
  type Icon,
  WrenchIcon,
} from "@phosphor-icons/react";

/** Human "time ago" from an ISO timestamp (client-only — uses the live clock). */
export function timeAgo(iso: string | null): string {
  if (!iso) return "just now";
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ${mins % 60} minutes ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Pick an icon for a project from its type / code host. */
export function projectIcon(type: string, codeUrl: string): Icon {
  if (codeUrl.includes("github.com")) return GithubLogoIcon;
  if (type === "hardware") return WrenchIcon;
  if (type === "software-mobile") return DeviceMobileIcon;
  return AppWindowIcon;
}

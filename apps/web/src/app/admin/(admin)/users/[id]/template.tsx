"use client";

import {
  GearIcon,
  HouseIcon,
  type Icon,
  LogIcon,
  PackageIcon,
} from "@phosphor-icons/react";
import { cn } from "@realityware/util";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { breadCrumbContext } from "@/app/admin/(_nav)/site-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { userContext } from "./context";

const navItems: { href: string; label: string; icon?: Icon }[] = [
  {
    href: "/overview",
    label: "Overview",
    icon: HouseIcon,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: PackageIcon,
  },
  {
    href: "/audit-log",
    label: "Audit Log",
    icon: LogIcon,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: GearIcon,
  },
];

export default function UserTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useContext(userContext);
  const { setParams } = useContext(breadCrumbContext);
  const pathname = usePathname();

  useEffect(() => {
    setParams([
      {
        i: 2,
        s: [user.displayName, user.id],
      },
    ]);
  }, [setParams, user]);

  return (
    <main className="flex w-full flex-col gap-5">
      <header className="flex flex-row items-center gap-3">
        <Avatar className="size-16 overflow-hidden rounded-sm after:rounded-[inherit]">
          <AvatarImage
            src={user.avatar}
            alt={user.displayName}
            className="rounded-none!"
          />
          <AvatarFallback className="text-xs">
            {user.displayName.split(" ").map((name) => name.charAt(0))}
          </AvatarFallback>
        </Avatar>
        <div className="leading-5">
          <h1 className="font-bold text-2xl">{user.displayName}</h1>
          <p className="font-mono text-sm">{user.slackId}</p>
        </div>
      </header>
      <section className="flex w-full @[900px]/main:flex-row flex-col gap-5">
        <aside className="flex h-full @[900px]/main:w-2/3 w-full min-w-[16rem] @[900px]/main:max-w-[20rem] flex-col gap-1 rounded-md bg-secondary/30 p-2">
          {navItems.map((nav) => (
            <Link
              key={nav.href}
              href={`/admin/users/${user.id}/${nav.href}` as unknown as any}
              className={cn(
                buttonVariants({
                  variant: pathname.endsWith(nav.href) ? "secondary" : "ghost",
                }),
                "flex w-full items-center justify-start font-medium",
              )}
            >
              {nav.icon && <nav.icon />}
              {nav.label}
            </Link>
          ))}
        </aside>
        <div className="w-full min-w-0 flex-1">{children}</div>
      </section>
    </main>
  );
}

"use client";

import { CaretRightIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { adminCrumbs, type Bread } from "./_breadcrumb";

const breadcrumbs: {
  [key: string]: Bread[];
} = {
  admin: adminCrumbs,
};

export function SiteHeader({
  type,
  params,
}: {
  type: "admin";
  params?: {
    i: number;
    s: string[];
  }[];
}) {
  const pathname = usePathname();

  const breadcrumb = breadcrumbs[type] || [];
  const crumbs = breadcrumb
    .filter((crumb) => {
      const crumbSegments = crumb.url.split("/").filter(Boolean);
      const pathSegments = pathname.split("/").filter(Boolean);

      if (crumbSegments.length > pathSegments.length) return false;

      for (let i = 0; i < crumbSegments.length; i++) {
        if (crumbSegments[i] === "*") continue;
        if (crumbSegments[i] !== pathSegments[i]) return false;
      }

      return true;
    })
    .map((crumb, i) => {
      if (crumb.type === "static") return crumb;

      const param = params?.find((p) => p.i === i);
      const title = param ? crumb.title(param.s) : crumb.title([]);

      return {
        ...crumb,
        type: "static",
        title,
      };
    });
  const currentCrumb = crumbs[crumbs.length - 1];

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="my-auto mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex gap-1.5 items-center">
          {crumbs.map((crumb, i) => (
            <Fragment key={`${crumb.url}`}>
              {i > 0 && <CaretRightIcon className="size-3" />}
              <div
                className={`text-sm font-medium ${
                  crumb === currentCrumb
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {crumb.title}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </header>
  );
}

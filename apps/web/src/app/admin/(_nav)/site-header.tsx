"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  adminCrumbs,
  type Bread,
  fulfillmentCrumbs,
  reviewCrumbs,
} from "./_breadcrumb";

const breadcrumbs: {
  [key: string]: Bread[];
} = {
  admin: adminCrumbs,
  review: reviewCrumbs,
  fulfillment: fulfillmentCrumbs,
};

export function SiteHeader({
  type,
  params,
}: {
  type: "admin" | "review" | "fulfillment";
  params?: {
    i: number;
    s: (string | number)[];
  }[];
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const breadcrumb = breadcrumbs[type] || [];
  const crumbs = breadcrumb
    .filter((crumb) => {
      const param =
        crumb.type === "dynamic"
          ? params?.find((p, i) => p.i === i)
          : undefined;
      const crumbUrl =
        crumb.type === "dynamic" && crumb.url instanceof Function
          ? crumb.url(param ? param.s : [])
          : (crumb.url as string);
      const crumbSegments = crumbUrl.split("/").filter(Boolean);
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
      const url =
        crumb.type === "dynamic" && crumb.url instanceof Function
          ? crumb.url(param ? param.s : [])
          : (crumb.url as string);

      return {
        ...crumb,
        type: "static",
        title,
        url,
      };
    });

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="my-auto mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;

              // if mobile and more than 2 crumbs
              if (isMobile && crumbs.length > 2) {
                // if not the first or last crumb
                if (i !== 0 && i !== crumbs.length - 1) {
                  if (i === 1) {
                    const remainingCrumbs = crumbs.slice(1, -1);

                    return (
                      <Fragment key="ellipsis">
                        <BreadcrumbItem>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon-sm" variant="ghost">
                                <BreadcrumbEllipsis />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuGroup>
                                {remainingCrumbs.map((crumb) => (
                                  <DropdownMenuItem key={crumb.url}>
                                    <Link href={crumb.url.replaceAll("/*", "")}>
                                      {crumb.title}
                                    </Link>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </Fragment>
                    );
                  }
                }
              }

              return (
                <Fragment key={crumb.url}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.url.replaceAll("/*", "")}>
                          {crumb.title}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

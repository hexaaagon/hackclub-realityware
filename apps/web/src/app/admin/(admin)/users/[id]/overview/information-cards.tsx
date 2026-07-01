"use client";

import {
  CalendarIcon,
  CoinsIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import type { UserInfo } from "@realityware/database/types/user.d";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function InformationCards({ user }: { user: UserInfo }) {
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });

  return (
    <section className="grid w-full @[1300px]/main:grid-cols-4 @[784px]/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <CoinsIcon className="size-4" />
            Total Shards
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {user.shards.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <PackageIcon className="size-4" />
            Total Projects
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {user.project.length}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <ShieldCheckIcon className="size-4" />
            Permissions
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl capitalize">
            {user.permissions?.join(", ") ?? "Member"}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <CalendarIcon className="size-4" />
            Joined At
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl">
            {joinDate}
          </CardTitle>
        </CardHeader>
      </Card>
    </section>
  );
}

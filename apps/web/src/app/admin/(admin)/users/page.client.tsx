"use client";

import {
  ArrowSquareOutIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CoinsIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import type { UserPermission } from "@realityware/database/schema/user";
import type { client } from "@realityware/rpc-backend";
import type { InferResponseType } from "hono";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUsersPageClient({
  data,
}: {
  data: Extract<
    InferResponseType<typeof client.admin.users.$get>,
    { success: true }
  >;
}) {
  const [search, setSearch] = useState("");
  // const [filterStatus, setFilterStatus] = useState<string>("all");

  const sortBasedOnPermission: [UserPermission, ...UserPermission[]] = [
    "admin",
    "reviewer",
    "fulfillment",
    "member",
  ];
  const getPermissionBadge = (status: UserPermission) => {
    switch (status) {
      case "admin":
        return (
          <Badge
            variant="default"
            className="gap-1 border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-500 capitalize hover:bg-emerald-500/20"
          >
            <CheckCircleIcon className="size-3" /> Admin
          </Badge>
        );
      case "reviewer":
        return (
          <Badge
            variant="secondary"
            className="gap-1 border-blue-500/20 bg-blue-500/10 font-medium text-blue-500 capitalize hover:bg-blue-500/20"
          >
            <ClockIcon className="size-3" /> Reviewer
          </Badge>
        );
      case "fulfillment":
        return (
          <Badge
            variant="secondary"
            className="gap-1 border-blue-500/20 bg-blue-500/10 font-medium text-blue-500 capitalize hover:bg-blue-500/20"
          >
            <ClockIcon className="size-3" /> Fulfillment
          </Badge>
        );
      case "member":
        return (
          <Badge variant="outline" className="gap-1 font-medium capitalize">
            <CheckCircleIcon className="size-3" /> Member
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredUsers = data.users.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(search.toLowerCase()) ||
      user.slackId.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  return (
    <main className="@container/main w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl tracking-tight">Users</h2>
      </div>

      {/* Analytics Counters Group */}
      <section className="grid w-full @[1300px]/main:grid-cols-4 @[784px]/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <CoinsIcon className="size-4" />
              Total Shards
            </CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              a
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
              b
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
              c
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
              d
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      {/* Filter and Table Card */}
      <Card className="w-full gap-2 pt-2 pb-3">
        <div className="flex flex-col items-center justify-between gap-3 border-b px-4 pt-0 pb-2 sm:flex-row">
          <div className="relative w-full sm:w-80">
            <MagnifyingGlassIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search users or email..."
              className="h-9 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/*
          <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
            {["all", "shipped", "reviewed", "approved", "changes-needed"].map(
              (status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 shrink-0 rounded-md font-medium text-xs capitalize"
                  onClick={() => setFilterStatus(status)}
                >
                  {status.replace("-", " ")}
                </Button>
              ),
            )}
          </div>
          */}
        </div>

        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="w-12 px-4 text-center">ID</TableHead>
                <TableHead className="w-64">User</TableHead>
                <TableHead className="w-70">Email</TableHead>
                <TableHead className="w-36">Shards</TableHead>
                <TableHead className="w-40">Role</TableHead>
                <TableHead className="w-24 pr-4 pl-8 text-end">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className={idx % 2 ? "bg-secondary/40" : "bg-secondary/20"}
                >
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {item.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="overflow-hidden rounded-sm after:rounded-[inherit]">
                        <AvatarImage
                          src={item.avatar}
                          alt={item.displayName}
                          className="rounded-none!"
                        />
                        <AvatarFallback className="text-xs">
                          {item.displayName
                            .split(" ")
                            .map((name) => name.charAt(0))}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex h-full flex-col justify-center leading-2.5">
                        <div className="font-medium">{item.displayName}</div>
                        <Link
                          href={`https://hackclub.slack.com/team/${item.slackId}`}
                          target="_blank"
                          className="mt-0.5 flex w-max items-center gap-1 rounded-full text-muted-foreground text-xs transition-all hover:bg-accent hover:px-3"
                        >
                          <ArrowSquareOutIcon /> {item.slackId}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">{item.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CoinsIcon />
                      {item.shards}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="flex items-center gap-2">
                      {(item.permissions || ["member"])
                        .toSorted(
                          (a, b) =>
                            sortBasedOnPermission.indexOf(a) -
                            sortBasedOnPermission.indexOf(b),
                        )
                        .map((permission) => (
                          <Fragment key={permission}>
                            {getPermissionBadge(permission)}
                          </Fragment>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <div className="ml-auto flex h-full w-max items-center gap-1">
                      <Link
                        href={`/admin/users/${item.id}/overview`}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        <EyeIcon />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

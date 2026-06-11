"use client";

import {
  ArchiveIcon,
  ArrowSquareOutIcon,
  CircleNotchIcon,
  CoinsIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { client } from "@realityware/rpc-backend";
import Link from "next/link";
import useSWRImmutable from "swr/immutable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const { isLoading, data: users } = useSWRImmutable(
    "admin/users",
    async () => {
      const res = await (await client.admin.users.$get({})).json();

      if (!res.success) return [];
      return res.users;
    },
  );

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Users</h2>
      </div>
      {!isLoading && users ? (
        <Table className="rounded-xl">
          <TableHeader className="bg-accent">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8 px-4 rounded-tl-xl">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Shards</TableHead>
              <TableHead className="w-0 pr-4 rounded-tr-xl text-end">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item, idx) => (
              <TableRow
                key={item.id}
                className={idx % 2 ? "bg-secondary/40" : "bg-secondary/20"}
              >
                <TableCell className="text-muted-foreground font-mono text-center">
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
                    <div className="leading-2.5 h-full flex flex-col justify-center">
                      <div className="font-medium">{item.displayName}</div>
                      <Link
                        href={`https://hackclub.slack.com/team/${item.slackId}`}
                        target="_blank"
                        className="text-muted-foreground hover:px-2 hover:bg-accent transition-all flex gap-1 items-center mt-0.5 text-xs"
                      >
                        <ArrowSquareOutIcon /> {item.slackId}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CoinsIcon />
                    {item.shards}
                  </div>
                </TableCell>
                <TableCell className="flex justify-end">
                  <div className="flex h-full w-max ml-auto items-center gap-1">
                    <Link
                      href={`/admin/users/${item.id}`}
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
      ) : (
        <div className="flex w-full">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleNotchIcon className="animate-spin" />
              </EmptyMedia>
              <EmptyTitle>Loading Users</EmptyTitle>
              <EmptyDescription>
                Loading the users information...
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </main>
  );
}

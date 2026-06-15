"use server";
import {
  ArrowSquareOutIcon,
  CoinsIcon,
  EyeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { client } from "@realityware/rpc-backend";
import { headers } from "next/headers";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SiteBody } from "../../(_nav)/site-body";
import { SiteHeader } from "../../(_nav)/site-header";
import ServerError from "../../(partials)/error-pages/server-error";

export default async function UsersPage() {
  const headerList = await headers();
  const data = await (
    await client.admin.users.$get(
      {},
      {
        headers: Object.fromEntries(headerList.entries()),
      },
    )
  ).json();

  if (!data.success) return <ServerError reason={data} />;

  return (
    <>
      <SiteHeader type="admin" />
      <SiteBody>
        <main className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Users</h2>
          </div>
          <Table className="overflow-hidden rounded-xl">
            <TableHeader className="bg-accent">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8 rounded-tl-xl px-4">ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Shards</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="w-0 rounded-tr-xl pr-4 text-end">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users.map((item, idx) => (
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
                          className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs transition-all hover:bg-accent hover:px-2"
                        >
                          <ArrowSquareOutIcon /> {item.slackId}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {item.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CoinsIcon />
                      {item.shards}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {(item.permissions || ["member"]).map((permission) => (
                        <Badge
                          key={permission}
                          variant={
                            permission === "member" ? "outline" : "default"
                          }
                        >
                          {permission}
                        </Badge>
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
        </main>
      </SiteBody>
    </>
  );
}

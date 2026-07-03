"use client";

import {
  ArrowSquareOutIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CoinsIcon,
  GithubLogoIcon,
  HourglassIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  ShieldCheckIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import type { client } from "@realityware/rpc-backend";
import type { InferResponseType } from "hono";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function AdminProjectsPage(
  data: Extract<
    InferResponseType<typeof client.admin.projects.$get>,
    { success: true }
  >,
) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="default"
            className="gap-1 border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-500 capitalize hover:bg-emerald-500/20"
          >
            <CheckCircleIcon className="size-3" /> Approved
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="secondary"
            className="gap-1 border-blue-500/20 bg-blue-500/10 font-medium text-blue-500 capitalize hover:bg-blue-500/20"
          >
            <ClockIcon className="size-3" /> Shipped
          </Badge>
        );
      case "reviewed":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/20 bg-amber-500/10 font-medium text-amber-500 capitalize hover:bg-amber-500/20"
          >
            <HourglassIcon className="size-3" /> Reviewed
          </Badge>
        );
      case "changes-needed":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-purple-500/20 bg-purple-500/10 font-medium text-purple-500 capitalize hover:bg-purple-500/20"
          >
            <WarningCircleIcon className="size-3" /> Changes Needed
          </Badge>
        );
      case "permanently-rejected":
        return (
          <Badge variant="destructive" className="gap-1 font-medium capitalize">
            <WarningCircleIcon className="size-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredProjects = data.project.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(search.toLowerCase()) ||
      proj.description.toLowerCase().includes(search.toLowerCase()) ||
      proj.author.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all";
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="@container/main w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl tracking-tight">Projects Registry</h2>
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
              placeholder="Search projects or authors..."
              className="h-9 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
        </div>

        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="w-12 px-4 text-center">ID</TableHead>
                <TableHead className="w-64">Project Name</TableHead>
                <TableHead className="w-76">Author</TableHead>
                <TableHead className="w-68">Type</TableHead>
                <TableHead className="w-24 pr-4 pl-8 text-end">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground text-sm"
                  >
                    No registry projects match your active search terms.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    className={idx % 2 ? "bg-secondary/10" : "bg-secondary/5"}
                  >
                    <TableCell className="text-center font-mono text-muted-foreground text-xs">
                      {item.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="line-clamp-1 font-semibold text-sm">
                          {item.name}
                        </span>
                        <span
                          className="line-clamp-1 max-w-[400px] text-muted-foreground text-xs"
                          title={item.description}
                        >
                          {item.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={item.author.avatar}
                          alt={item.author.slackId}
                          className="size-5 rounded-full border bg-muted"
                        />
                        <span className="font-medium text-xs">
                          {item.author.slackId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 font-normal text-[10px] capitalize"
                      >
                        {item.type.replace("software-", "")}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-4 text-end">
                      <div className="flex items-center justify-end gap-2.5">
                        {item.codeUrl && (
                          <a
                            href={item.codeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            title="View Repository"
                          >
                            <GithubLogoIcon className="size-4" />
                          </a>
                        )}
                        {item.playableUrl && (
                          <a
                            href={item.playableUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            title="View Live Site"
                          >
                            <ArrowSquareOutIcon className="size-4" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

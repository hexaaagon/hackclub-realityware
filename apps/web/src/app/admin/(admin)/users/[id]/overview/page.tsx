"use client";

import {
  ArrowSquareOutIcon,
  CaretRightIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useContext } from "react";
import { InformationCards } from "@/app/admin/(admin)/users/[id]/overview/information-cards";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { userContext } from "../context";

export default function UserPage() {
  const { user } = useContext(userContext);

  if (!user) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No user data available
      </div>
    );
  }

  // Only show the 2 most recent projects on the showcase overview
  const recentProjects = user.project.slice(0, 2);

  return (
    <div className="w-full space-y-4">
      <InformationCards user={user} />

      <div className="grid @[900px]/main:grid-cols-3 grid-cols-1 gap-4">
        {/* Profile Details */}
        <Card className="@container/card @[900px]/main:col-span-1">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Detailed information about this user account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="size-16 rounded-full border bg-muted object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-lg leading-none">
                  {user.displayName}
                </h3>
                <p className="mt-1 truncate text-muted-foreground text-sm">
                  {user.email}
                </p>
              </div>
            </div>

            <hr className="border-border" />

            <div className="grid @[280px]/card:grid-cols-[110px_1fr] grid-cols-1 items-start @[280px]/card:items-center gap-x-4 gap-y-3 text-sm">
              <span className="text-muted-foreground">Permissions</span>
              <div className="flex flex-wrap gap-1 justify-self-start">
                {user.permissions?.map((perm) => (
                  <Badge
                    key={perm}
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px] capitalize"
                  >
                    {perm}
                  </Badge>
                )) ?? (
                  <span className="text-muted-foreground italic">None</span>
                )}
              </div>

              <span className="text-muted-foreground">Slack ID</span>
              <span className="max-w-full select-all justify-self-start truncate rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                {user.slackId}
              </span>

              <span className="text-muted-foreground">User ID</span>
              <span className="select-all justify-self-start rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                {user.id}
              </span>

              <span className="text-muted-foreground">Auth User ID</span>
              <span className="max-w-full select-all justify-self-start truncate rounded bg-muted px-1.5 py-0.5 font-mono @[280px]/card:text-xs text-[11px]">
                {user.userId}
              </span>

              <span className="text-muted-foreground">Last Updated</span>
              <span className="text-foreground">
                {new Date(user.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* User's Projects Showcase (Limited to 2) */}
        <Card className="@[900px]/main:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Recent Projects ({user.project.length})</CardTitle>
              <CardDescription>
                Latest projects created by this user
              </CardDescription>
            </div>
            {user.project.length > 0 && (
              <Link
                href={`/admin/users/${user.id}/projects` as unknown as any}
                className="flex items-center gap-0.5 font-medium text-primary text-xs hover:underline"
              >
                View all
                <CaretRightIcon className="size-3" />
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {user.project.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                This user hasn't created any projects yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recentProjects.map((proj) => (
                  <Card
                    key={proj.id}
                    className="flex flex-col justify-between overflow-hidden border border-border"
                  >
                    <div>
                      {proj.imageUrl && (
                        <div className="aspect-video w-full overflow-hidden border-b bg-muted">
                          <img
                            src={proj.imageUrl}
                            alt={proj.name}
                            className="h-full w-full object-cover transition-all hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="mb-1.5 flex items-start justify-between gap-2">
                          <h4 className="line-clamp-1 font-semibold text-base">
                            {proj.name}
                          </h4>
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px] capitalize"
                          >
                            {proj.type.replace("software-", "")}
                          </Badge>
                        </div>
                        <p className="line-clamp-2 min-h-[2rem] text-muted-foreground text-xs">
                          {proj.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-4 pt-0">
                      {proj.codeUrl && (
                        <a
                          href={proj.codeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
                        >
                          <GithubLogoIcon className="size-3.5" />
                          Code
                        </a>
                      )}
                      {proj.playableUrl && (
                        <a
                          href={proj.playableUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
                        >
                          <ArrowSquareOutIcon className="size-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

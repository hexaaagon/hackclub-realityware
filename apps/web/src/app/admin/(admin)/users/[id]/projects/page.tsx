"use client";

import {
  ArrowSquareOutIcon,
  BatteryWarningIcon,
  GithubLogoIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { userContext } from "../context";

export default function UserProjectsPage() {
  const { user } = useContext(userContext);

  if (!user) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No user data available
      </div>
    );
  }

  return (
    <div className="@container/projects w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Projects ({user.project.length})</CardTitle>
          <CardDescription>All projects created by this user</CardDescription>
        </CardHeader>
        <CardContent>
          {user.project.length === 0 ? (
            <div className="pt-4 pb-12 text-center text-muted-foreground text-sm">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia className="size-16!" variant="icon">
                    <BatteryWarningIcon className="size-12! text-red-600!" />
                  </EmptyMedia>
                  <EmptyDescription>
                    This user haven{"'"}t made any projects yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <div className="grid @[540px]/projects:grid-cols-2 @[840px]/projects:grid-cols-3 grid-cols-1 gap-4">
              {user.project.map((proj) => (
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
  );
}

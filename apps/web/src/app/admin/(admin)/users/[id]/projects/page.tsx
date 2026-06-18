"use client";

import { ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Projects ({user.project.length})</CardTitle>
          <CardDescription>All projects created by this user</CardDescription>
        </CardHeader>
        <CardContent>
          {user.project.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              This user hasn't created any projects yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

"use client";

import { Tilt } from "@/components/motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { FeaturedProject } from "@/hooks/use-featured-projects";
import { ProjectImage } from "./project-image";
import { projectIcon, timeAgo } from "./utils";

export function FeaturedCard({ project }: { project: FeaturedProject }) {
  const Icon = projectIcon(project.type, project.codeUrl);

  return (
    <Tilt className="block h-full">
      <article className="flex h-full gap-3 border-2 border-black/20 bg-card p-3">
        <ProjectImage
          src={project.imageUrl}
          alt={project.name}
          sizes="20vw"
          className="aspect-[4/3] w-2/5 shrink-0 rotate-[-1deg]"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Icon weight="fill" className="size-4 shrink-0 text-orange" />
            <h3 className="truncate font-medium text-sm">{project.name}</h3>
          </div>
          <p className="line-clamp-2 text-black/55 text-xs italic">
            “{project.description}”
          </p>
          <div className="mt-auto flex items-center gap-1.5 text-black/50 text-xs">
            <Avatar className="size-5 shrink-0 rounded-none border border-black/20">
              <AvatarImage
                src={project.authorAvatar}
                alt={project.authorName}
              />
              <AvatarFallback className="rounded-none bg-orange/15 text-[8px]">
                {project.authorName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              by @{project.authorSlackId} · {timeAgo(project.shippedAt)}
            </span>
          </div>
        </div>
      </article>
    </Tilt>
  );
}

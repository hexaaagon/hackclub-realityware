"use client";

import { Tilt } from "@/components/motion";
import type { UserProject } from "@/hooks/use-user-projects";
import { ProjectImage } from "./project-image";

export function ProjectCard({ project }: { project: UserProject }) {
  return (
    <Tilt className="block">
      <article className="border-2 border-black/20 bg-card p-1.5">
        <ProjectImage
          src={project.imageUrl}
          alt={project.name}
          sizes="(max-width: 768px) 100vw, 45vw"
          className="aspect-video w-full"
        />
        <div className="flex items-center justify-between gap-2 px-1.5 pt-2 pb-1">
          <h3 className="truncate font-sacco text-sm uppercase">
            {project.name}
          </h3>
          <span className="shrink-0 text-black/40 text-xs">{project.type}</span>
        </div>
      </article>
    </Tilt>
  );
}

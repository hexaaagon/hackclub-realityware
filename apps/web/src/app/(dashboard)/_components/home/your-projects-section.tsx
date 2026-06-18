"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { type UserProject, useUserProjects } from "@/hooks/use-user-projects";
import { CardSkeletonGrid, ErrorRow } from "./card-states";
import { ProjectCard } from "./project-card";
import { SectionHeading } from "./section-heading";

// Placeholder-shaped projects, used when you have none yet (or aren't signed in).
const PLACEHOLDER_PROJECTS: UserProject[] = [
  {
    id: -1,
    userId: -1,
    type: "hardware",
    name: "comin' from your backstreet",
    description: "lorem ipsum",
    codeUrl: "",
    playableUrl: "",
    imageUrl: "",
  },
  {
    id: -2,
    userId: -1,
    type: "software-web",
    name: "jungle outpost",
    description: "lorem ipsum",
    codeUrl: "",
    playableUrl: "",
    imageUrl: "",
  },
];

export function YourProjectsSection() {
  const { projects, isLoading, error, loaded, mutate } = useUserProjects();
  const items = projects.length > 0 ? projects : PLACEHOLDER_PROJECTS;

  return (
    <section className="flex flex-col gap-3">
      <Reveal>
        <SectionHeading>Your Projects</SectionHeading>
      </Reveal>

      {error ? (
        <ErrorRow
          message="Couldn't load your projects."
          onRetry={() => mutate()}
        />
      ) : isLoading && !loaded ? (
        <CardSkeletonGrid count={2} />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}

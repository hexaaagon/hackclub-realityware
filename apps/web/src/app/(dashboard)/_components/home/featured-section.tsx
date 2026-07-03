"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import {
  type FeaturedProject,
  useFeaturedProjects,
} from "@/hooks/use-featured-projects";
import { CardSkeletonGrid, ErrorRow } from "./card-states";
import { FeaturedCard } from "./featured-card";
import { SectionHeading } from "./section-heading";

// Placeholder-shaped featured projects, used when the DB has none yet.
const PLACEHOLDER_FEATURED: FeaturedProject[] = [
  {
    id: -1,
    name: "i love public transport",
    description: "government gonna love this",
    type: "hardware",
    codeUrl: "https://github.com/placeholder/transport",
    playableUrl: "",
    imageUrl: "",
    authorName: "Amba Tron",
    authorSlackId: "ambatron",
    authorAvatar: "",
    shippedAt: new Date(Date.now() - 83_400_000).toISOString(),
  },
  {
    id: -2,
    name: "the ball emitter",
    description: "i love balls",
    type: "hardware",
    codeUrl: "https://github.com/placeholder/ball-emitter",
    playableUrl: "",
    imageUrl: "",
    authorName: "Hexaa Dev",
    authorSlackId: "hexaa",
    authorAvatar: "",
    shippedAt: new Date(Date.now() - 241_260_000).toISOString(),
  },
];

export function FeaturedSection() {
  const { projects, isLoading, error, loaded, mutate } = useFeaturedProjects(6);
  const items =
    projects.length > 0 ? projects.slice(0, 6) : PLACEHOLDER_FEATURED;

  return (
    <section className="flex flex-col gap-3">
      <Reveal>
        <SectionHeading>Featured</SectionHeading>
      </Reveal>

      {error ? (
        <ErrorRow
          message="Couldn't load featured projects."
          onRetry={() => mutate()}
        />
      ) : isLoading && !loaded ? (
        <CardSkeletonGrid count={2} />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <FeaturedCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}

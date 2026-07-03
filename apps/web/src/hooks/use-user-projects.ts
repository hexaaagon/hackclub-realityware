"use client";

import useSWR from "swr";

export type UserProject = {
  id: number;
  userId: number;
  type: string;
  name: string;
  description: string;
  codeUrl: string;
  playableUrl: string;
  imageUrl: string;
};

type UserProjectsResponse =
  | { projects: UserProject[] }
  | { success: false; message: string };

/** The signed-in participant's own projects from `/api/user/projects`. */
export function useUserProjects() {
  const { data, error, isLoading, mutate } = useSWR<UserProjectsResponse>(
    "user/projects",
    async () => {
      const res = await fetch("/api/user/projects");
      if (!res.ok) throw new Error("Failed to load your projects");
      return res.json();
    },
  );

  const projects = data && "projects" in data ? data.projects : [];

  return { projects, isLoading, error, loaded: !!data, mutate };
}

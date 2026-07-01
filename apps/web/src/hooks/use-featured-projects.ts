"use client";

import useSWR from "swr";

export type FeaturedProject = {
  id: number;
  name: string;
  description: string;
  type: string;
  codeUrl: string;
  playableUrl: string;
  imageUrl: string;
  authorName: string;
  authorSlackId: string;
  authorAvatar: string;
  shippedAt: string | null;
};

export type FeaturedResponse =
  | { success: false; message: string }
  | { success: true; projects: FeaturedProject[] };

/** Featured projects across the program from `/api/projects/featured`. */
export function useFeaturedProjects(limit = 6) {
  const { data, error, isLoading, mutate } = useSWR<FeaturedResponse>(
    `projects/featured?limit=${limit}`,
    async () => {
      const res = await fetch(`/api/projects/featured?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to load featured projects");
      return res.json();
    },
  );

  return {
    projects: data?.success ? data.projects : [],
    isLoading,
    error,
    loaded: !!data,
    mutate,
  };
}

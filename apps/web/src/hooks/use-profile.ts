"use client";

import useSWR from "swr";

export type ProfileResponse =
  | { success: false; message: string }
  | {
      success: true;
      account: {
        id: number;
        userId: string;
        slackId: string;
        displayName: string;
        avatar: string;
        email: string;
        role: ("member" | "reviewer" | "fulfillment" | "admin")[] | null;
        shards: number;
        cityId: number | null;
        createdAt: string;
        updatedAt: string;
      };
      cityName: string | null;
      achievements: {
        id: number;
        userId: number;
        name: string;
        description: string;
        iconUrl: string;
      }[];
    };

/**
 * The signed-in participant's profile (account + achievements) from `/api/me/profile`.
 * Plain same-origin fetch (cookies sent automatically); the route is zod-validated
 * server-side. Returns `null` profile when not signed in (authMiddleware → 200 `{success:false}`).
 */
export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<ProfileResponse>(
    "me/profile",
    async () => {
      const res = await fetch("/api/me/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
  );

  const profile = data?.success ? data : null;

  return { profile, isLoading, error, mutate };
}

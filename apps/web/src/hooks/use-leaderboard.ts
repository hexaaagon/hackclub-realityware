"use client";

import useSWR from "swr";

export type CityRank = {
  id: number;
  name: string;
  score: number;
  members: number;
  hours: number;
  rank: number;
};

export type LeaderboardResponse =
  | { success: false; message: string }
  | {
      success: true;
      cities: CityRank[];
      onlineToday: number;
      myCityId: number | null;
    };

/** Cities ranking + "people coding today" from `/api/leaderboard`. */
export function useLeaderboard() {
  const { data, error, isLoading, mutate } = useSWR<LeaderboardResponse>(
    "leaderboard",
    async () => {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to load leaderboard");
      return res.json();
    },
  );

  const ok = data?.success ? data : null;

  return {
    cities: ok?.cities ?? [],
    onlineToday: ok?.onlineToday ?? 0,
    myCityId: ok?.myCityId ?? null,
    isLoading,
    error,
    mutate,
  };
}

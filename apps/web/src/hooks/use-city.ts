"use client";

import useSWR from "swr";

export type City = { id: number; name: string };

type CitiesResponse =
  | { success: false; message: string }
  | { success: true; cities: City[] };

export type SetCityResult =
  | { success: true; cityId: number; cityName: string }
  | { success: false; message: string };

/** The canonical cities for the picker. */
export function useCities() {
  const { data, error, isLoading } = useSWR<CitiesResponse>(
    "leaderboard/cities",
    async () => {
      const res = await fetch("/api/leaderboard/cities");
      if (!res.ok) throw new Error("Failed to load cities");
      return res.json();
    },
  );
  const ok = data?.success ? data : null;
  return { cities: ok?.cities ?? [], isLoading, error };
}

/** Set the signed-in participant's city. */
export async function setCity(cityId: number): Promise<SetCityResult> {
  try {
    const res = await fetch("/api/me/city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityId }),
    });
    const json = (await res.json()) as SetCityResult;
    if (!json || typeof json.success !== "boolean") {
      return { success: false, message: "unexpected-response" };
    }
    return json;
  } catch {
    return { success: false, message: "network-error" };
  }
}

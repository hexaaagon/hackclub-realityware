"use client";

import useSWR from "swr";

export type BountyStatus = "active" | "archived";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Bounty = {
  id: number;
  week: number;
  title: string;
  description: string;
  imageUrl: string | null;
  status: BountyStatus;
  createdAt: string;
};

export type BountySubmission = {
  id: number;
  bountyId: number;
  userId: number;
  url: string;
  notes: string | null;
  status: SubmissionStatus;
  createdAt: string;
};

export type BountiesResponse =
  | { success: false; message: string }
  | { success: true; bounties: Bounty[]; submissions: BountySubmission[] };

export type SubmitResult =
  | { success: true; submission: BountySubmission }
  | { success: false; message: string };

/** Bounties catalog + the signed-in user's submissions from `/api/bounties`. */
export function useBounties() {
  const { data, error, isLoading, mutate } = useSWR<BountiesResponse>(
    "bounties",
    async () => {
      const res = await fetch("/api/bounties");
      if (!res.ok) throw new Error("Failed to load bounties");
      return res.json();
    },
  );

  const ok = data?.success ? data : null;

  return {
    bounties: ok?.bounties ?? [],
    submissions: ok?.submissions ?? [],
    isLoading,
    error,
    mutate,
  };
}

/** Submit a build for a bounty (POST `/api/bounties/submissions`). */
export async function submitBounty(
  bountyId: number,
  url: string,
  notes?: string,
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/bounties/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bountyId, url, notes }),
    });
    const json = (await res.json()) as SubmitResult;
    if (!json || typeof json.success !== "boolean") {
      return { success: false, message: "unexpected-response" };
    }
    return json;
  } catch {
    return { success: false, message: "network-error" };
  }
}

type ActionResult =
  | { success: true; [k: string]: unknown }
  | { success: false; message: string };

async function submissionAction(
  id: number,
  action: "approve" | "reject",
): Promise<ActionResult> {
  try {
    const res = await fetch(`/api/bounties/submissions/${id}/${action}`, {
      method: "POST",
    });
    const json = (await res.json()) as ActionResult;
    if (!json || typeof json.success !== "boolean") {
      return { success: false, message: "unexpected-response" };
    }
    return json;
  } catch {
    return { success: false, message: "network-error" };
  }
}

/**
 * Admin-only: approve a bounty submission (pays out `reward_shards`, idempotent)
 * or reject it. Exposed as the seam hexaa's review panel calls — not surfaced in
 * the participant UI.
 */
export const approveSubmission = (id: number) =>
  submissionAction(id, "approve");
export const rejectSubmission = (id: number) => submissionAction(id, "reject");

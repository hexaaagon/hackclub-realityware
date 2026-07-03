"use client";

import useSWR from "swr";

export type Transaction = {
  id: number;
  fromUser: number;
  toUser: number;
  amount: number;
  type: "gift" | "market_purchase";
  note: string | null;
  createdAt: string;
  itemTitle: string | null;
  fromName: string;
  toName: string;
};

type TransactionsResponse =
  | { success: false; message: string }
  | { success: true; meId: number; transactions: Transaction[] };

/** The signed-in user's shard ledger (gifts + purchases, sent + received). */
export function useTransactions() {
  const { data, error, isLoading, mutate } = useSWR<TransactionsResponse>(
    "me/transactions",
    async () => {
      const res = await fetch("/api/me/transactions");
      if (!res.ok) throw new Error("Failed to load transactions");
      return res.json();
    },
  );
  const ok = data?.success ? data : null;
  return {
    transactions: ok?.transactions ?? [],
    meId: ok?.meId ?? null,
    isLoading,
    error,
    mutate,
  };
}

"use client";

import useSWR from "swr";

export type ShopCategory = "grant" | "items";

export type ShopItem = {
  id: number;
  addedBy: number;
  name: string;
  description: string;
  category: ShopCategory;
  /** Per-region cost: [NA, SA, EU, Asia, India, Oceania, Africa, ME]. */
  cost: number[];
};

export type ShopResponse =
  | { success: false; message: string }
  | {
      success: true;
      regions: string[];
      defaultRegion: number;
      items: ShopItem[];
    };

/** Region codes (index = position in `ShopItem.cost`) paired with display labels. */
export const SHOP_REGIONS = [
  { code: "NA", label: "North America" },
  { code: "SA", label: "South America" },
  { code: "EU", label: "Europe" },
  { code: "Asia", label: "Asia" },
  { code: "India", label: "India" },
  { code: "Oceania", label: "Oceania" },
  { code: "Africa", label: "Africa" },
  { code: "ME", label: "Middle East" },
] as const;

export type ShopOrder = {
  id: number;
  userId: number;
  itemId: number;
  region: number;
  shardCost: number;
  status: "pending" | "fulfilled" | "cancelled";
  createdAt: string;
};

export type PurchaseResult =
  | { success: true; shards: number; order: ShopOrder }
  | { success: false; message: string };

/**
 * The shop catalog from `/api/shop/items`, optionally filtered by category.
 * Plain same-origin fetch; the route is zod-validated server-side.
 */
export function useShopItems(category?: ShopCategory) {
  const { data, error, isLoading, mutate } = useSWR<ShopResponse>(
    category ? `shop/items?category=${category}` : "shop/items",
    async () => {
      const res = await fetch(
        category ? `/api/shop/items?category=${category}` : "/api/shop/items",
      );
      if (!res.ok) throw new Error("Failed to load shop");
      return res.json();
    },
  );

  const ok = data?.success ? data : null;

  return {
    items: ok?.items ?? [],
    regions: ok?.regions,
    defaultRegion: ok?.defaultRegion ?? 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Redeem/buy a shop item via `POST /api/shop/purchase`. The server re-checks the
 * price, atomically debits shards (never negative) and creates the order row.
 * Returns the normalized result; callers should revalidate profile + shop on
 * success. authMiddleware returns 200 `{success:false}` when unauthenticated, so
 * a non-2xx is only an unexpected error.
 */
export async function purchaseItem(
  itemId: number,
  region: number,
): Promise<PurchaseResult> {
  try {
    const res = await fetch("/api/shop/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, region }),
    });
    const data = (await res.json()) as PurchaseResult;
    if (!data || typeof data.success !== "boolean") {
      return { success: false, message: "unexpected-response" };
    }
    return data;
  } catch {
    return { success: false, message: "network-error" };
  }
}

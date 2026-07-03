"use client";

import useSWR from "swr";

export type ItemStatus = "active" | "sold" | "inactive";

export type MarketItem = {
  id: number;
  shop: number;
  title: string;
  description: string;
  imageUrl: string | null;
  priceShards: number;
  status: ItemStatus;
  createdAt: string;
};

export type MarketShop = {
  id: number;
  owner: number;
  name: string;
  description: string;
  createdAt: string;
  ownerName: string;
  ownerAvatar: string;
  items: MarketItem[];
};

type ShopsResponse =
  | { success: false; message: string }
  | { success: true; shops: MarketShop[] };

type MyShopResponse =
  | { success: false; message: string }
  | {
      success: true;
      shop: {
        id: number;
        owner: number;
        name: string;
        description: string;
        createdAt: string;
      } | null;
      items: MarketItem[];
    };

export type MarketResult<T = unknown> =
  | ({ success: true } & T)
  | { success: false; message: string };

async function post<T = unknown>(
  url: string,
  body: unknown,
  method = "POST",
): Promise<MarketResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json()) as MarketResult<T>;
    if (!json || typeof json.success !== "boolean") {
      return { success: false, message: "unexpected-response" };
    }
    return json;
  } catch {
    return { success: false, message: "network-error" };
  }
}

/** All shops + their active listings (Browse). */
export function useMarketShops() {
  const { data, error, isLoading, mutate } = useSWR<ShopsResponse>(
    "market/shops",
    async () => {
      const res = await fetch("/api/market/shops");
      if (!res.ok) throw new Error("Failed to load market");
      return res.json();
    },
  );
  const ok = data?.success ? data : null;
  return { shops: ok?.shops ?? [], isLoading, error, mutate };
}

/** The caller's own shop + all its items (My Shop). */
export function useMyShop() {
  const { data, error, isLoading, mutate } = useSWR<MyShopResponse>(
    "market/my-shop",
    async () => {
      const res = await fetch("/api/market/my-shop");
      if (!res.ok) throw new Error("Failed to load your shop");
      return res.json();
    },
  );
  const ok = data?.success ? data : null;
  return {
    shop: ok?.shop ?? null,
    items: ok?.items ?? [],
    isLoading,
    error,
    mutate,
  };
}

export const saveShop = (name: string, description: string) =>
  post<{ shop: unknown }>("/api/market/shop", { name, description });

export const addItem = (data: {
  title: string;
  description: string;
  imageUrl?: string;
  priceShards: number;
}) => post<{ item: MarketItem }>("/api/market/items", data);

export const editItem = (
  id: number,
  patch: Partial<{
    title: string;
    description: string;
    imageUrl: string;
    priceShards: number;
    status: "active" | "inactive";
  }>,
) => post<{ item: MarketItem }>(`/api/market/items/${id}`, patch, "PATCH");

export const deleteItem = (id: number) =>
  post<{ item: MarketItem }>(`/api/market/items/${id}`, undefined, "DELETE");

export const buyItem = (id: number) =>
  post<{ shards: number }>(`/api/market/items/${id}/buy`, {});

export const giftShards = (toUser: string, amount: number, note?: string) =>
  post<{ shards: number; recipient: string }>("/api/market/gift", {
    toUser,
    amount,
    note,
  });

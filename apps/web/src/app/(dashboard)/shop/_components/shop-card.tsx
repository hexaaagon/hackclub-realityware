"use client";

import { CoinsIcon, CubeIcon, SpinnerIcon } from "@phosphor-icons/react";
import { cn } from "@realityware/util";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  CountUp,
  ShardBurst,
  type ShardBurstHandle,
  Tilt,
} from "@/components/motion";
import { Button } from "@/components/ui/button";
import { purchaseItem, type ShopItem } from "@/hooks/use-shop";

// Brand-only gradients rotated per card for the HCB credit-card visual.
const GRANT_GRADIENTS = [
  "bg-gradient-to-br from-orange to-orange/60",
  "bg-gradient-to-br from-dark-blue to-blue",
  "bg-gradient-to-br from-black to-black/70",
] as const;

const ERROR_COPY: Record<string, string> = {
  "not-logged-in": "Sign in to shop.",
  "insufficient-shards": "Not enough shards yet.",
  "item-not-found": "That item is no longer available.",
  "invalid-region": "Pick a valid region.",
};

/** A single shop card — grants render as HCB credit cards, items as products. */
export function ShopCard({
  item,
  region,
  balance,
  onPurchased,
}: {
  item: ShopItem;
  region: number;
  balance: number;
  /** Called with the new balance after a successful purchase. */
  onPurchased: (shards: number) => void;
}) {
  const burstRef = useRef<ShardBurstHandle>(null);
  const [pending, setPending] = useState(false);

  const isGrant = item.category === "grant";
  const price = item.cost[region] ?? 0;
  // No "hours" column on shop_item — derive from price (matches the design).
  const hours = Math.max(1, Math.round(price / 10));
  const affordable = balance >= price;

  async function handleBuy() {
    if (pending) return;
    setPending(true);
    const res = await purchaseItem(item.id, region);
    setPending(false);

    if (res.success) {
      burstRef.current?.fire();
      toast.success(`${isGrant ? "Redeemed" : "Bought"} ${item.name}!`);
      onPurchased(res.shards);
    } else {
      toast.error(ERROR_COPY[res.message] ?? "Something went wrong.");
    }
  }

  return (
    <Tilt className="block h-full">
      <div className="relative flex h-full flex-col border-2 border-black/20 bg-card">
        <ShardBurst ref={burstRef} />

        {isGrant ? <GrantMedia item={item} /> : <ItemMedia name={item.name} />}

        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="flex flex-1 flex-col">
            <h3 className="font-medium text-base leading-tight">{item.name}</h3>
            <p className="mt-0.5 text-black/50 text-xs">est. {hours} hours</p>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5">
              <CoinsIcon weight="fill" className="size-4 text-orange" />
              <CountUp
                value={price}
                className="font-medium text-sm tabular-nums"
              />
            </span>
            <Button
              type="button"
              size="sm"
              onClick={handleBuy}
              disabled={pending || !affordable}
              aria-label={
                affordable
                  ? `${isGrant ? "Redeem" : "Buy"} ${item.name}`
                  : `Not enough shards for ${item.name}`
              }
              className={cn(
                "rounded-xs border-2 border-black/20 bg-orange font-medium text-black hover:bg-orange/85",
              )}
            >
              {pending ? (
                <SpinnerIcon className="size-4 animate-spin" />
              ) : !affordable ? (
                "Locked"
              ) : isGrant ? (
                "Redeem"
              ) : (
                "Buy"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

/** HCB-style grant credit card. */
function GrantMedia({ item }: { item: ShopItem }) {
  const gradient = GRANT_GRADIENTS[item.id % GRANT_GRADIENTS.length];
  const last4 = String(1000 + (item.id % 9000));

  return (
    <div className="border-black/20 border-b-2 p-3">
      <div
        className={cn(
          "noise relative flex h-32 flex-col overflow-hidden rounded-xs p-3 text-white",
          gradient,
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">
            grant card
          </span>
          <span className="font-sacco text-white/90 text-xs">HCB</span>
        </div>
        <div className="mt-3 h-5 w-8 rounded-[2px] bg-white/30" />
        <div className="mt-auto font-mono text-sm text-white/90 tracking-[0.18em]">
          •••• •••• •••• {last4}
        </div>
      </div>
    </div>
  );
}

/** Product image placeholder — shop_item has no image column yet. */
function ItemMedia({ name }: { name: string }) {
  return (
    <div className="noise relative flex h-[152px] items-center justify-center border-black/20 border-b-2 bg-muted">
      <CubeIcon className="size-12 text-black/15" />
      <span className="sr-only">{name}</span>
    </div>
  );
}

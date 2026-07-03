"use client";

import { GlobeHemisphereWestIcon } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SHOP_REGIONS } from "@/hooks/use-shop";

/** Region picker — selects the index into `ShopItem.cost` used to show prices. */
export function RegionSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (region: number) => void;
}) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="rounded-xs border-2 border-black/20 lowercase">
        <GlobeHemisphereWestIcon className="size-4 text-black/50" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xs border-2 border-black/20">
        {SHOP_REGIONS.map((region, i) => (
          <SelectItem key={region.code} value={String(i)} className="lowercase">
            {region.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

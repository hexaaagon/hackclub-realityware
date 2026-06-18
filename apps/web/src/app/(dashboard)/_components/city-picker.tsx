"use client";

import { CheckCircleIcon, MapPinIcon } from "@phosphor-icons/react";
import { cn } from "@realityware/util";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { setCity, useCities } from "@/hooks/use-city";
import { useProfile } from "@/hooks/use-profile";

/** Drawer to pick / change the participant's city. Controlled by the caller. */
export function CityPicker({
  open,
  onOpenChange,
  currentCityId,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  currentCityId: number | null;
  onChanged?: () => void;
}) {
  const { cities, isLoading } = useCities();
  const [saving, setSaving] = useState<number | null>(null);

  async function pick(id: number) {
    if (saving) return;
    setSaving(id);
    const res = await setCity(id);
    setSaving(null);
    if (res.success) {
      toast.success(`You're repping ${res.cityName}!`);
      onChanged?.();
      onOpenChange(false);
    } else {
      toast.error(
        res.message === "not-logged-in"
          ? "Sign in to choose a city."
          : "Couldn't set your city. Try again.",
      );
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-black/20 border-t-2 bg-background">
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader className="px-4">
            <DrawerTitle className="font-sacco text-2xl uppercase leading-none">
              Choose your city
            </DrawerTitle>
            <DrawerDescription>
              Lorem ipsum — your coding hours and project tiers earn points for
              your city. Pick where you rep.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid grid-cols-2 gap-3 p-4">
            {isLoading
              ? ["sk-a", "sk-b", "sk-c", "sk-d"].map((k) => (
                  <div
                    key={k}
                    className="h-24 animate-pulse border-2 border-black/20 bg-card"
                  />
                ))
              : cities.map((cityItem) => {
                  const isCurrent = cityItem.id === currentCityId;
                  return (
                    <button
                      key={cityItem.id}
                      type="button"
                      disabled={saving !== null}
                      onClick={() => pick(cityItem.id)}
                      className={cn(
                        "relative flex h-24 flex-col items-center justify-center gap-1 border-2 bg-card outline-none transition-colors focus-visible:ring-2 focus-visible:ring-orange",
                        isCurrent
                          ? "border-orange"
                          : "border-black/20 hover:border-black/40",
                      )}
                    >
                      <MapPinIcon
                        weight="fill"
                        className="size-5 text-orange"
                      />
                      <span className="font-sacco text-lg uppercase">
                        {cityItem.name}
                      </span>
                      {isCurrent && (
                        <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 text-green text-xs">
                          <CheckCircleIcon weight="fill" className="size-3.5" />
                        </span>
                      )}
                      {saving === cityItem.id && (
                        <span className="text-black/50 text-xs">saving…</span>
                      )}
                    </button>
                  );
                })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * First-visit gate: opens the city picker automatically when a signed-in
 * participant has no city. No-op when not signed in (DEV_AUTH_BYPASS → no
 * profile), so it never nags the placeholder guest.
 */
export function CityGate() {
  const { profile, mutate } = useProfile();
  const [open, setOpen] = useState(false);

  const needsCity = !!profile && profile.account.cityId == null;
  useEffect(() => {
    if (needsCity) setOpen(true);
  }, [needsCity]);

  if (!profile) return null;

  return (
    <CityPicker
      open={open}
      onOpenChange={setOpen}
      currentCityId={profile.account.cityId}
      onChanged={() => mutate()}
    />
  );
}

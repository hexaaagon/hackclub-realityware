"use client";

import { ListIcon } from "@phosphor-icons/react";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { DashboardData } from "../_data";
import { SidebarInner } from "./participant-sidebar";

/** Mobile-only hamburger that opens the sidebar in a left vaul drawer. */
export function MobileMenu({ data }: { data: DashboardData }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="grid size-9 shrink-0 place-items-center rounded-xs border-2 border-black/20 bg-card text-black/70 outline-none transition-colors hover:text-black focus-visible:ring-2 focus-visible:ring-orange lg:hidden"
        >
          <ListIcon className="size-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="flex w-[280px] max-w-[82vw] flex-col gap-5 rounded-none border-black/20 border-r-2 bg-background p-4">
        <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>
        <SidebarInner
          data={data}
          navLayoutId="participant-nav-mobile"
          onNavigate={() => setOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  );
}

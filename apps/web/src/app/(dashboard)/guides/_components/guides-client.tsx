"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  CpuIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  SparkleIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import {
  Reveal,
  type SlidingTabItem,
  SlidingTabs,
  Stagger,
  StaggerItem,
  Sticker,
  Tilt,
} from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Category = "start" | "hardware" | "software" | "shipping";

type Guide = {
  id: string;
  title: string;
  category: Category;
  readMins: number;
  excerpt: string;
  body: string[];
};

const CATEGORY_META: Record<
  Category,
  { label: string; icon: React.ReactNode }
> = {
  start: {
    label: "getting started",
    icon: <SparkleIcon className="size-3.5" />,
  },
  hardware: { label: "hardware", icon: <CpuIcon className="size-3.5" /> },
  software: { label: "software", icon: <WrenchIcon className="size-3.5" /> },
  shipping: {
    label: "shipping",
    icon: <RocketLaunchIcon className="size-3.5" />,
  },
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis. Praesent euismod, nibh vel commodo.";

// Placeholder content — teammates own the real guides copy.
const GUIDES: Guide[] = [
  {
    id: "g1",
    title: "What is Realityware?",
    category: "start",
    readMins: 3,
    excerpt: LOREM,
    body: [LOREM, LOREM, LOREM],
  },
  {
    id: "g2",
    title: "Setting up your dev environment",
    category: "start",
    readMins: 6,
    excerpt: LOREM,
    body: [LOREM, LOREM],
  },
  {
    id: "g3",
    title: "Picking a real-world problem",
    category: "start",
    readMins: 4,
    excerpt: LOREM,
    body: [LOREM, LOREM, LOREM],
  },
  {
    id: "g4",
    title: "Soldering 101",
    category: "hardware",
    readMins: 8,
    excerpt: LOREM,
    body: [LOREM, LOREM],
  },
  {
    id: "g5",
    title: "Choosing a microcontroller",
    category: "hardware",
    readMins: 5,
    excerpt: LOREM,
    body: [LOREM, LOREM, LOREM],
  },
  {
    id: "g6",
    title: "Wiring sensors safely",
    category: "hardware",
    readMins: 7,
    excerpt: LOREM,
    body: [LOREM, LOREM],
  },
  {
    id: "g7",
    title: "Structuring your codebase",
    category: "software",
    readMins: 6,
    excerpt: LOREM,
    body: [LOREM, LOREM, LOREM],
  },
  {
    id: "g8",
    title: "Logging time with Hackatime",
    category: "software",
    readMins: 4,
    excerpt: LOREM,
    body: [LOREM, LOREM],
  },
  {
    id: "g9",
    title: "Shipping & demoing your build",
    category: "shipping",
    readMins: 5,
    excerpt: LOREM,
    body: [LOREM, LOREM, LOREM],
  },
];

const TABS: SlidingTabItem<Category | "all">[] = [
  { id: "all", label: "all" },
  { id: "start", label: "start" },
  { id: "hardware", label: "hardware" },
  { id: "software", label: "software" },
  { id: "shipping", label: "shipping" },
];

export function GuidesClient() {
  const [tab, setTab] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [openGuide, setOpenGuide] = useState<Guide | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GUIDES.filter((g) => {
      if (tab !== "all" && g.category !== tab) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) || g.excerpt.toLowerCase().includes(q)
      );
    });
  }, [tab, query]);

  return (
    <div className="relative flex flex-col gap-6">
      <Sticker className="absolute top-3 right-3 z-30 hidden sm:block">
        <span className="block border-2 border-black bg-blue px-2 py-1 font-sacco text-xs uppercase shadow-[2px_2px_0_rgba(0,0,0,0.25)]">
          ✦ rtfm
        </span>
      </Sticker>
      {/* Header */}
      <Reveal>
        <section className="noise relative flex flex-col gap-1 overflow-hidden border-2 border-black/20 bg-gradient-to-r from-green/15 via-card to-blue/10 p-5">
          <span className="font-sacco text-xl uppercase">
            guides<span className="text-orange">=</span>
          </span>
          <h1 className="max-w-lg font-sacco text-2xl uppercase leading-none sm:text-3xl">
            Lorem ipsum — learn to build
          </h1>
          <p className="mt-1 max-w-prose text-black/55 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            varius a nisl nec iaculis.
          </p>
        </section>
      </Reveal>

      {/* Controls */}
      <Reveal className="flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-1 w-full overflow-x-auto px-1 sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0">
          <SlidingTabs
            items={TABS}
            active={tab}
            onChange={setTab}
            layoutId="guides-cats"
            className="rounded-xs"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-black/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides…"
            className="rounded-xs border-2 border-black/20 pl-8"
          />
        </div>
      </Reveal>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Empty className="border-2 border-black/20 bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MagnifyingGlassIcon className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="font-sacco text-base uppercase">
              No guides found
            </EmptyTitle>
            <EmptyDescription>
              Lorem ipsum — try a different search or category.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Stagger
          key={`${tab}-${query}`}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          amount="some"
        >
          {filtered.map((g) => (
            <StaggerItem key={g.id} className="h-full">
              <Tilt className="block h-full">
                <button
                  type="button"
                  onClick={() => setOpenGuide(g)}
                  className="flex h-full w-full flex-col gap-3 border-2 border-black/20 bg-card p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-orange"
                >
                  <Badge
                    variant="outline"
                    className="w-fit gap-1 rounded-xs border-2 border-black/20 font-sacco uppercase"
                  >
                    {CATEGORY_META[g.category].icon}
                    {CATEGORY_META[g.category].label}
                  </Badge>
                  <h3 className="font-sacco text-lg uppercase leading-tight">
                    {g.title}
                  </h3>
                  <p className="line-clamp-3 flex-1 text-black/55 text-sm">
                    {g.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-black/50 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="size-3.5" />
                      {g.readMins} min read
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-orange">
                      Read <ArrowRightIcon className="size-3.5" />
                    </span>
                  </div>
                </button>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {/* Reading view */}
      <Sheet open={!!openGuide} onOpenChange={(o) => !o && setOpenGuide(null)}>
        <SheetContent className="w-full gap-0 overflow-y-auto border-black/20 border-l-2 bg-background sm:max-w-lg">
          {openGuide && (
            <>
              <SheetHeader className="border-black/20 border-b-2">
                <Badge
                  variant="outline"
                  className="w-fit gap-1 rounded-xs border-2 border-black/20 font-sacco uppercase"
                >
                  {CATEGORY_META[openGuide.category].icon}
                  {CATEGORY_META[openGuide.category].label}
                </Badge>
                <SheetTitle className="font-sacco text-2xl uppercase leading-none">
                  {openGuide.title}
                </SheetTitle>
                <SheetDescription className="inline-flex items-center gap-1">
                  <ClockIcon className="size-3.5" />
                  {openGuide.readMins} min read
                </SheetDescription>
              </SheetHeader>
              <article className="flex flex-col gap-4 p-4 text-sm leading-relaxed">
                <div className="grid h-40 place-items-center border-2 border-black/20 bg-muted">
                  <BookOpenIcon className="size-10 text-black/15" />
                </div>
                {openGuide.body.map((p, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder paragraphs, stable order
                  <p key={`${openGuide.id}-p${i}`} className="text-black/70">
                    {p}
                  </p>
                ))}
              </article>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

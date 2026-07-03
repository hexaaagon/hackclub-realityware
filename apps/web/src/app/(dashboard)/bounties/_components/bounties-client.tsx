"use client";

import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  ClockIcon,
  LeafIcon,
  LinkIcon,
  PaperPlaneTiltIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@realityware/util";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Graffiti from "#/images/graffiti.svg";
import {
  ParallaxLayer,
  Reveal,
  ShardBurst,
  type ShardBurstHandle,
  Stagger,
  StaggerItem,
  Sticker,
  Tilt,
} from "@/components/motion";
import { Button } from "@/components/ui/button";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type Bounty,
  type BountySubmission,
  type SubmissionStatus,
  submitBounty,
  useBounties,
} from "@/hooks/use-bounties";

const PROGRAM_WEEKS = 12;

const STATUS_META: Record<
  SubmissionStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  pending: {
    label: "pending review",
    icon: <ClockIcon className="size-3.5" />,
    className: "text-dark-blue",
  },
  approved: {
    label: "approved",
    icon: <CheckCircleIcon weight="fill" className="size-3.5" />,
    className: "text-green",
  },
  rejected: {
    label: "needs changes",
    icon: <XCircleIcon weight="fill" className="size-3.5" />,
    className: "text-orange",
  },
};

export function BountiesClient() {
  const { bounties, submissions, isLoading, error, mutate } = useBounties();
  const burstRef = useRef<ShardBurstHandle>(null);

  const [panel, setPanel] = useState<{
    mode: "submit" | "view";
    bounty: Bounty;
  } | null>(null);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subByBounty = useMemo(() => {
    const m = new Map<number, BountySubmission>();
    for (const s of submissions) m.set(s.bountyId, s);
    return m;
  }, [submissions]);

  const { featured, archive } = useMemo(() => {
    if (bounties.length === 0)
      return { featured: null, archive: [] as Bounty[] };
    const active = bounties.find((b) => b.status === "active") ?? bounties[0];
    return {
      featured: active,
      archive: bounties.filter((b) => b.id !== active.id),
    };
  }, [bounties]);

  function openSubmit(bounty: Bounty) {
    setUrl("");
    setNotes("");
    setPanel({ mode: "submit", bounty });
  }

  async function handleSubmit() {
    if (!panel || submitting) return;
    if (!/^https?:\/\/.+/.test(url.trim())) {
      toast.error("Enter a valid http(s) URL.");
      return;
    }
    setSubmitting(true);
    const res = await submitBounty(
      panel.bounty.id,
      url.trim(),
      notes.trim() || undefined,
    );
    setSubmitting(false);

    if (res.success) {
      burstRef.current?.fire();
      toast.success("Build submitted — good luck!");
      setPanel(null);
      mutate();
    } else {
      const copy: Record<string, string> = {
        "already-submitted": "You've already submitted to this bounty.",
        "bounty-not-found": "That bounty no longer exists.",
        "not-logged-in": "Sign in to submit.",
      };
      toast.error(copy[res.message] ?? "Couldn't submit. Try again.");
    }
  }

  if (error) {
    return (
      <Empty className="border-2 border-black/20 bg-card">
        <EmptyHeader>
          <EmptyTitle className="font-sacco text-base uppercase">
            Couldn&apos;t load bounties
          </EmptyTitle>
          <EmptyDescription>
            Lorem ipsum dolor sit amet — something went wrong.
          </EmptyDescription>
        </EmptyHeader>
        <Button
          type="button"
          onClick={() => mutate()}
          className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
        >
          <ArrowClockwiseIcon className="size-4" />
          Try again
        </Button>
      </Empty>
    );
  }

  if (isLoading) return <BountiesSkeleton />;

  return (
    <div className="relative flex flex-col gap-6">
      <Sticker className="absolute top-3 right-3 z-30 hidden sm:block">
        <span className="block border-2 border-black bg-yellow px-2 py-1 font-sacco text-xs uppercase shadow-[2px_2px_0_rgba(0,0,0,0.25)]">
          ★ 26 green
        </span>
      </Sticker>
      {/* Header */}
      <Reveal>
        <section className="noise relative flex flex-col gap-1 overflow-hidden border-2 border-black/20 bg-gradient-to-r from-green/20 via-card to-orange/10 p-5">
          <ParallaxLayer
            mouse
            speed={0.2}
            className="pointer-events-none absolute -right-4 -bottom-10 z-0"
          >
            <Image
              src={Graffiti}
              alt=""
              aria-hidden
              className="h-40 w-auto opacity-30"
            />
          </ParallaxLayer>
          <span className="relative z-10 font-sacco text-xl uppercase">
            bounties<span className="text-orange">=</span>
          </span>
          <h1 className="relative z-10 max-w-lg font-sacco text-2xl uppercase leading-none sm:text-3xl">
            Lorem ipsum — weekly challenges
          </h1>
        </section>
      </Reveal>

      {!featured ? (
        <Empty className="border-2 border-black/20 bg-card">
          <EmptyHeader>
            <EmptyMedia>
              <Image
                src={Graffiti}
                alt=""
                aria-hidden
                className="h-24 w-auto animate-float opacity-60"
              />
            </EmptyMedia>
            <EmptyTitle className="font-sacco text-base uppercase">
              No bounties yet
            </EmptyTitle>
            <EmptyDescription>
              Lorem ipsum dolor sit amet — this week&apos;s bounty drops soon.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {/* This week's bounty */}
          <Reveal>
            <div className="relative border-2 border-black/20 bg-card">
              <ShardBurst ref={burstRef} />
              <div className="flex flex-col lg:flex-row">
                <div className="noise relative grid min-h-44 place-items-center border-black/20 border-b-2 bg-muted lg:w-2/5 lg:border-r-2 lg:border-b-0">
                  {featured.imageUrl ? (
                    // biome-ignore lint/performance/noImgElement: remote bounty image, no domain allowlist
                    <img
                      src={featured.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <LeafIcon className="size-12 text-green/40" weight="fill" />
                  )}
                  <span className="absolute top-3 left-3 border-2 border-black/20 bg-orange px-2 py-0.5 font-sacco text-xs uppercase">
                    this week
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <span className="font-sacco text-black/60 text-sm uppercase tracking-wide">
                    Week {featured.week}{" "}
                    <span className="text-black/30">/ {PROGRAM_WEEKS}</span>
                  </span>
                  <h2 className="font-sacco text-2xl uppercase leading-none">
                    {featured.title}
                  </h2>
                  <p className="line-clamp-4 text-black/65 text-sm leading-relaxed">
                    {featured.description}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                    <SubmissionState
                      submission={subByBounty.get(featured.id)}
                      onSubmit={() => openSubmit(featured)}
                      onView={() =>
                        setPanel({ mode: "view", bounty: featured })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Archive */}
          {archive.length > 0 && (
            <>
              <Reveal className="flex items-center gap-2">
                <h2 className="font-sacco text-xl uppercase">Archive</h2>
                <span className="border-2 border-black/20 bg-card px-2 py-0.5 font-mono text-black/60 text-xs">
                  {archive.length}
                </span>
              </Reveal>
              <Stagger className="flex flex-col gap-3" amount="some">
                {archive.map((b) => {
                  const sub = subByBounty.get(b.id);
                  return (
                    <StaggerItem key={b.id}>
                      <Tilt className="block" lift={2}>
                        <button
                          type="button"
                          onClick={() => setPanel({ mode: "view", bounty: b })}
                          className="flex w-full items-center gap-3 border-2 border-black/20 bg-card p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-orange"
                        >
                          <span className="grid size-11 shrink-0 place-items-center border-2 border-black/20 bg-muted font-sacco text-sm">
                            W{b.week}
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium text-sm">
                              {b.title}
                            </span>
                            <span className="truncate text-black/45 text-xs">
                              {b.description}
                            </span>
                          </span>
                          {sub && (
                            <span
                              className={cn(
                                "inline-flex shrink-0 items-center gap-1 font-medium text-xs",
                                STATUS_META[sub.status].className,
                              )}
                            >
                              {STATUS_META[sub.status].icon}
                              <span className="hidden sm:inline">
                                {STATUS_META[sub.status].label}
                              </span>
                            </span>
                          )}
                        </button>
                      </Tilt>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </>
          )}
        </>
      )}

      {/* Submit / view panel */}
      <Sheet open={!!panel} onOpenChange={(o) => !o && setPanel(null)}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto border-black/20 border-l-2 bg-background sm:max-w-lg">
          {panel && (
            <>
              <SheetHeader className="border-black/20 border-b-2">
                <span className="font-sacco text-black/55 text-xs uppercase">
                  Week {panel.bounty.week} / {PROGRAM_WEEKS}
                </span>
                <SheetTitle className="font-sacco text-2xl uppercase leading-none">
                  {panel.bounty.title}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Bounty prompt and submission
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 p-4 text-sm leading-relaxed">
                <p className="text-black/70">{panel.bounty.description}</p>

                {panel.mode === "submit" ? (
                  <div className="flex flex-col gap-3 border-black/20 border-t-2 pt-4">
                    <label htmlFor="bounty-url" className="flex flex-col gap-1">
                      <span className="font-medium text-xs uppercase">
                        Build URL
                      </span>
                      <span className="relative">
                        <LinkIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-black/40" />
                        <Input
                          id="bounty-url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://github.com/you/project"
                          className="rounded-xs border-2 border-black/20 pl-8"
                        />
                      </span>
                    </label>
                    <label
                      htmlFor="bounty-notes"
                      className="flex flex-col gap-1"
                    >
                      <span className="font-medium text-xs uppercase">
                        Notes (optional)
                      </span>
                      <textarea
                        id="bounty-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        placeholder="Lorem ipsum — anything reviewers should know."
                        className="w-full resize-none rounded-xs border-2 border-black/20 bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-orange"
                      />
                    </label>
                  </div>
                ) : (
                  <SubmissionState
                    submission={subByBounty.get(panel.bounty.id)}
                    onSubmit={() =>
                      setPanel({ mode: "submit", bounty: panel.bounty })
                    }
                    onView={() => {}}
                    inline
                  />
                )}
              </div>

              {panel.mode === "submit" && (
                <SheetFooter className="mt-auto border-black/20 border-t-2">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
                  >
                    <PaperPlaneTiltIcon className="size-4" />
                    {submitting ? "Submitting…" : "Submit build"}
                  </Button>
                </SheetFooter>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** Either a "submit" CTA or the existing submission's status. */
function SubmissionState({
  submission,
  onSubmit,
  onView,
  inline,
}: {
  submission?: BountySubmission;
  onSubmit: () => void;
  onView: () => void;
  inline?: boolean;
}) {
  if (submission) {
    const meta = STATUS_META[submission.status];
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 border-2 border-black/20 bg-card px-2.5 py-1.5 font-medium text-sm",
            meta.className,
          )}
        >
          {meta.icon}
          Submitted · {meta.label}
        </span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <Button
        type="button"
        onClick={onSubmit}
        className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
      >
        <PaperPlaneTiltIcon className="size-4" />
        Submit your build
      </Button>
      {!inline && (
        <Button
          type="button"
          variant="outline"
          onClick={onView}
          className="rounded-xs border-2 border-black/20"
        >
          Read prompt
        </Button>
      )}
    </span>
  );
}

function BountiesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-24 rounded-none border-2 border-black/20" />
      <Skeleton className="h-52 rounded-none border-2 border-black/20" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-16 rounded-none border-2 border-black/20"
          />
        ))}
      </div>
    </div>
  );
}

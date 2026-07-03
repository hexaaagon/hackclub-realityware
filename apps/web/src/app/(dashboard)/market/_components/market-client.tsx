"use client";

import {
  CoinsIcon,
  GiftIcon,
  PackageIcon,
  PencilSimpleIcon,
  PlusIcon,
  StorefrontIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { cn } from "@realityware/util";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Graffiti from "#/images/graffiti.svg";
import {
  AmbientParticles,
  CountUp,
  ParallaxLayer,
  Reveal,
  ShardBurst,
  type ShardBurstHandle,
  type SlidingTabItem,
  SlidingTabs,
  Stagger,
  StaggerItem,
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
  addItem,
  buyItem,
  deleteItem,
  editItem,
  giftShards,
  type MarketItem,
  saveShop,
  useMarketShops,
  useMyShop,
} from "@/hooks/use-market";
import { useProfile } from "@/hooks/use-profile";

type Tab = "browse" | "my-shop";
const TABS: SlidingTabItem<Tab>[] = [
  { id: "browse", label: "browse" },
  { id: "my-shop", label: "my shop" },
];

const ERR: Record<string, string> = {
  "insufficient-shards": "Not enough shards.",
  "cannot-buy-own": "You can't buy your own listing.",
  "cannot-gift-self": "You can't gift yourself.",
  "item-unavailable": "That listing is no longer available.",
  "item-not-found": "That listing is gone.",
  "recipient-not-found": "No participant by that name.",
  "ambiguous-recipient": "Multiple matches — use their Slack handle.",
  "no-shop": "Create your shop first.",
  "not-logged-in": "Sign in to continue.",
};
const errCopy = (m: string) => ERR[m] ?? "Something went wrong.";

export function MarketClient() {
  const [tab, setTab] = useState<Tab>("browse");
  const [giftOpen, setGiftOpen] = useState(false);
  const burstRef = useRef<ShardBurstHandle>(null);

  const { profile, mutate: mutateProfile } = useProfile();
  const myId = profile?.account.id ?? null;
  const myShards = profile?.account.shards ?? 0;

  function celebrate() {
    burstRef.current?.fire();
    mutateProfile();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Reveal>
        <section className="noise relative overflow-hidden border-2 border-black/20 bg-gradient-to-r from-blue/15 via-card to-orange/10">
          <AmbientParticles />
          <ParallaxLayer
            mouse
            speed={0.2}
            className="pointer-events-none absolute -right-4 -bottom-12 z-0"
          >
            <Image
              src={Graffiti}
              alt=""
              aria-hidden
              className="h-48 w-auto opacity-30"
            />
          </ParallaxLayer>
          <ShardBurst ref={burstRef} />
          <div className="relative z-10 flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="font-sacco text-xl uppercase">
                market<span className="text-orange">=</span>
              </span>
              <span className="inline-flex items-center gap-1.5 border-2 border-black/20 bg-card px-2.5 py-1 text-sm">
                <CoinsIcon weight="fill" className="size-4 text-orange" />
                <CountUp
                  value={myShards}
                  animateOnMount
                  className="font-medium tabular-nums"
                />
                <span className="text-black/50">shards</span>
              </span>
            </div>
            <h1 className="max-w-lg font-sacco text-2xl uppercase leading-none sm:text-3xl">
              Lorem ipsum — trade with the city
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <SlidingTabs
                items={TABS}
                active={tab}
                onChange={setTab}
                layoutId="market-tabs"
                className="rounded-xs"
              />
              <Button
                type="button"
                onClick={() => setGiftOpen(true)}
                className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
              >
                <GiftIcon className="size-4" />
                Gift shards
              </Button>
            </div>
          </div>
        </section>
      </Reveal>

      {tab === "browse" ? (
        <BrowseTab myId={myId} myShards={myShards} onBought={celebrate} />
      ) : (
        <MyShopTab />
      )}

      <GiftSheet
        open={giftOpen}
        onOpenChange={setGiftOpen}
        myShards={myShards}
        onGifted={celebrate}
      />
    </div>
  );
}

/* ------------------------------- Browse ---------------------------------- */

function BrowseTab({
  myId,
  myShards,
  onBought,
}: {
  myId: number | null;
  myShards: number;
  onBought: () => void;
}) {
  const { shops, isLoading, error, mutate } = useMarketShops();

  const listings = shops.flatMap((s) =>
    s.items.map((it) => ({
      ...it,
      shopName: s.name,
      ownerName: s.ownerName,
      ownerId: s.owner,
    })),
  );

  if (error) {
    return (
      <MarketEmpty
        title="Couldn't load the market"
        description="Lorem ipsum dolor sit amet — something went wrong."
        retry={() => mutate()}
      />
    );
  }
  if (isLoading) return <CardGridSkeleton />;
  if (listings.length === 0) {
    return (
      <MarketEmpty
        graffiti
        title="No listings yet"
        description="Lorem ipsum — be the first to open a shop and list something."
      />
    );
  }

  return (
    <Stagger
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      amount="some"
    >
      {listings.map((it) => (
        <StaggerItem key={it.id} className="h-full">
          <BrowseCard
            item={it}
            shopName={it.shopName}
            ownerName={it.ownerName}
            isMine={it.ownerId === myId}
            affordable={myShards >= it.priceShards}
            onBought={() => {
              mutate();
              onBought();
            }}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function BrowseCard({
  item,
  shopName,
  ownerName,
  isMine,
  affordable,
  onBought,
}: {
  item: MarketItem;
  shopName: string;
  ownerName: string;
  isMine: boolean;
  affordable: boolean;
  onBought: () => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleBuy() {
    if (pending) return;
    setPending(true);
    const res = await buyItem(item.id);
    setPending(false);
    if (res.success) {
      toast.success(`Bought ${item.title}!`);
      onBought();
    } else {
      toast.error(errCopy(res.message));
    }
  }

  return (
    <Tilt className="block h-full">
      <div className="flex h-full flex-col border-2 border-black/20 bg-card">
        <div className="noise relative flex h-32 items-center justify-center border-black/20 border-b-2 bg-muted">
          {item.imageUrl ? (
            // biome-ignore lint/performance/noImgElement: remote listing image, no domain allowlist
            <img
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <PackageIcon className="size-10 text-black/15" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="flex flex-1 flex-col">
            <h3 className="font-medium text-base leading-tight">
              {item.title}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-black/50 text-xs">
              {item.description}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-black/45 text-xs">
              <StorefrontIcon className="size-3.5" />
              {shopName} · {ownerName}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5">
              <CoinsIcon weight="fill" className="size-4 text-orange" />
              <span className="font-medium text-sm tabular-nums">
                {item.priceShards}
              </span>
            </span>
            <Button
              type="button"
              size="sm"
              onClick={handleBuy}
              disabled={pending || isMine || !affordable}
              className="rounded-xs border-2 border-black/20 bg-orange font-medium text-black hover:bg-orange/85"
            >
              {isMine
                ? "Yours"
                : pending
                  ? "…"
                  : !affordable
                    ? "Locked"
                    : "Buy"}
            </Button>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

/* ------------------------------- My Shop --------------------------------- */

function MyShopTab() {
  const { shop, items, isLoading, error, mutate } = useMyShop();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [savingShop, setSavingShop] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [itemSheet, setItemSheet] = useState<
    { mode: "add" } | { mode: "edit"; item: MarketItem } | null
  >(null);

  // Seed the form from the loaded shop once.
  if (shop && !seeded) {
    setName(shop.name);
    setDescription(shop.description);
    setSeeded(true);
  }

  async function handleSaveShop() {
    if (savingShop) return;
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required.");
      return;
    }
    setSavingShop(true);
    const res = await saveShop(name.trim(), description.trim());
    setSavingShop(false);
    if (res.success) {
      toast.success(shop ? "Shop updated!" : "Shop created!");
      mutate();
    } else {
      toast.error(errCopy(res.message));
    }
  }

  async function handleDeactivate(item: MarketItem) {
    const res = await deleteItem(item.id);
    if (res.success) {
      toast.success("Listing deactivated.");
      mutate();
    } else {
      toast.error(errCopy(res.message));
    }
  }

  if (error) {
    return (
      <MarketEmpty
        title="Couldn't load your shop"
        description="Lorem ipsum dolor sit amet — something went wrong."
        retry={() => mutate()}
      />
    );
  }
  if (isLoading) return <CardGridSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      {/* Shop details */}
      <Reveal className="flex flex-col gap-3 border-2 border-black/20 bg-card p-4">
        <h2 className="font-sacco text-lg uppercase">
          {shop ? "Your shop" : "Open your shop"}
        </h2>
        <label htmlFor="shop-name" className="flex flex-col gap-1">
          <span className="font-medium text-xs uppercase">Shop name</span>
          <Input
            id="shop-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Orpheus' Emporium"
            className="rounded-xs border-2 border-black/20"
          />
        </label>
        <label htmlFor="shop-desc" className="flex flex-col gap-1">
          <span className="font-medium text-xs uppercase">Description</span>
          <textarea
            id="shop-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Lorem ipsum — what you sell."
            className="w-full resize-none rounded-xs border-2 border-black/20 bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-orange"
          />
        </label>
        <Button
          type="button"
          onClick={handleSaveShop}
          disabled={savingShop}
          className="w-fit rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
        >
          {savingShop ? "Saving…" : shop ? "Save shop" : "Create shop"}
        </Button>
      </Reveal>

      {/* Listings */}
      {shop && (
        <>
          <Reveal className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-sacco text-xl uppercase">Listings</h2>
              <span className="border-2 border-black/20 bg-card px-2 py-0.5 font-mono text-black/60 text-xs">
                {items.length}
              </span>
            </div>
            <Button
              type="button"
              onClick={() => setItemSheet({ mode: "add" })}
              className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
            >
              <PlusIcon className="size-4" />
              Add listing
            </Button>
          </Reveal>

          {items.length === 0 ? (
            <MarketEmpty
              graffiti
              title="No listings yet"
              description="Lorem ipsum — add your first item for sale."
            />
          ) : (
            <Stagger className="flex flex-col gap-3" amount="some">
              {items.map((it) => (
                <StaggerItem key={it.id}>
                  <div className="flex items-center gap-3 border-2 border-black/20 bg-card p-3">
                    <div className="grid size-11 shrink-0 place-items-center border-2 border-black/20 bg-muted">
                      <PackageIcon className="size-5 text-black/25" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium text-sm">
                        {it.title}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-black/50 text-xs">
                        <CoinsIcon
                          weight="fill"
                          className="size-3.5 text-orange"
                        />
                        {it.priceShards}
                        <StatusBadge status={it.status} />
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        aria-label={`Edit ${it.title}`}
                        onClick={() => setItemSheet({ mode: "edit", item: it })}
                        className="rounded-xs border-2 border-black/20"
                      >
                        <PencilSimpleIcon className="size-4" />
                      </Button>
                      {it.status !== "inactive" && (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Deactivate ${it.title}`}
                          onClick={() => handleDeactivate(it)}
                          className="rounded-xs border-2 border-black/20"
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </>
      )}

      <ItemSheet
        state={itemSheet}
        onClose={() => setItemSheet(null)}
        onSaved={() => {
          setItemSheet(null);
          mutate();
        }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: MarketItem["status"] }) {
  const map = {
    active: "text-green",
    sold: "text-dark-blue",
    inactive: "text-black/40",
  } as const;
  return (
    <span className={cn("font-medium uppercase", map[status])}>· {status}</span>
  );
}

/* ----------------------------- Item Sheet -------------------------------- */

function ItemSheet({
  state,
  onClose,
  onSaved,
}: {
  state: { mode: "add" } | { mode: "edit"; item: MarketItem } | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = state?.mode === "edit" ? state.item : null;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [key, setKey] = useState<number | "add" | null>(null);

  // Re-seed fields whenever the sheet target changes.
  const targetKey = editing ? editing.id : state ? "add" : null;
  if (targetKey !== key) {
    setKey(targetKey);
    setTitle(editing?.title ?? "");
    setDescription(editing?.description ?? "");
    setPrice(editing ? String(editing.priceShards) : "");
    setImageUrl(editing?.imageUrl ?? "");
  }

  async function handleSave() {
    if (saving) return;
    const priceNum = Number(price);
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    if (!Number.isInteger(priceNum) || priceNum <= 0) {
      toast.error("Price must be a positive whole number of shards.");
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      priceShards: priceNum,
      ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
    };
    const res = editing
      ? await editItem(editing.id, payload)
      : await addItem(payload);
    setSaving(false);
    if (res.success) {
      toast.success(editing ? "Listing updated!" : "Listing added!");
      onSaved();
    } else {
      toast.error(errCopy(res.message));
    }
  }

  return (
    <Sheet open={!!state} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto border-black/20 border-l-2 bg-background sm:max-w-md">
        <SheetHeader className="border-black/20 border-b-2">
          <SheetTitle className="font-sacco text-2xl uppercase leading-none">
            {editing ? "Edit listing" : "Add listing"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Listing details
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 p-4">
          <label htmlFor="it-title" className="flex flex-col gap-1">
            <span className="font-medium text-xs uppercase">Title</span>
            <Input
              id="it-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xs border-2 border-black/20"
            />
          </label>
          <label htmlFor="it-desc" className="flex flex-col gap-1">
            <span className="font-medium text-xs uppercase">Description</span>
            <textarea
              id="it-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xs border-2 border-black/20 bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-orange"
            />
          </label>
          <label htmlFor="it-price" className="flex flex-col gap-1">
            <span className="font-medium text-xs uppercase">
              Price (shards)
            </span>
            <Input
              id="it-price"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="100"
              className="rounded-xs border-2 border-black/20"
            />
          </label>
          <label htmlFor="it-img" className="flex flex-col gap-1">
            <span className="font-medium text-xs uppercase">
              Image URL (optional)
            </span>
            <Input
              id="it-img"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className="rounded-xs border-2 border-black/20"
            />
          </label>
        </div>
        <SheetFooter className="mt-auto border-black/20 border-t-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Add listing"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ----------------------------- Gift Sheet -------------------------------- */

function GiftSheet({
  open,
  onOpenChange,
  myShards,
  onGifted,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  myShards: number;
  onGifted: () => void;
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  async function handleGift() {
    if (sending) return;
    const amt = Number(amount);
    if (!to.trim()) {
      toast.error("Enter a recipient.");
      return;
    }
    if (!Number.isInteger(amt) || amt <= 0) {
      toast.error("Amount must be a positive whole number.");
      return;
    }
    if (amt > myShards) {
      toast.error("Not enough shards.");
      return;
    }
    setSending(true);
    const res = await giftShards(to.trim(), amt, note.trim() || undefined);
    setSending(false);
    if (res.success) {
      toast.success(`Gifted ${amt} shards to ${res.recipient}!`);
      setTo("");
      setAmount("");
      setNote("");
      onOpenChange(false);
      onGifted();
    } else {
      toast.error(errCopy(res.message));
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto border-black/20 border-l-2 bg-background sm:max-w-md">
        <SheetHeader className="border-black/20 border-b-2">
          <SheetTitle className="font-sacco text-2xl uppercase leading-none">
            Gift shards
          </SheetTitle>
          <SheetDescription className="inline-flex items-center gap-1.5">
            <CoinsIcon weight="fill" className="size-3.5 text-orange" />
            {myShards} available
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 p-4">
          <label htmlFor="gift-to" className="flex flex-col gap-1">
            <span className="font-medium text-xs uppercase">
              Recipient (handle or name)
            </span>
            <Input
              id="gift-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="orpheus"
              className="rounded-xs border-2 border-black/20"
            />
          </label>
          <label htmlFor="gift-amt" className="flex flex-col gap-1">
            <span className="font-medium text-xs uppercase">Amount</span>
            <Input
              id="gift-amt"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50"
              className="rounded-xs border-2 border-black/20"
            />
          </label>
          <label htmlFor="gift-note" className="flex flex-col gap-1">
            <span className="font-medium text-xs uppercase">
              Note (optional)
            </span>
            <textarea
              id="gift-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Lorem ipsum — say something nice."
              className="w-full resize-none rounded-xs border-2 border-black/20 bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-orange"
            />
          </label>
        </div>
        <SheetFooter className="mt-auto border-black/20 border-t-2">
          <Button
            type="button"
            onClick={handleGift}
            disabled={sending}
            className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
          >
            <GiftIcon className="size-4" />
            {sending ? "Sending…" : "Send gift"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------ Shared ----------------------------------- */

function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Skeleton
          key={i}
          className="h-56 rounded-none border-2 border-black/20"
        />
      ))}
    </div>
  );
}

function MarketEmpty({
  title,
  description,
  graffiti,
  retry,
}: {
  title: string;
  description: string;
  graffiti?: boolean;
  retry?: () => void;
}) {
  return (
    <Empty className="border-2 border-black/20 bg-card">
      <EmptyHeader>
        {graffiti && (
          <EmptyMedia>
            <Image
              src={Graffiti}
              alt=""
              aria-hidden
              className="h-24 w-auto animate-float opacity-60"
            />
          </EmptyMedia>
        )}
        <EmptyTitle className="font-sacco text-base uppercase">
          {title}
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {retry && (
        <Button
          type="button"
          onClick={retry}
          className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
        >
          Try again
        </Button>
      )}
    </Empty>
  );
}

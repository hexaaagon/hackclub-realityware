# Realityware — Claude Code build playbook

> **Four rules for the whole build:**
> 1. **Text is placeholder** (lorem / mock) — teammates add real copy later.
> 2. **Everything technical is real and complete** — no stubs, no dead buttons, no fake data flows.
> 3. **It's playful and heavily animated** — springy, graffiti, alive. Follow MOTION.md everywhere.
> 4. **DB:** hexaa's shared dev DB — never seed. hexaa cleared you to apply any tables except journaling:
>    add your tables (`bounty`/`city`/`time_log`/`shop_order`) yourself via focused additive DDL through the
>    Supabase MCP (or `.env` session-pooler creds) — never `drizzle-kit generate`/`migrate` — heads-up after.
>    Journaling/`/explores` + `admin/**` are his.
>
> Run Claude Code from the repo root: `cd "/Users/Nihad/Projects/RealityWare Website" && claude`
> `CLAUDE.md` (root) auto-loads every session and imports `MOTION.md`. If CC drifts, say "re-read CLAUDE.md".
> *(This file is a personal working doc — gitignore it if you like. CLAUDE.md + MOTION.md stay committed.)*

---

## When to use Plan Mode (Shift+Tab)
**Rule of thumb:** plan mode when the task is **architectural, cross-cutting, or hard to undo** — adds a
dependency, changes the DB schema, defines shared foundations, or touches many files. **Skip it for a
single, well-specified page or a contained change** — the page spec already *is* the plan, so plan mode
just adds a round-trip. Each step below is tagged.

---

## Step 0 — One-time setup (MCPs) · PLAN MODE: n/a
A project `.mcp.json` is already in the repo (Figma, Playwright, Supabase). On first `claude` run, approve
the project MCP servers when prompted, then:
- **Figma:** in the Figma desktop app → Preferences → enable "Dev Mode MCP Server" (needs a Dev Mode plan).
  It serves on `http://127.0.0.1:3845/sse`. No Dev Mode plan? CC falls back to the `Assets/` PDFs.
- **Supabase:** CC will prompt to authenticate; use read-only scope first.
- Run `claude mcp list` to confirm all three are connected.
Skills (frontend-design, pdf-reading) auto-trigger — you don't invoke them.

---

## Step 1 — Recon + boot · PLAN MODE: NO (it's exploration; review the summary)

```
Read CLAUDE.md and MOTION.md fully — they're your contract for this whole project. Note the three rules:
placeholder text, real/complete functionality, playful + heavily animated.

Then:
1. Explore the repo and the Assets/ folder. Render Assets/Home page.pdf, Bounties.pdf, Explores.pdf,
   Shop.pdf, and SideBar.pdf to PNG with pdftoppm so you can see them.
2. Verify every claim in CLAUDE.md against the code (tokens in globals.css, fonts in layout.tsx,
   aliases, routing in apps/web/src/proxy.ts, the Drizzle schema). Fix any inaccuracies in CLAUDE.md.
3. Get `bun run dev` booting for apps/web. If env validation fails, create apps/web/.env.local with
   safe placeholders for non-critical vars and tell me exactly which real values you need.
4. Add an env-gated, development-only DEV_AUTH_BYPASS (off by default) in apps/web/src/proxy.ts so the
   (dashboard) routes render locally without HCA login. Do NOT change production behavior.
5. Check whether Supabase local dev is available (supabase CLI). If yes, get `supabase start` working
   for packages/database and confirm drizzle-kit can migrate against it. If not, tell me what to install.

Build nothing yet (no pages, no deps). End with: what's accurate/inaccurate in CLAUDE.md, the dev URL,
the local DB status, and exactly what you need from me.
```

After this: skim CC's CLAUDE.md edits, confirm the dev server runs, hand it any env values it asks for.

---

## Step 2 — Motion & playful-theme foundation · PLAN MODE: YES (adds a dep, defines shared primitives, edits globals.css + template.tsx)

```
Read CLAUDE.md and MOTION.md and follow them exactly.

Set up the motion + playful-theme foundation that every page will compose:
1. `bun add motion` in apps/web (Motion, React 19-ready). Keep the existing components/ui/fade-content.tsx
   and particles-bg.tsx.
2. Create apps/web/src/components/motion/: tokens.ts (durations, spring presets, easing from MOTION.md)
   and the primitives — Reveal, Stagger/StaggerItem, hover-lift/Tilt card wrapper, CountUp, ShardBurst,
   Marquee, ParallaxLayer, SlidingPill. Typed, composable, and reduced-motion aware (useReducedMotion).
3. Add global playful keyframe utilities to globals.css (marquee, wiggle, float, shimmer, pulse), mirror
   the duration tokens as CSS vars, and add the prefers-reduced-motion CSS fallback from MOTION.md.
4. Wire app/template.tsx for route-level page transitions (fade/slide), back/forward safe.
5. Add a small section to the /debug page that renders each primitive so we can eyeball them.

Copy = placeholder. Make it springy and alive but fast. biome format. Show me the primitives running,
summarize, flag assumptions.
```

Commit: `git add -A && git commit -m "feat(web): motion + playful theme foundation"`.

---

## Step 3 — Participant shell (animated) · PLAN MODE: YES (defines the layout every page depends on)

```
Read CLAUDE.md and MOTION.md and follow them exactly.

Build the shared participant sidebar + framed-canvas layout for the (dashboard) route group — the shell
every participant page lives in. Reference Assets/SideBar.pdf and Assets/Home page.pdf (or my current
Figma selection via the Figma MCP for exact spacing/colors).

Build:
- (dashboard)/layout.tsx: framed canvas — .noise root, 2px border-black/20, the 4 crop-mark corner
  squares, faint giant "RW" watermark behind content.
- A participant Sidebar (left rail): Realityware logo, "WEEK {n} / 12", "Welcome back, {name}!" + the
  star note line, boxed nav (home/bounties/explores/shop/guides), bottom profile card (avatar, name,
  shards + coin icon, logout). Phosphor icons.
- Content top bar: "● {n} people coding today" pill + EST clock, right-aligned.
- Footer: "Made by teenagers, for teenagers" with bracket marks.
- A typed data accessor at (dashboard)/_data.ts (placeholder impl for now — returns mock-shaped values
  for name/shards/week/online-count), return types aligned to the Drizzle account type so we can swap in
  the real DB next without changing callers.
- Wire nav to /, /bounties, /explores, /shop, /guides. Wire logout to better-auth signOut.

Motion (compose @/components/motion): sidebar items Reveal on mount; active nav item = a SlidingPill
(layoutId) that slides between routes + hover wiggle; profile card hover-lift; CountUp on the shards
balance and the "people coding today" number. Honor reduced-motion.

Copy = placeholder. Behavior = fully functional. Match the design system precisely (sharp corners,
font-sacco for WEEK/labels, Geist body, border-black/20). Then biome format, screenshot `/` via
Playwright, compare to Home page.pdf, iterate. Summarize + flag assumptions.
```

Commit when it matches.

---

## Step 4 — Adopt hexaa's live schema + map the gap (NO migration, NO seeding) · PLAN MODE: YES

> Update: the DB is fully hexaa's and already structured + migrated. We do NOT apply the migration I
> generated earlier, do NOT seed, and do NOT touch admin/**. We adopt his schema, wire the real
> logged-in account, and find the missing dashboard routes.

```
Read CLAUDE.md ("Data — hexaa's live DB is the source of truth" + "Environment & services"). The DB is
fully hexaa's and already structured + migrated (RLS). I must NOT diverge from it: no migrations, no
seeding, no `supabase start`. Also do NOT touch anything under apps/web/src/app/admin/** — he's working there.

Read-only first; report before changing anything:
1. Treat the live hosted dev DB (root `.env`) as the source of truth. With the Supabase MCP (read-only),
   inspect every table (public/auth/storage): columns, types, enums, FKs, RLS. Then drizzle-kit
   pull/introspect into a temp location and DIFF against packages/database/src/schema — show me where they
   differ. Connection: drizzle uses the direct/session connection (direct URL is IPv6-only, so use the
   SESSION pooler on 5432 if direct won't connect); runtime uses the transaction pooler.
2. Discard the migration I generated earlier (0001: city/bounty/journal/lapse/time_log/user_shop/
   shard_transfer + user_account.city_id) and any schema edits of mine NOT present in his live DB. Reset
   packages/database to match his live schema (his structure wins). Confirm __drizzle_migrations on the
   live DB is untouched. Apply NOTHING to the DB.
3. Wire the real logged-in account through the dashboard: replace the mock name/shards/avatar in
   (dashboard)/_data.ts with my real user_account row (id, display_name, avatar, email, role, shards) read
   from the live DB via the better-auth session. Handle first-login (row created on login) gracefully.
4. Map the gap for the PARTICIPANT dashboard only, and report:
   - which dashboard data already has tables/columns in his schema (so we just read them),
   - which backend API routes are MISSING (he said the user-dashboard routes are incomplete) — list them
     by endpoint, comparing existing Hono routes to what home/bounties/explores/shop/guides/profile need,
   - any data a page needs that has NO table in his schema — flag it (do NOT add tables; I'll ask hexaa).
5. Also fix: set DEV_AUTH_BYPASS=false in apps/web/.env.local (real HCA login works now); the logo not
   rendering in Sacco; and any Next dev-overlay issue.

Give me: the live schema summary, the exact list of my changes you're discarding, the gap list (missing
routes + any missing tables), and the auth/session status. WAIT for my go before building pages.
```

---

## Step 5 — Build the pages, fully wired + animated, one at a time
**PLAN MODE: NO by default** (the page spec is the plan). **YES for Shop** (purchase flow) **and for
Bounties + Leaderboard** (they add new tables → propose SQL + coordinate the migration with hexaa first).

Build order — **base first, then your new-table pages:**
**Home → Shop → Profile → Guides → Bounties → Leaderboard.** Skip **Explores** entirely (hexaa owns
journaling). Commit + screenshot-compare between each; `/clear` every 1–2 pages (CLAUDE.md re-grounds it).

**Data note:** Home/Shop/Profile/Guides read existing tables (placeholder-shaped where empty). Bounties
(`bounty`/`bounty_submission`) and Leaderboard (`city`/`city_score`/`time_log`) need NEW tables you own —
hexaa cleared you to apply them yourself: hand-author focused additive DDL and run it directly via the
Supabase MCP (`execute_sql`/`apply_migration`) or the `.env` session-pooler creds; never `drizzle-kit
generate`/`migrate`; heads-up hexaa (and confirm `user_account.city_id` with him since it's his table).

**Reusable template** — paste it, replacing `<PAGE>` / `<ROUTE>` / `<FILE>` and the `<PAGE-SPECIFIC>` block:

```
Read CLAUDE.md and MOTION.md and follow them exactly.

Build the <PAGE> page at <ROUTE> inside (dashboard), using the participant shell, the motion primitives
in @/components/motion, and the real data layer from Step 4.

Layout source of truth:
- If my Figma desktop is open: use my CURRENT SELECTION via the Figma MCP (exact spacing/sizes/colors).
- Otherwise: render Assets/<FILE> (pdftoppm -png -r 144) and match it pixel-for-pixel.

Rules:
- Copy = placeholder/lorem (teammates replace). Behavior = fully functional, wired to the DB via the SWR
  hooks / Hono routes; add any routes or mutations this page needs (zod-validated). Real loading, empty,
  and error states.
- Animate it per MOTION.md: Reveal + Stagger as content loads, springy hover-lift/press on cards and
  buttons, animated counters and sliding tab/toggle pills, AnimatePresence for list/tab changes. Honor
  reduced-motion.
- Match the design system (sharp corners/rounded-xs, 2px black/20 borders, .noise where shown, font-sacco
  uppercase headings, Geist body, brand color utilities, Phosphor icons). Currency = shards. "use client"
  only where interactive. Don't break mobile.

<PAGE-SPECIFIC>

When done: biome format, screenshot the route via Playwright, compare to the Figma/PDF, iterate until it
matches; trigger any mutations to confirm they persist. Summarize + list assumptions/missing assets.
```

**Per-page `<PAGE-SPECIFIC>` blocks:**

- **Home** — `<ROUTE>=/`, `<FILE>=Home page.pdf`
  Hero graffiti banner with **ParallaxLayers** (scroll + mouse) and idle-floating graffiti; two cards
  (free signed-sticker offer + "Join our Slack", links out); a collapsible Tutorial row with "Step 1" and
  a 5-step progress that tracks completion (spring fill + checkmark pop); a Featured section and a Your
  Projects section, both rendering from the projects in hexaa's DB (placeholder-shaped if none yet) with
  Stagger + hover-lift.

- **Bounties** — `<ROUTE>=/bounties`, `<FILE>=Bounties.pdf` — **(plan mode: YES — you add `bounty`/`bounty_submission`)**
  FIRST design the `bounty` (week, title, prompt, image_url, reward_shards, status) + `bounty_submission`
  (→bounty, →user_account, →project, status) tables in Drizzle, show me the DDL, then apply it directly to
  the dev DB (Supabase MCP `execute_sql`/`apply_migration` or the `.env` session-pooler creds; additive
  only, check-not-exists, NO `drizzle-kit generate`/`migrate`) and FYI hexaa. Then build: Left — "this week
  bounty" image card + caption, "WEEK n OUT OF 12 BOUNTIES" heading, "archive:" list (boxed rows); clicking
  an archive row swaps the prompt (AnimatePresence crossfade). Right — "prompt:" with the full brief. A
  "submit" action creates a bounty_submission (+ ShardBurst on success). All from the real tables.

- **Explores** — **SKIP. Hexaa owns journaling** (`journal_entry`/`lapse_entry` + the review/fraud +
  Hackatime integration). Don't build `/explores` or its schema.

- **Shop** — `<ROUTE>=/shop`, `<FILE>=Shop.pdf` — **(plan mode: YES — purchase flow)**
  Banner with graffiti quote; "categories:" toggles (all / grants / items, orange active SlidingPill) that
  filter; a region selector (NA/SA/EU/Asia/India/Oceania/Africa/Middle East) that switches the displayed
  price from the cost[8] array (CountUp on price change); grid of grant cards (HCB credit-card style) and
  item cards (image, name, "est. N hours", shard cost) with Stagger + hover-lift. A redeem/buy action that
  server-validates and deducts shards (can't go negative), creates an order for fulfillment, and fires a
  **ShardBurst** on success. Render the grant/item rows from hexaa's shop `item` table (the plan's grants + hardware are the reference).

- **Guides** — `<ROUTE>=/guides`, no mockup
  Derive a docs/tutorials index in the same visual language (boxed list or cards, font-sacco headings,
  working anchors/nav, Reveal on scroll). Keep it simple; ask me if unsure.

- **Leaderboard** — `<ROUTE>=/leaderboard`, no mockup — **(plan mode: YES — you add `city`/`city_score`/`time_log`)**
  FIRST design `city` (the 4: Ved/Valdia/Laria/Mora), `city_score`, and `time_log` (hours per user/project
  → shards + city points; first hour of first project not counted; also powers "people coding today") in
  Drizzle, plus `user_account.city_id`; show me the DDL, then apply the new tables directly to the dev DB
  (Supabase MCP or `.env` session-pooler creds; additive only, NO `drizzle-kit generate`/`migrate`) — but
  ping hexaa specifically before the `user_account.city_id` ALTER since it's his table. Then build: cities
  ranked by score (CountUp, members, top projects) + an individual leaderboard via SWR; animate rank
  changes. Scoring: 5 pts/hr IRL; tier → 100/66/33.

- **Profile** — `<ROUTE>=/profile`, no mockup
  Avatar/pfp, name, city, shards balance (CountUp), achievements grid (Stagger + hover pop), and the
  user's projects with ship status, all from the DB. Wire any editable bits (e.g., pfp upload to the HC CDN via HC_CDN_API_KEY).

---

## Step 6 — Polish
**PLAN MODE: YES** for substeps 1–2 (cross-cutting). **NO** for substep 3 (contained cleanup).

```
Read CLAUDE.md and MOTION.md. Final polish pass, in order, committing each step:
1. Mobile: implement the simpler mobile layout (reference Assets/mobile.pdf) — sidebar becomes a
   sheet/drawer (vaul) with animated open/close, cards stack, add demo projects to mobile. Test with
   Playwright at 390px.
2. Motion polish: ambient OGL particles-bg where appropriate (lazy, low opacity), richer hero parallax,
   draggable graffiti stickers with spring snap-back, a "26 GREEN • MADE BY TEENAGERS" Marquee, and
   ShardBurst on all reward events. Keep it subtle and performant.
3. A11y + cleanup: confirm prefers-reduced-motion is honored everywhere; keyboard nav, alt text, focus
   states; remove dead code; run biome format + lint and `bun run build`, and fix anything that breaks.
```

---

## Driving CC well
- Plan mode per the tags above (and the rule of thumb at the top).
- For fidelity, open the right frame in **Figma desktop and select it**, then say "use my current
  selection" — the Dev Mode MCP reads the live selection, which beats the PDF.
- Let it run the **screenshot → compare → iterate** loop via Playwright; that's where pixel-matching happens.
- **Commit between pages**, and `/clear` every couple of pages.
- If it drifts (npm, lucide, rounded corners, real copy instead of lorem, no animation), say "re-read CLAUDE.md".

## Inputs only you can provide
1. **Figma access** — Dev Mode MCP (Step 0) or it works from the `Assets/` PDFs.
2. **Database** — ✅ hexaa's hosted dev DB, wired via the root `.env`. You own `bounty`/`city`/`time_log`
   tables (propose SQL → hexaa applies, or apply with his ok); journaling + admin are his. Never
   seed/blind-migrate.
3. **Auth** — ✅ HCA keys are in `.env`; log in at localhost:3000 with an email prefixed
   `REALITYWAREDEVACCESS3000-`, then have hexaa flip your `role` to admin (your account row exists only
   after first login).
4. **Services** — ✅ PostHog, Hackatime, HC CDN keys are in `.env`. ❌ Airtable not wired (no key). Don't
   touch `apps/web/src/app/admin/**` — hexaa owns it.

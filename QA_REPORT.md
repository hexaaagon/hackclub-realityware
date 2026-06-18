# Realityware — Participant App QA & Plan-Conformance Report

_Date: 2026-06-17 (updated 2026-06-18, economy-engine pass) · Scope: participant app only (`/`, `/shop`,
`/profile`, `/guides`, `/bounties`, `/leaderboard`, `/market`). Excluded per instruction: `admin/**`,
journaling/`/explores`, landing (`app/home`), auth internals._

## Summary
The participant app is **functionally solid**: every page loads 200, renders, and is **free of console
errors** at desktop (1440px) and mobile (390px); the mobile drawer + single-column stacking work with no
overflow. The economy is now **complete on my side**: Shop + Market money flows are zero-sum and
can-never-go-negative; **bounty payout, the leaderboard scoring engine (hours + tiers), and cities are
built, idempotent, and tested** — what remain are documented cross-team **SEAMS** (§8) hexaa wires (tier
assignment, Hackatime `time_log` ingestion).

### Testing method & boundary
Every `/api/*` route is auth-gated (`authMiddleware`). Under `DEV_AUTH_BYPASS` the proxy renders pages
but the API returns `{success:false,"not-logged-in"}`, so **authenticated success-path flows can't be
driven through the UI without a real HCA login** (not automatable here). Therefore:
- **Client UI** (tabs, region selector, search, drawer, sheets, validation, states, mobile) tested live
  under the bypass; populated visuals via **transient browser fetch-mocks** (never committed).
- **Money-flow correctness** verified at the **DB layer** by replaying the exact route SQL against the
  real tables inside **rolled-back transactions** (nothing persisted).
- **Route wiring** verified by probing all endpoints (proper JSON, not 404/500).

---

## 1. Functional checklist (Playwright)

| Page | Loads 200 | 0 console errors | Mobile 390 no-overflow | Interactions |
|------|:--:|:--:|:--:|---|
| `/` (home) | ✅ | ✅ | ✅ | hero/cards/tutorial render; nav |
| `/shop` | ✅ | ✅ | ✅ | category SlidingPill, region selector + CountUp, buy affordance/disabled, states |
| `/profile` | ✅ | ✅ | ✅ | shards ShardBurst, copy-handle, achievements, **Transactions ledger** (direction +/−) |
| `/guides` | ✅ | ✅ | ✅ | category tabs (scroll), live search, reading Sheet |
| `/bounties` | ✅ | ✅ | ✅ | featured/archive, submit Sheet, draggable sticker |
| `/leaderboard` | ✅ | ✅ | ✅ | ranked rows, score bars, "you" highlight, particles |
| `/market` | ✅ | ✅ | ✅ | Browse/My-Shop SlidingPill, Gift Sheet, listing Sheet, buy affordance |

Global: SlidingPill nav + mobile drawer (open/close, active pill) ✅ · logout present ✅ ·
loading/empty/error states present on every data page ✅ · `prefers-reduced-motion` honored (motion
primitives short-circuit + `globals.css` reduce fallback) ✅.

> Note: success-path buy/gift/submit POSTs return `not-logged-in` under the bypass and surface an error
> toast (handled gracefully). Their correctness is proven at the DB layer (§4).

## 2. Design conformance
- **`/shop` vs Shop.pdf** ✅ — banner, `categories:` toggle, region selector, grant credit-cards + item
  cards, shard prices. (`est. N hours` derived `round(cost/10)` — placeholder, no hours column.)
- **`/bounties` vs Bounties.pdf** ✅ — "this week's bounty" + prompt + archive list (adapted: image left,
  content right, archive below).
- **Sidebar vs SideBar.pdf** ✅ — logo → WEEK X/12 → "Welcome back" + star → boxed nav → profile card.
  _Divergence:_ nav extended with **leaderboard + market** (mockup shows 5; those pages now exist).
  Mockup's guides fly-out sub-nav is implemented as a full `/guides` page instead.
- Design system honored app-wide: sharp corners / `rounded-xs`, 2px `border-black/20`, `.noise`,
  `font-sacco` uppercase headings, brand colors, Phosphor icons, shards currency (coin icon visual only).

## 3. Plan mechanics (vs Realityware Plan V2 + spec)

| Mechanic | Status |
|---|---|
| Shards is the currency everywhere (icon visual only) | ✅ PASS |
| Shop: 8 regions (NA/SA/EU/Asia/India/Oceania/Africa/ME) → `cost[8]`, per-region price | ✅ PASS |
| Shop: purchase re-checks price server-side, can't go negative, writes `shop_order` | ✅ PASS |
| Shop: grants vs items filter | ✅ PASS |
| Bounties: one `bounty_submission` per bounty/user, status reflected | ✅ PASS |
| Bounties: 100–500 shard reward on approval | ✅ **PASS (built)** — `reward_shards`; admin `POST /submissions/:id/approve` pays out atomically, idempotent via `awarded_at` |
| Leaderboard: ranking sums `city_score`, derives members/hours/online from `time_log` | ✅ PASS |
| Leaderboard: 5 pts/hr, first-hour excluded | ✅ **PASS (built)** — `runHoursScoring()` + `POST /score-hours`, idempotent via `user_hours_score` (seam: needs `time_log` fed) |
| Leaderboard: tiers S/A=100·B=66·C=33 | ✅ **PASS (built)** — `POST /award-tier`, idempotent per project (`project_city_award`) |
| Leaderboard: cities Ved / Valdia / Laria / Mora | ✅ **PASS (built)** — seeded + city-assignment flow (`POST /me/city`, picker + first-visit gate) |
| Market: gift + buy are zero-sum, never negative, self/own rejected, every move writes `shard_transfer` | ✅ PASS |

## 4. Money-flow verification (DB layer, rolled-back — nothing persisted)
All assertions **PASS**:
- Gift: debits sender, credits recipient by the exact amount, **zero-sum**; writes `shard_transfer(gift)`.
- Buy: debits buyer, credits seller exactly, marks item `sold`, **zero-sum**; writes
  `shard_transfer(market_purchase)` with `user_shop_item_id`.
- **Never-negative guard:** overspend `UPDATE … WHERE shards >= amount` matches **0 rows** (gift, buy).
- **Double-buy guard:** claim `WHERE status='active'` matches 0 rows once sold.
- Rejections (route-level, before the tx): **self-gift** (`recipient.id === sender.id`), **buy-own**
  (`shop.owner === buyer`), **amount ≤ 0** / **price ≤ 0** (zod `.positive()`), unknown/ambiguous
  recipient — all present in `apps/backend/src/market/index.ts`.
- Leaderboard mechanics check: city totals sum + rank correctly (100+66 > 33); "coding today" counts a
  user with a `time_log` today; hours derive from seconds (7200s → 2h).

## 5. Data integrity — API route inventory (all real DB, auth-gated, RLS tables)
**Mine (participant):**
- `GET /api/shop/items`, `POST /api/shop/purchase`
- `GET /api/bounties`, `POST /api/bounties/submissions`
- `POST /api/bounties/submissions/:id/approve`, `POST /api/bounties/submissions/:id/reject` (admin)
- `GET /api/leaderboard`, `GET /api/leaderboard/cities`
- `POST /api/leaderboard/score-hours` (admin), `POST /api/leaderboard/award-tier` (admin)
- `GET /api/me/profile`, `GET /api/me/transactions`, `POST /api/me/city`
- `GET /api/market/shops`, `GET /api/market/shops/:id`, `GET /api/market/my-shop`,
  `POST /api/market/shop`, `POST /api/market/items`, `PATCH/DELETE /api/market/items/:id`,
  `POST /api/market/items/:id/buy`, `POST /api/market/gift`

**Pre-existing (used by participant app):** `GET /api/user`, `GET/POST/PATCH/DELETE /api/user/projects(/:id)`,
`POST /api/user/projects/:id/ship`, `GET /api/projects/featured`, `GET/POST /api/auth/*`, `GET /api/rsvp`.

No stub/fake handlers; no leftover data mocks in production code (only shape-correct lorem placeholders:
`GUIDES`, `PLACEHOLDER_PROJECTS`, `PLACEHOLDER_FEATURED`, and `PROGRAM_WEEK = 3`).

## 6. Build health
- `biome check` — **clean** across all my files.
- `tsc --noEmit` (whole web app) — **1 error total**, and it is **hexaa's pre-existing**
  `app/admin/(_nav)/nav-body.tsx:31` (typedRoutes; untouched by me, present since baseline). Left alone
  per instruction; this is the Next dev-overlay "1 Issue".
- `bun run build` — as-configured it fails type-checking only on that admin file. With type-errors
  temporarily bypassed (then reverted; `next.config.ts` unchanged), the **full production build compiled
  and statically generated all 23 routes**, including every participant route + `/market`.
- `prefers-reduced-motion` respected app-wide.

## 7. Bugs fixed this pass (small + safe)
- `_data.ts` "people coding today" was hardcoded `0`; now derives from `time_log` (distinct users since
  00:00 UTC) — same source as `/api/leaderboard`. (Reads 0 until time-tracking ingestion exists.)

## 8. SEAMS — what hexaa must call/feed for the economy to go fully live
My side of each is **built, idempotent, and tested**; it activates the moment hexaa wires the trigger:
1. **Project tier → city points.** On tier assignment, hexaa's review calls
   `POST /api/leaderboard/award-tier {projectId, tier:S|A|B|C}` (admin). Credits the owner's city
   (S/A=100, B=66, C=33), idempotent per project. Requires the project owner to have a city (§4).
2. **Coding hours → city points.** Hexaa's **Hackatime/Lapse ingestion writes `time_log` rows**
   (`{user_id, seconds, source, logged_at}`), then calls/crons `POST /api/leaderboard/score-hours`
   (admin). Scores 5 pts/hr excluding each user's first hour; idempotent. Until fed, it correctly
   computes **zero** (and "people coding today" stays 0).
3. **Bounty approval (optional trigger).** Hexaa's panel may call
   `POST /api/bounties/submissions/:id/approve | /reject` (admin) to pay out / decline — atomic,
   idempotent (no double-pay). (Distinct from his project-review/fraud pipeline, which is untouched.)
4. **City selection** — now built: participants are gated to pick a city on first visit (and can change
   on `/profile`); tier/hours points only land for users who have one.
5. **(Optional) `time_log.project_id`.** The spec's "first hour of the **first project**" is implemented
   as each user's first lifetime hour, because `time_log` has no project link. If true per-project
   granularity is wanted, add `time_log.project_id` and the engine can switch to per-project exclusion.

## 8b. Remaining notes (your call, non-blocking)
- **Sidebar nav** has 7 items (added leaderboard + market) vs SideBar.pdf's 5; guides is a page, not the
  mockup's fly-out. Confirm acceptable.
- **Auth-gated testing.** A dev login / seeded session would let authenticated success-paths be exercised
  through the UI/E2E, not only at the DB layer.
- **Bounty reward range (100–500)** is enforced wherever bounties are created (admin/hexaa); the column
  defaults to 100 with no DB CHECK.

## 9. Test rows added / removed
**None persisted.** Both QA passes verified inside **rolled-back transactions** (create test user +
bounty/submission/time_log/project/city_score → assert → `ROLLBACK`). The economy pass ran **18 assertions,
all PASS** (city-assign; bounty approve credits exactly + re-approve no double-pay + reject; hours engine
3h→10pts first-hour-excluded + idempotent + `scored_at`; tier S/A/B/C → 100/100/66/33 + re-call no
double-award). Post-run integrity confirmed: `user_account` id=2 still **5000** shards and **city-less**;
`shard_award`, `user_hours_score`, `project_city_award` empty; no test users/bounties left.
_Persistent (intended, NOT test data):_ the 4 canonical cities (Ved/Valdia/Laria/Mora) each with a 0-score
row. _Pre-existing from an earlier pass, left in place:_ 3 `[TEST]` `shop_item` rows + 5000 shards on id=2.

## 10. Tables/columns applied (additive, dev DB, FYI for hexaa)
- Market pass (`manual_migrations/market.sql`): `user_shop` (UNIQUE owner), `user_shop_item`,
  `shard_transfer`.
- Economy pass (`manual_migrations/economy.sql`): columns `bounty.reward_shards`,
  `bounty_submission.awarded_at`, `time_log.scored_at`, `UNIQUE(city.name)`; tables `project_city_award`
  (UNIQUE project_id), `user_hours_score`, `shard_award`; seed of the 4 canonical cities + 0-score rows.
All RLS-enabled, FKs intact, idempotent; Drizzle defs in `src/schema/{market,economy,bounty,city}.ts`.
Verified each run added only its own objects; nothing else changed.

# Realityware — Motion & Playful Theme System

Realityware is a teen hacker / street-zine brand. **Motion is a core feature, not garnish.** Almost
everything should animate in, react to hover/press, and have personality — springy, bouncy, a little
graffiti-chaotic — while staying fast and accessible. Read this before adding any animation.

## Libraries (sanctioned set — do not add others)
- **motion** (`import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "motion/react"`)
  — orchestrated reveals + stagger, spring hover/press, shared-element/layout transitions, scroll-linked
  parallax, drag. Add with `bun add motion` in apps/web (React 19-ready). This is the primary tool.
- **tw-animate-css** (installed) — quick utility animations for simple enter/exit and one-offs.
- **OGL** (installed) — WebGL particle/graffiti backgrounds via `components/ui/particles-bg.tsx`. Ambient
  only: behind content, low opacity, lazy-mounted. Keep the existing `components/ui/fade-content.tsx`.
- **CSS keyframes** in `globals.css` — global playful utilities (marquee, wiggle, float, shimmer, pulse).
- **app/template.tsx** — route-level page transitions (already exists; wire motion here).

## Motion tokens (define once, reuse everywhere)
Create `apps/web/src/components/motion/tokens.ts`:
- durations: `fast 0.15s`, `base 0.25s`, `slow 0.45s`
- springs: `bouncy { type:"spring", stiffness:420, damping:18 }`, `gentle { stiffness:260, damping:26 }`,
  `stiff { stiffness:600, damping:30 }`
- ease (non-spring tweens): `[0.22, 1, 0.36, 1]`
Mirror the durations as CSS vars in `globals.css` for the CSS-only utilities.

## Shared primitives (build in `apps/web/src/components/motion/`; pages compose these)
- `<Reveal>` — fade + slide-up (~16px) + slight scale (0.98→1) on scroll into view (`whileInView`, once).
- `<Stagger>` / `<StaggerItem>` — staggered children (0.05–0.08s); for grids, lists, sections.
- `<Tilt>` / hover-lift card wrapper — hover: y:-4 + subtle rotate/scale + shadow; press: scale 0.97 (spring).
- `<CountUp>` — animate numbers (shards balance, "N people coding today", city scores) when the value changes.
- `<ShardBurst>` — celebratory burst of shard/sticker particles; fire on reward events (purchase success,
  project approved, bounty submitted). Confetti-style, short, fun.
- `<Marquee>` — infinite ticker (e.g., "26 GREEN • MADE BY TEENAGERS • …"); pauses on hover.
- `<ParallaxLayer>` — scroll/mouse-linked transform via `useScroll`/`useTransform`; for the dashboard hero.
- `<SlidingPill>` — animated active indicator (motion `layoutId`) for tabs/toggles and sidebar nav.

## Where motion shows up (apply liberally)
- **Sidebar:** items reveal on mount; active item = a `layoutId` pill that slides between routes; hover wiggle.
- **Cards** (featured/projects/shop/bounty/journal): Reveal + Stagger on load; hover-lift/tilt; press squish.
- **Buttons:** press squish (spring), hover fill/color slide; the orange CTA gets a subtle idle pulse.
- **Shards & stats:** CountUp on change; ShardBurst on earn/spend.
- **Tabs/toggles** (journals↔gallery, shop all/grants/items, region selector): SlidingPill + content
  crossfade/slide via AnimatePresence.
- **Hero ("TWL8TE / World Tour"):** ParallaxLayers on scroll + mouse; graffiti elements drift/float idle.
- **Stickers/graffiti accents:** draggable with spring snap-back; gentle idle float/rotate.
- **Tutorial steps:** progress fills with spring; checkmark pops; step cards stagger.
- **Lists/feeds:** AnimatePresence for add/remove (star toggle, new journal).
- **Loading:** shimmer skeletons + playful loading copy. **Empty states:** a small animated graffiti doodle.
- **Page transitions:** template.tsx fades/slides route content; back/forward safe.
- **Toasts:** sonner (installed) with playful copy.

## Performance
- Animate **transform & opacity** only; avoid animating layout props except via motion `layout`.
- Lazy-mount WebGL/particles (dynamic import, `ssr:false`); at most one ambient WebGL surface on screen.
- `whileInView` with `viewport={{ once: true }}` so reveals don't re-run; throttle scroll/mouse handlers.
- React Compiler is on — don't hand-memoize unless profiling says so.

## Accessibility (required)
- Honor **prefers-reduced-motion**: use motion's `useReducedMotion()` to drop/short-circuit non-essential
  motion (no parallax, no bursts, instant reveals), AND add a CSS fallback in globals.css:
  `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; } }`
- Never hide essential info behind motion; keep durations snappy. Motion must not break keyboard nav,
  focus states, or scrolling.

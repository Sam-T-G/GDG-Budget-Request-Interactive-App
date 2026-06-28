# CLAUDE.md

Project context for Claude Code sessions. Auto-loaded every session in this repo. Keep this lean — push detail into `docs/`.

## What this project is

An interactive, mobile-native, **self-paced** webpage that supports a 15-minute ASRCC budget hearing for **GDG on Campus at Riverside City College** (FY 2026/27, $12,000 ask).

- Sam Gerungan presents verbally; attendees view the page on their own phones (no live sync).
- Hearing window: **May 11–13, 2026**, 9 AM–4 PM.
- Format is Q&A — the page must be **explorable on demand**, not a linear deck.
- Deployed to **GitHub Pages** at `https://sam-t-g.github.io/GDG-Budget-Request-Interactive-App/`.

## Stack

- **Vite + React 18 + TypeScript** (strict)
- **Tailwind CSS** with extended `gdg.*` color palette (Google brand colors + neutrals)
- **GSAP + ScrollTrigger** (via `@gsap/react`'s `useGSAP` hook) — single animation library for the project. Use for scroll choreography, expand/collapse, SVG draws, kinetic typography, marquee. Always check `prefers-reduced-motion` (`window.matchMedia("(prefers-reduced-motion: reduce)").matches`) and short-circuit durations to ~0.01.
- **qrcode.react**, **canvas-confetti** for engagement micro-interactions
- **GitHub Actions → GitHub Pages** (`.github/workflows/deploy.yml`)

**Don't reintroduce Framer Motion** — it was removed in the GSAP consolidation refactor (see `docs/decisions.md`). Two animation runtimes was duplication; the design language now leans into GSAP-native patterns (`SplitTitle`, `ChapterMarker`, `Marquee`, pinned scroll).

## Conventions

- **Hearing content lives in [`src/data/budget.ts`](src/data/budget.ts).** Dollar amounts, line items, club facts, Q&A. Edit there; never hardcode in components.
- **GDG program facts live in [`src/data/gdg.ts`](src/data/gdg.ts).** The official program description, global stats, and pillars are sourced from `developers.google.com/community/gdg` — quotes are direct. If Google updates the official copy, mirror it here.
- **Brand assets live in [`public/brand/`](public/brand/README.md)** with a graceful `<BrandImage>` fallback. Don't commit Google's trademarked logos; use the chapter's own approved Bevy assets. See the README in that folder.
- **Single scrolling page.** Sections in `src/components/`, orchestrated by `src/App.tsx`. Don't introduce a router unless the user explicitly asks.
- **Mobile-first.** Design for thumb-reach on a 375–430px wide viewport. Use `max-w-xl` (576px) as the comfortable upper bound for content blocks.
- **Animations must respect `prefers-reduced-motion`.** Use Framer's `useReducedMotion` (already wired into `SectionShell` and `Hero`). Never gate critical content behind motion.
- **Tailwind only** for styling; avoid raw CSS modules, styled-components, etc. Brand colors come from the `gdg.*` palette in `tailwind.config.ts`.
- **Path constraint:** `vite.config.ts` sets `base: "/GDG-Budget-Request-Interactive-App/"`. If the repo is renamed, update both `base` and the README link.

## Non-goals (don't add unless explicitly asked)

- No backend, database, auth, analytics, or telemetry.
- No live presenter-driven sync (the user explicitly chose self-paced).
- No router / multi-page routes.
- No i18n. English only.
- No dark mode (yet — the user has flagged it as a possible iteration target, not committed).
- No PDF export, no slide-deck export, no print stylesheet.
- No comment blocks or planning docs in code (per user style — see `docs/decisions.md`).

## Verification

- `npm run typecheck` — TS only, no emit
- `npm run build` — full production build (TS + Vite). Run before declaring a UI change done.
- `npm run dev` — local dev server at `http://localhost:5173/GDG-Budget-Request-Interactive-App/`
- For UI changes, **open the dev URL on a phone (or use Chrome's mobile emulation)** and test golden-path scroll + tap interactions before reporting done.

## Where to look

- [`docs/scope.md`](docs/scope.md) — full scope, content sources, non-goals rationale
- [`docs/decisions.md`](docs/decisions.md) — running decision log (ADR-lite)
- [`src/data/budget.ts`](src/data/budget.ts) — all hearing content
- [`ASRCC-Funding-Request 26_27 GDG.pdf`](ASRCC-Funding-Request%2026_27%20GDG.pdf) — original budget submission (source of truth for numbers)

## Working with AI here

- The numbers are load-bearing. This page argues for $12,000 of real money in a live hearing, and every figure must trace to `src/data/budget.ts`, `src/data/gdg.ts`, or the original ASRCC PDF. An agent will happily produce a confident dollar amount, line item, or GDG stat that is wrong. Never let a generated figure ship without checking it against source.
- The 20% that matters is correctness and feel, not scaffolding. `prefers-reduced-motion` short-circuits, thumb-reach on a 375px viewport, and golden-path scroll and tap behavior are not caught by `npm run build`. The phone walk-through is the verification step, not a formality: do it before reporting a UI change done.

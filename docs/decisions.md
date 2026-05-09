# Decision log

ADR-lite. Append entries as we make non-obvious choices. Newest at the top. Each entry: what we chose, what we rejected, and why.

Format:

```
## YYYY-MM-DD — short title

**Decision:** what we chose.
**Alternatives considered:** what we rejected.
**Why:** the reasoning. Cite constraints, user preferences, or trade-offs.
**Revisit if:** the condition that would invalidate this choice.
```

---

## 2026-05-09 — Consolidate to GSAP-only; remove Framer Motion

**Decision:** Remove `framer-motion` entirely. Rewrite every animated component to use GSAP via `@gsap/react`'s `useGSAP` hook. Adopt a gsap.com-inspired design language: kinetic dispersed-letter hero, `SplitTitle` letter-stagger reveals, numbered chapter markers (`01 / WHAT IS GDG?`), marquee text dividers between sections, and one pinned-scroll moment in `WhatIsGDG.tsx` (only on viewports ≥ 480×640 to avoid iOS Safari pin jank).
**Alternatives considered:** (a) keep both libraries (the previous decision); (b) remove GSAP and stay on Framer Motion; (c) add a third library (Lenis for smooth scroll, Lottie for illustrations).
**Why:** The user requested GSAP-only after seeing the design language we wanted to pull from gsap.com — that aesthetic (cinematic timelines, SVG drawing, kinetic typography, scroll choreography) maps natively to GSAP. Two animation runtimes was duplication: same RAF loop, two paradigms, and the codebase forced future contributors to learn both. Consolidating gives a single mental model and a smaller bundle.
**Cost / payoff:** Bundle dropped from ~155 KB → ~116 KB gzipped (-39 KB). Refactor touched ~10 components. Trade-off: lost Framer's declarative `<motion.div>` ergonomics — accordion expand/collapse and entrance reveals now require imperative `useGSAP` blocks. Mechanical, not painful.
**Pinning rule:** ScrollTrigger pinning ships **only behind a viewport feature check**. iOS Safari momentum scroll + address-bar resize can desync pinned content. Current pin in `WhatIsGDG.tsx` checks `(min-width: 480px) and (min-height: 640px)` and skips on `prefers-reduced-motion`. Test on real devices before adding more.
**Revisit if:** A genuine need appears for declarative React-state-driven animations that GSAP handles awkwardly (e.g., shared layout transitions across route changes — but we don't have routes). At that point reach for `motion-one` (smaller than Framer Motion) before adding back the full Framer dependency.

## 2026-05-09 — (superseded) Add GSAP alongside Framer Motion (not as a replacement)

**Decision:** Install `gsap` + `@gsap/react` and use it for scroll-driven, sequenced choreography (currently only `WhatIsGDG.tsx`). Keep Framer Motion as the default for component-level interactions (tap, expand, hover, spring).
**Alternatives considered:** (a) replace Framer Motion entirely with GSAP; (b) stay on Framer Motion only and use its `useScroll` for everything; (c) add Lottie or Three.js / R3F.
**Why:** GSAP's `ScrollTrigger` + timeline model is genuinely better than Framer Motion for orchestrating multi-element sequences keyed off scroll position (dot-grid stagger, counter tween, line-draw, card cascade — all in one timeline). Framer Motion stays superior for declarative React-component-level motion (the line-item card's expand spring, the sticky-total scroll-faded pill). Two libraries is a price worth paying for the right tool per use case. Lottie needs an animator and adds a runtime; Three.js is overkill for a budget hearing.
**Why not pin scroll on mobile:** GSAP's pinning can feel janky on iOS Safari with momentum scroll. The current implementation uses `ScrollTrigger.create({ once: true })` to fire a timeline on entry, no pinning. Revisit if we want a "stage" effect later — test on real devices first.
**Cost:** Bundle grew from ~105 KB → ~155 KB gzipped. Acceptable for the engagement gain on a presentation page that loads once.
**Revisit if:** GSAP usage stays confined to a single component long-term — at that point, consider whether the bundle cost is justified by one section.

## 2026-05-09 — Don't bundle Google's trademarked logos; use chapter-approved assets

**Decision:** No raw Google or GDG logos checked into git. Brand image slots live under `public/brand/` and are referenced via `<BrandImage>`, which gracefully falls back to a custom-rendered alternative if the file is missing. Sam (as chapter organizer) drops his chapter's official Bevy banner / avatar / lockup into `public/brand/` locally.
**Alternatives considered:** (a) hot-link from Google's CDN; (b) commit the official GDG wordmark as PNG; (c) recreate the official wordmark in SVG.
**Why:** The "Google Developer Groups" wordmark and the rainbow Google "G" are Google trademarks governed by their brand resource center. Hot-linking is fragile and rude; committing trademarked images to a public repo without permission is a brand-guidelines violation. As a chapter organizer, Sam already has *his chapter's* approved lockup/banner — those are the right assets to use here. The fallback ensures the page is polished even before assets are dropped in.
**Revisit if:** Google publishes an explicit brand asset pack with a redistributable license, or if Sam wants to render assets server-side from his Bevy chapter URL.

## 2026-05-09 — Separate GDG program facts from hearing content (`gdg.ts` vs `budget.ts`)

**Decision:** Two data modules. `src/data/budget.ts` holds hearing-specific content (line items, dollar amounts, Q&A). `src/data/gdg.ts` holds canonical GDG program facts sourced from `developers.google.com/community/gdg`.
**Alternatives considered:** Single `content.ts` for everything.
**Why:** Different update cadences and different sources of truth. Budget content changes per fiscal year and is owned by Sam. GDG program facts come from Google and should mirror their canonical copy verbatim where quoted. Splitting makes provenance obvious and prevents accidental drift.
**Revisit if:** A future component needs to compose facts across both — at that point, consider a typed barrel `src/data/index.ts`.

## 2026-05-09 — Project scaffolding documentation structure

**Decision:** Split project memory across three layers — `CLAUDE.md` (auto-loaded, lean), `docs/scope.md` (in-repo, detailed scope + non-goals), `docs/decisions.md` (this file, running log).
**Alternatives considered:** (a) single bloated `CLAUDE.md`; (b) only the private memory at `~/.claude/projects/.../memory/`.
**Why:** `CLAUDE.md` loads every session, so it must stay tight. Scope and non-goals deserve detail and rationale, but don't need to be in context every turn — `docs/scope.md` is read on demand. Private memory at `~/.claude` covers user-specific facts (contact info) that shouldn't be checked into git.
**Revisit if:** the project grows past ~5 contributors or `CLAUDE.md` itself starts exceeding ~150 lines.

## 2026-05-09 — Self-paced viewer over presenter-driven sync

**Decision:** Each attendee's page is independent — they tap, scroll, and expand at their own pace.
**Alternatives considered:** Live-sync where Sam's phone drives every attendee's view (WebSockets / Firebase / Pusher).
**Why:** The hearing is Q&A, not a linear deck. Committee members will jump to whatever the current question is about — forcing them onto Sam's pace would *reduce* utility. Self-paced also eliminates a backend, lets us deploy to GitHub Pages, and removes a category of failure modes (network drops, sync lag) on hearing day.
**Revisit if:** Sam ever runs a *non-Q&A* presentation where he wants to hold everyone's attention on the same slide.

## 2026-05-09 — Static GitHub Pages deploy, no backend

**Decision:** Pure static SPA, deployed via GitHub Actions to GitHub Pages.
**Alternatives considered:** Vercel (more polished DX), Netlify, self-hosted.
**Why:** User chose GitHub Pages explicitly. Free, version-controlled, zero ops. The app has no server-side needs — everything is presentation.
**Revisit if:** We need preview deploys per PR, server-side rendering, or any feature that requires runtime backend.

## 2026-05-09 — Single scrolling page, no router

**Decision:** All six sections are anchors on one scrollable page.
**Alternatives considered:** React Router with `/`, `/ask`, `/impact`, etc.
**Why:** "One tap away" is the ergonomic win for Q&A. Routing fragments the UX, breaks the scroll spy / progress dots, and adds bundle weight for no real benefit. Anchor links + `scrollIntoView` cover all the navigation needs.
**Revisit if:** We add fundamentally separate sub-experiences (e.g. an internal admin view, or a public roster page).

## 2026-05-09 — Tailwind + Framer Motion, no design system library

**Decision:** Tailwind CSS for styling, Framer Motion for animation. No component library (no shadcn, no Radix, no MUI).
**Alternatives considered:** shadcn/ui (would give us pre-built accordion/dialog), MUI, plain CSS.
**Why:** The component count is small (~10) and bespoke. A library adds a brand — we want the GDG brand front and center, not a library's defaults. Framer Motion handles the engagement layer (springs, scroll triggers, gestures) idiomatically without manual animation code.
**Revisit if:** We start needing dialogs, dropdowns, or other accessible primitives that are tricky to build correctly from scratch.

## 2026-05-09 — All hearing content centralized in `src/data/budget.ts`

**Decision:** Line items, dollar amounts, club facts, mission pitch, and Q&A all live in one TypeScript module.
**Alternatives considered:** JSON files, MDX, content per-component.
**Why:** Sam will iterate on copy more than layout. One file = one place to edit. TypeScript types catch mismatches between data and components at build time. JSON would lose type narrowing; MDX is overkill for ~6 sections of structured content.
**Revisit if:** Content grows past ~500 lines or non-developers need to edit copy.

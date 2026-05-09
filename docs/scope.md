# Scope

Single source of truth for what this project **is** and **isn't**. Reference from `CLAUDE.md` so it doesn't bloat the always-loaded context.

## Purpose

Support a 15-minute Q&A budget hearing with the ASRCC Budget Committee at Riverside City College. The page is a **shared visual reference** — Sam presents verbally, attendees follow along on their own phones. The committee can drill into any line item, expense, or talking point at any moment.

## Audience

- **Primary:** ASRCC Budget Committee members during the hearing (May 11–13, 2026).
- **Secondary:** Anyone Sam shares the link with afterward (advisors, follow-up questions, future hearings).

## Hearing context

- **Format:** Q&A only. Committee asks about past funding, current request, and student involvement. Entities are cut off at the 15-minute mark.
- **Stakes:** First-year ask, $0 prior funding. Quality of presentation directly affects allocation.
- **Constraint:** No Zoom — in-person only. The page must work on whatever phones attendees have.

## In scope

- Mobile-first interactive presentation page (React/Vite, Tailwind, GSAP — see `docs/decisions.md` for the GSAP-only consolidation).
- All content sourced from the original ASRCC funding request PDF; copy lives in `src/data/budget.ts`.
- Seven sections: Hero, **What is GDG?** (program context with GSAP-driven choreography), Mission (our chapter), The Ask (with line-item drill-downs), Impact, Why ASRCC, Q&A.
- GDG branding using the four Google colors as accents on a clean white/dark-text base.
- Engagement layer: scroll reveals, spring expands, animated counters, confetti, haptic feedback, QR share.
- GitHub Actions deploy to GitHub Pages.

## Out of scope

The "why" matters here — these are intentional, not just unscoped:

- **Backend / database / auth.** Static site keeps deploy trivial and cost zero. No data is collected from attendees.
- **Live presenter-driven sync.** User explicitly chose self-paced — committee members read at their own pace while Sam answers questions.
- **Router / multi-page.** Single scroll preserves "everything one tap away" — the core ergonomic win for a Q&A format.
- **Analytics / telemetry.** Privacy-respecting by default. Attendance is already tracked via Bevy for events; this page is just a presentation aid.
- **i18n.** Hearing is in English. Adding i18n now is premature.
- **Dark mode.** Hearing room lighting is unknown; the user flagged this as a possible iteration but hasn't committed. Default to light.
- **PDF / slide export.** The original PDF is the canonical document; this app is a complement, not a replacement.

## Content sources

| Item | Source |
|---|---|
| Line items, dollar amounts, expense breakdowns | `ASRCC-Funding-Request 26_27 GDG.pdf` (committed to repo) |
| Mission pitch, Q&A answers | `src/data/budget.ts` (drafted from PDF + conversation with user) |
| Club facts (members, location, attendance %) | `src/data/budget.ts` `CLUB_FACTS` constant |
| GDG program description, global stats, pillars | `src/data/gdg.ts` — quotes mirrored from `developers.google.com/community/gdg` |
| Chapter brand assets (banner, avatar, lockup) | `public/brand/` — pulled by Sam from his GDG Organizer / Bevy dashboard. See `public/brand/README.md`. |

If a number on the page conflicts with the PDF, the **PDF wins** — update `budget.ts` to match.

## Success criteria

1. Sam can demo the page from his own phone in under 90 seconds before the hearing starts.
2. A committee member can tap any line item and see its full expense breakdown without scrolling away from the section.
3. The page loads and is interactive within 2 seconds on a mid-tier phone over campus Wi-Fi.
4. The total ask, expense breakdowns, and stats on the page match the PDF exactly.

## Iteration parking lot

Things the user has mentioned or that came up but were intentionally deferred. Pick from here when the user asks "what's next?":

- Roster snippet / member spotlights
- "Past efforts" section (committee will likely ask about prior events)
- Dark-mode variant for hearing room
- Tighten copy on individual line items
- Embed a small "what's Bevy" tooltip — committee may not know the platform

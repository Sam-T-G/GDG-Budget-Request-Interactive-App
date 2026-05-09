# GDG Budget Request Interactive App

Interactive mobile-native page for the **GDG on Campus at Riverside City College** ASRCC budget hearing (FY 2026/27, $12,000 ask).

Built as a single scrollable, self-paced viewer for attendees to follow along on their own phones during a 15-minute Q&A hearing.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (Google brand color palette)
- Framer Motion (animations, scroll reveals, spring interactions)
- `qrcode.react` (in-page QR for sharing the link)
- `canvas-confetti` (final-section payoff)
- Deploy: GitHub Actions → GitHub Pages

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL in a phone browser (or use Chrome/Safari device emulation) for the intended experience.

## Build

```bash
npm run build      # outputs dist/
npm run preview    # serves the production build locally
```

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

**One-time setup in the repo:**
1. Settings → Pages → Source: **GitHub Actions**

Once deployed, the live URL is:
`https://sam-t-g.github.io/GDG-Budget-Request-Interactive-App/`

If the repo name changes, update `base` in `vite.config.ts` to match.

## Editing content

All copy, line items, and Q&A live in [`src/data/budget.ts`](src/data/budget.ts) — update there and the page updates everywhere.

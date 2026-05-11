# Brand assets

This folder is where your **chapter-approved** GDG brand assets live. These are referenced by `<img>` tags in the app — drop the files here with the exact names below and they appear automatically.

## Why not bundle Google's logos directly?

The "Google Developer Groups" wordmark and the rainbow Google "G" are Google trademarks. Use of these marks is governed by the [Google brand permissions policy](https://about.google/brand-resource-center/) and the GDG community guidelines. As a chapter organizer, **your chapter has its own approved lockup, banner, and avatar** — those are the assets to use here.

## Where to download your chapter's assets

1. Sign in to your chapter's organizer dashboard at **[gdg.community.dev](https://gdg.community.dev/)**.
2. Open your chapter page (`gdg.community.dev/gdg-on-campus-riverside-city-college-...`).
3. The chapter banner, square avatar, and "GDG on Campus · Riverside City College" lockup are available from your chapter settings or directly via right-click → save image from the public chapter page.
4. For the broader GDG mark/wordmark on Google's developer site, check Google's brand resources at [about.google/brand-resource-center](https://about.google/brand-resource-center/).

## Expected files

Drop these into `public/brand/` with these exact names:

### Chapter assets

| Filename | Purpose | Recommended size |
|---|---|---|
| `chapter-banner.png` | Wide banner shown in the "What is GDG?" RCC chapter card | 1200 × 400 |
| `chapter-avatar.png` | Square avatar shown in Hero | 256 × 256 |
| `gdg-on-campus-lockup.svg` _or_ `.png` | "GDG on Campus" lockup, used in Hero subtitle area | width 600+ |

### Track Record logos (`Accomplishments` section)

These are referenced by the Track Record section (transfer outcomes, hackathon win, industry pipeline). Same trademark caveat as the Google marks above — these are third-party trademarks, so check each org's brand guidelines before redistribution. Drop them in locally for the hearing; the app renders an elegant typographic fallback if a file is missing, so the section still looks polished.

| Filename | Used for | Recommended size |
|---|---|---|
| `uc-berkeley.png` | UC Berkeley CS transfer block | 600 × 360, transparent bg |
| `ucla.png` | "Teams beaten" tile | 600 × 360, transparent bg |
| `uc-irvine.png` | "Teams beaten" tile | 600 × 360, transparent bg |
| `uc-riverside.png` | "Teams beaten" tile | 600 × 360, transparent bg |
| `tiktok.png` | Industry pipeline tile | 600 × 360, transparent bg |
| `google.png` | Industry pipeline tile | 600 × 360, transparent bg |
| `amazon.png` | Industry pipeline tile | 600 × 360, transparent bg |

The app gracefully falls back to typography-rendered tiles if any of these files are missing — so it'll still look polished if you ship without them.

### Google I/O 2026 photos (`public/brand/io/`)

Used by the `GoogleIO` section that closes the chapter highlights block. The component references these via `${BASE}brand/io/<file>`; each `<BrandImage>` has a Google-color gradient fallback, so missing files degrade gracefully.

| Filename | Subject |
|---|---|
| `googleplex-campus.jpg` | Googleplex campus exterior |
| `googleplex-androids.jpg` | Android lawn statues |
| `googleplex-pond.jpg` | Googleplex pond / grounds |
| `shoreline-exterior.jpg` | Shoreline Amphitheatre exterior |
| `shoreline-io.jpg` | Shoreline during a prior Google I/O |
| `io-keynote.jpg` | Google I/O keynote crowd |

These ship pre-compressed (`sips -Z 1200 ... --setProperty formatOptions 70`) from Wikimedia Commons contributors under CC BY-SA. The in-UI photo strip surfaces a `Photos courtesy of Wikimedia Commons contributors, CC BY-SA.` credit. If you swap in newer or chapter-captured photos, keep file widths ≤ 1200px and update `GOOGLE_IO.photos[].credit` in `src/data/budget.ts` to match the new attribution.

## Reference URLs

- GDG community platform: <https://gdg.community.dev/>
- Official GDG program description: <https://developers.google.com/community/gdg>
- DevFest (the global event GDGs run): <https://developers.google.com/community/devfest>

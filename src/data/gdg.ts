/**
 * GDG program facts. Sourced from:
 *   https://developers.google.com/community/gdg
 *   https://gdg.community.dev/
 *
 * Distinct from src/data/budget.ts (hearing-specific content).
 * If Google updates official copy, mirror it here.
 */

export const GDG_FACTS = {
  // Plain-language summary — what GDG actually does, in one sentence.
  plainSummary:
    "GDG is a career-development club, backed by Google. Students learn real industry tools, earn certifications, and connect with engineers who hire.",
  // One-line purpose for the hero / pull-quote use.
  purposeLine: "Career development for students — backed by Google.",
  // Direct quote from developers.google.com/community/gdg (kept for attribution).
  officialDescription:
    "Google Developer Groups (GDGs) bring together developers and technologists to connect, learn, and grow alongside Google's technologies and experts.",
  // Plain-language chapter purpose (replaces verbose official copy in-app).
  onCampusDescription:
    "GDG on Campus chapters give college students hands-on training in the tools tech companies actually use — and a direct line to Google's global network of engineers.",
  globalChapters: 1000,
  globalChaptersDisplay: "1,000+",
  globalCountries: 140,
  parentProgram: "Google for Developers",
  platform: "Bevy (gdg.community.dev)",
};

export const GDG_PILLARS: { title: string; body: string; color: "blue" | "red" | "yellow" | "green" }[] = [
  {
    title: "Connect",
    body: "Meetups and workshops put students face-to-face with Google engineers.",
    color: "blue",
  },
  {
    title: "Learn",
    body: "Hands-on training in the tools tech companies use — taught by certified instructors.",
    color: "red",
  },
  {
    title: "Grow",
    body: "Industry-recognized certifications and portfolios that translate to jobs.",
    color: "yellow",
  },
  {
    title: "Lead",
    body: "Officers gain real event production, public speaking, and team leadership experience.",
    color: "green",
  },
];

export const RCC_CHAPTER = {
  fullName: "GDG on Campus · Riverside City College",
  established: "Active 2025/26 academic year",
  region: "Inland Empire, California",
  link: "https://gdg.community.dev/",
};

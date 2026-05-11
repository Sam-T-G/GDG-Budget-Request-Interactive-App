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

/**
 * Rare-seat framing — RCC sits in a global GDG roster overwhelmingly
 * populated by four-year universities. Other chapter leads Sam works
 * with on calls are at research universities and polytechnics. Community
 * college chapters are the exception.
 */
export type RareSeatPeer = {
  name: string;
  short: string;
  file: string;
};

export const RARE_SEAT = {
  eyebrow: "Rare seat",
  title: "RCC, in a room of universities.",
  bigStat: "1",
  bigStatLabel: "of 1,000+ chapters globally",
  body:
    "Almost every chapter on the global GDG roster is a four-year university — Stanford, Berkeley, Yale, ETH Zurich, the state flagships. Community college chapters are the exception. RCC holds one of those seats.",
  footnote: "The Inland Empire on a map dominated by university towns.",
  /**
   * Confirmed GDG on Campus chapters at notable universities — sourced
   * directly from the gdg.community.dev directory. Used to surround the
   * highlighted RCC tile with the kind of peer institutions Sam shares
   * calls with.
   */
  peers: [
    { name: "Stanford University", short: "Stanford", file: "stanford.svg" },
    { name: "UC Berkeley", short: "Berkeley", file: "uc-berkeley.svg" },
    { name: "UCLA", short: "UCLA", file: "ucla.svg" },
    { name: "Yale University", short: "Yale", file: "yale.svg" },
    { name: "Columbia University", short: "Columbia", file: "columbia.svg" },
    { name: "New York University", short: "NYU", file: "nyu.svg" },
    { name: "ETH Zurich", short: "ETH", file: "eth-zurich.svg" },
    { name: "Carnegie Mellon", short: "CMU", file: "carnegie-mellon.svg" },
    { name: "UC San Diego", short: "UCSD", file: "ucsd.svg" },
    { name: "UC Santa Cruz", short: "UCSC", file: "uc-santa-cruz.svg" },
    { name: "Cal Poly SLO", short: "Cal Poly", file: "cal-poly.svg" },
  ] as RareSeatPeer[],
};

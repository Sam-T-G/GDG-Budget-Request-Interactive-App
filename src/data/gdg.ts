/**
 * GDG program facts. Sourced from:
 *   https://developers.google.com/community/gdg
 *   https://gdg.community.dev/
 *
 * Distinct from src/data/budget.ts (hearing-specific content).
 * If Google updates official copy, mirror it here.
 */

export const GDG_FACTS = {
  // Direct quote from developers.google.com/community/gdg
  officialDescription:
    "Google Developer Groups (GDGs) bring together developers and technologists to connect, learn, and grow alongside Google's technologies and experts.",
  // Direct quote describing GDG on Campus specifically
  onCampusDescription:
    "GDG on Campus chapters provide learning opportunities for aspiring developers from universities and colleges around the world, allowing them to gain hands-on experience, develop essential skills, and build a strong foundation for a tech career.",
  globalChapters: 1000,
  globalChaptersDisplay: "1,000+",
  globalCountries: 140,
  parentProgram: "Google for Developers",
  platform: "Bevy (gdg.community.dev)",
};

export const GDG_PILLARS: { title: string; body: string; color: "blue" | "red" | "yellow" | "green" }[] = [
  {
    title: "Connect",
    body: "Local meetups, workshops, and DevFests link students directly to Google engineers and the global GDG network.",
    color: "blue",
  },
  {
    title: "Learn",
    body: "Hands-on training in Google technologies — Flutter, Firebase, Gemini AI, Cloud, Android — taught by certified instructors.",
    color: "red",
  },
  {
    title: "Grow",
    body: "Members earn industry-recognized certifications and build portfolios that translate directly to employer-ready credentials.",
    color: "yellow",
  },
  {
    title: "Lead",
    body: "Chapter officers gain real organizing, public speaking, and event production experience — leadership skills that transfer.",
    color: "green",
  },
];

export const RCC_CHAPTER = {
  fullName: "GDG on Campus · Riverside City College",
  established: "Active 2025/26 academic year",
  region: "Inland Empire, California",
  link: "https://gdg.community.dev/",
};

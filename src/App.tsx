import { Hero } from "./components/Hero";
import { WhatIsGDG } from "./components/WhatIsGDG";
import { Mission } from "./components/Mission";
import { TheAsk } from "./components/TheAsk";
import { Impact } from "./components/Impact";
import { Accomplishments } from "./components/Accomplishments";
import { WhyASRCC } from "./components/WhyASRCC";
import { QandA } from "./components/QandA";
import { ProgressDots } from "./components/ProgressDots";
import { StickyTotal } from "./components/StickyTotal";
import { Marquee } from "./components/Marquee";

const STATS_MARQUEE = [
  "$12,000 ASK",
  "23 ACTIVE MEMBERS",
  "20+ ANNUAL EVENTS",
  "95% RCC STUDENT ATTENDANCE",
  "1,000+ GDG CHAPTERS",
  "140 COUNTRIES",
  "FY 2026 / 2027",
];

const PROGRAM_MARQUEE = [
  "GOOGLE GUEST SPEAKERS",
  "GOOGLEPLEX FIELD TRIP",
  "SOCAL HACKATHON",
  "FLUTTER · FIREBASE · GEMINI · CLOUD",
  "BUILT WITH GOOGLE",
];

export default function App() {
  return (
    <div className="relative min-h-screen">
      <main id="hero" className="pb-24">
        <Hero />
        <Marquee items={STATS_MARQUEE} bgClassName="bg-gdg-ink" textClassName="text-white" />
        <WhatIsGDG />
        <Marquee items={PROGRAM_MARQUEE} bgClassName="bg-white" textClassName="text-gdg-ink" />
        <Mission />
        <TheAsk />
        <Marquee items={STATS_MARQUEE} bgClassName="bg-gdg-ink" textClassName="text-white" duration={36} />
        <Impact />
        <Accomplishments />
        <WhyASRCC />
        <QandA />
      </main>
      <ProgressDots />
      <StickyTotal />
      <footer className="px-6 pb-[calc(var(--safe-bottom)+5rem)] pt-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-gdg-mute">
        GDG on Campus · Riverside City College · ASRCC Budget Request FY 2026 / 2027
      </footer>
    </div>
  );
}

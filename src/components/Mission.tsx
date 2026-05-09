import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CLUB_FACTS, DISCIPLINES, MISSION_PITCH } from "../data/budget";
import { SectionShell } from "./SectionShell";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { label: "Active members", value: CLUB_FACTS.activeMembers, accent: "blue" as const },
  { label: "Annual events", value: CLUB_FACTS.annualEvents, accent: "red" as const },
  { label: "On campus", value: `${CLUB_FACTS.onCampusPercent}%`, accent: "yellow" as const },
  {
    label: "Disciplines represented",
    value: `${DISCIPLINES.length}+`,
    accent: "green" as const,
  },
];

const ACCENT: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "text-gdg-blue",
  red: "text-gdg-red",
  yellow: "text-gdg-yellow",
  green: "text-gdg-green",
};

export function Mission() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(".js-mission-stat", { autoAlpha: 0, y: 16 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".js-mission-stat", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.55,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.08,
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell
      id="mission"
      chapter={{ number: "02", label: "Our Chapter" }}
      title="A professional accelerator on campus."
      tint="blue"
    >
      <div ref={root}>
        <p className="text-base leading-relaxed text-gdg-ink/85">{MISSION_PITCH}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="js-mission-stat rounded-2xl bg-white p-4 shadow-soft">
              <div className={`font-display text-3xl font-bold ${ACCENT[s.accent]}`}>{s.value}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gdg-mute">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-gdg-line bg-white px-4 py-3 text-sm text-gdg-mute">
          Meets at <span className="font-medium text-gdg-ink">{CLUB_FACTS.meetingLocation}</span> ·
          Attendance tracked via Bevy
        </div>
      </div>
    </SectionShell>
  );
}

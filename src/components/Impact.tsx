import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  CLUB_FACTS,
  DISCIPLINES,
  UNIVERSAL_SKILLS,
  VESSEL_STATEMENT,
} from "../data/budget";
import { SectionShell } from "./SectionShell";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ACCENT: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "text-gdg-blue",
  red: "text-gdg-red",
  yellow: "text-gdg-yellow",
  green: "text-gdg-green",
};

const ACCENT_BG: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "bg-gdg-blue",
  red: "bg-gdg-red",
  yellow: "bg-gdg-yellow",
  green: "bg-gdg-green",
};

export function Impact() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(".js-impact-stat", { autoAlpha: 0, y: 14 });
      gsap.set(".js-discipline", { autoAlpha: 0, y: 18, scale: 0.96 });
      gsap.set(".js-skill", { autoAlpha: 0, y: 8 });
      gsap.set(".js-vessel", { autoAlpha: 0, y: 16 });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-vessel", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.6,
          })
            .to(
              ".js-discipline",
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: reduced ? 0.01 : 0.5,
                stagger: reduced ? 0 : 0.07,
                ease: "back.out(1.6)",
              },
              "-=0.25",
            )
            .to(
              ".js-skill",
              {
                autoAlpha: 1,
                y: 0,
                duration: reduced ? 0.01 : 0.35,
                stagger: reduced ? 0 : 0.04,
              },
              "-=0.2",
            )
            .to(
              ".js-impact-stat",
              {
                autoAlpha: 1,
                y: 0,
                duration: reduced ? 0.01 : 0.5,
                stagger: reduced ? 0 : 0.08,
              },
              "-=0.15",
            );
        },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell
      id="impact"
      chapter={{ number: "03", label: "Impact" }}
      title="Tech is the vessel."
      tint="yellow"
    >
      <div ref={root} className="space-y-5">
        <div className="js-vessel rounded-3xl bg-gdg-ink p-6 text-white shadow-lift">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
            What we actually build
          </p>
          <p className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight">
            {VESSEL_STATEMENT}
          </p>
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gdg-mute">
            Members come from every discipline
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {DISCIPLINES.map((d) => (
              <div
                key={d.name}
                className="js-discipline relative overflow-hidden rounded-2xl bg-white p-3 shadow-soft"
              >
                <span
                  aria-hidden
                  className={`absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-20 ${ACCENT_BG[d.color]}`}
                />
                <p className={`font-display text-sm font-bold leading-tight ${ACCENT[d.color]}`}>
                  {d.name}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gdg-mute">
            Not just CS. Humanities, biology, business. The skills travel anywhere.
          </p>
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gdg-mute">
            Universal skills, built through tech
          </p>
          <div className="flex flex-wrap gap-2">
            {UNIVERSAL_SKILLS.map((skill) => (
              <span
                key={skill}
                className="js-skill rounded-full border border-gdg-line bg-white px-3 py-1.5 text-xs font-medium text-gdg-ink shadow-soft"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="js-impact-stat rounded-2xl bg-white p-4 shadow-soft">
            <div className={`font-display text-3xl font-bold ${ACCENT.green}`}>
              {CLUB_FACTS.graduatingSpring}
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gdg-mute">
              Graduating in spring
            </div>
          </div>
          <div className="js-impact-stat rounded-2xl bg-white p-4 shadow-soft">
            <div className={`font-display text-3xl font-bold ${ACCENT.blue}`}>
              {CLUB_FACTS.transferringFourYear}
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gdg-mute">
              Transferring to 4-year
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gdg-line bg-white p-4 text-sm leading-relaxed text-gdg-ink/85">
          <span className="font-medium text-gdg-ink">How attendance is tracked: </span>
          {CLUB_FACTS.attendanceTracking}.
        </div>
      </div>
    </SectionShell>
  );
}

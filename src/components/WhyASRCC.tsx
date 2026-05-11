import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "./SectionShell";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const POINTS = [
  {
    color: "#4285F4",
    title: "Verbal acknowledgement",
    body: "ASRCC is named at the open and close of every event, in person and on Bevy live-streams.",
  },
  {
    color: "#EA4335",
    title: "Logo on every flyer",
    body: "ASRCC logo placement on all digital and print marketing: flyers, social graphics, event pages.",
  },
  {
    color: "#FBBC04",
    title: "Aligned with funding priorities",
    body: "90% of our 20+ events are on-campus, drawing members from humanities, biology, business, engineering, and computer science. Funds go directly to student engagement.",
  },
  {
    color: "#34A853",
    title: "Maximum leverage on every dollar",
    body: "Google supplies the speakers, the platform, the certifications, and the cloud credits. ASRCC funds the room, the meals, the travel.",
  },
];

export function WhyASRCC() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(".js-why-card", { autoAlpha: 0, x: -16 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".js-why-card", {
            autoAlpha: 1,
            x: 0,
            duration: reduced ? 0.01 : 0.5,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.07,
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell
      id="why"
      chapter={{ number: "06", label: "Why ASRCC" }}
      title="Aligned with the mission."
      tint="green"
    >
      <div ref={root} className="space-y-3">
        {POINTS.map((p) => (
          <div key={p.title} className="js-why-card flex gap-4 rounded-2xl bg-white p-4 shadow-soft">
            <div
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ background: p.color }}
              aria-hidden
            />
            <div>
              <h3 className="font-display text-base font-semibold tracking-tight text-gdg-ink">
                {p.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gdg-ink/80">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

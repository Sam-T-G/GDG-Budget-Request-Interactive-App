import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CLUB_FACTS, TOTAL_REQUEST } from "../data/budget";
import { GDG_FACTS } from "../data/gdg";
import { AnimatedCounter } from "./AnimatedCounter";
import { GDGWordmark } from "./GDGWordmark";
import { SplitTitle } from "./SplitTitle";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".js-eyebrow", { autoAlpha: 0, y: -8 });
      gsap.set(".js-subtitle", { autoAlpha: 0, y: 12 });
      gsap.set(".js-counter-card", { autoAlpha: 0, y: 28, scale: 0.96 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".js-eyebrow", { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.5, delay: 0.1 })
        .to(".js-subtitle", { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.5 }, "+=0.4")
        .to(".js-counter-card", { autoAlpha: 1, y: 0, scale: 1, duration: reduced ? 0.01 : 0.7 }, "-=0.2");
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-gdg-paper px-5 pb-12 pt-[calc(var(--safe-top)+2rem)] sm:px-8"
    >
      {/* Signature animated ribbon — wavy stroke that draws on load */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 400 700"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="33%" stopColor="#EA4335" />
            <stop offset="66%" stopColor="#FBBC04" />
            <stop offset="100%" stopColor="#34A853" />
          </linearGradient>
        </defs>
        <path
          className="js-ribbon-path"
          d="M-30 80 C 80 60, 130 220, 220 200 S 360 360, 280 460 S 100 600, 200 720"
          stroke="url(#ribbon-grad)"
          strokeWidth="2"
          fill="none"
          opacity="0.45"
        />
      </svg>

      <div className="relative mx-auto flex max-w-xl flex-col gap-7">
        <div className="js-eyebrow flex items-center gap-3">
          <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-gdg-mute">
            00 / FY 26&nbsp;·&nbsp;27
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-gdg-line via-gdg-line/40 to-transparent" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gdg-ink">
            ASRCC Budget Request
          </span>
        </div>

        <GDGWordmark />

        <SplitTitle
          text="Google Developer Groups on Campus · Riverside City College"
          as="h1"
          immediate
          delay={0.6}
          stagger={0.018}
          className="js-subtitle font-display text-2xl font-semibold leading-tight tracking-tight text-gdg-ink sm:text-3xl"
        />

        <p className="js-subtitle -mt-3 text-sm leading-relaxed text-gdg-ink/75 sm:text-base">
          {GDG_FACTS.plainSummary}
        </p>

        <div className="js-counter-card relative overflow-hidden rounded-3xl bg-gdg-ink px-6 pb-7 pt-6 text-white shadow-lift">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl" style={{
            background:
              "conic-gradient(from 220deg, #4285F4, #EA4335, #FBBC04, #34A853, #4285F4)",
          }} />
          <p className="relative font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            Total funding requested
          </p>
          <AnimatedCounter
            value={TOTAL_REQUEST}
            triggerOnView={false}
            duration={1.8}
            className="relative mt-2 block font-display text-[4.25rem] font-bold leading-none tabular-nums tracking-tight text-white sm:text-[5.5rem]"
          />
          <p className="relative mt-3 text-sm text-white/70">
            Across three programs · presented by{" "}
            <span className="font-medium text-white">{CLUB_FACTS.primaryContact}</span>
          </p>
        </div>

      </div>
    </section>
  );
}

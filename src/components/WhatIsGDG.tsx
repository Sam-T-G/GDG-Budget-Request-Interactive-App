import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GDG_FACTS, GDG_PILLARS, RCC_CHAPTER } from "../data/gdg";
import { CLUB_FACTS } from "../data/budget";
import { BrandImage } from "./BrandImage";
import { ChapterMarker } from "./ChapterMarker";
import { SplitTitle } from "./SplitTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

const PILLAR_BG: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "bg-gdg-blue",
  red: "bg-gdg-red",
  yellow: "bg-gdg-yellow",
  green: "bg-gdg-green",
};

const PILLAR_TEXT: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "text-gdg-blue",
  red: "text-gdg-red",
  yellow: "text-gdg-yellow",
  green: "text-gdg-green",
};

// 12 cols × 6 rows world-ish dot grid
const COLS = 12;
const ROWS = 6;
const DOT_R = 3.2;
const DOT_GAP_X = 24;
const DOT_GAP_Y = 22;
const SVG_W = COLS * DOT_GAP_X;
const SVG_H = ROWS * DOT_GAP_Y;

const CONTINENT_DOTS = new Set<number>([
  1, 13, 14, 25, 26, 27, 38, 39, 50,
  4, 5, 16, 17, 28, 29, 41, 53,
  7, 8, 9, 19, 20, 21, 32, 33, 44,
  46, 58,
]);

const MV = { col: 1, row: 1 };
const RVS = { col: 1, row: 2 };

const dotPos = (col: number, row: number) => ({
  cx: col * DOT_GAP_X + DOT_GAP_X / 2,
  cy: row * DOT_GAP_Y + DOT_GAP_Y / 2,
});

export function WhatIsGDG() {
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const countriesRef = useRef<HTMLSpanElement>(null);
  const pinScopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctxRoot = root.current;
      if (!ctxRoot) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".js-quote", { autoAlpha: 0, y: 24 });
      gsap.set(".js-stat-num", { autoAlpha: 0, y: 12 });
      gsap.set(".js-pillar", { autoAlpha: 0, y: 28 });
      gsap.set(".js-rcc-card", { autoAlpha: 0, y: 28, scale: 0.97 });
      gsap.set(".js-dot", { autoAlpha: 0, scale: 0 });
      gsap.set(".js-line", { strokeDasharray: "200 200", strokeDashoffset: 200 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ctxRoot,
          start: "top 70%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(".js-quote", { autoAlpha: 1, y: 0, duration: 0.7 })
        .to(
          ".js-dot",
          {
            autoAlpha: 1,
            scale: 1,
            duration: reduced ? 0.01 : 0.5,
            stagger: { each: reduced ? 0 : 0.012, from: "random" },
            ease: "back.out(2)",
          },
          "-=0.3",
        )
        .to(
          ".js-line",
          {
            strokeDashoffset: 0,
            duration: reduced ? 0.01 : 1,
            ease: "power2.inOut",
          },
          "-=0.4",
        )
        .to(
          ".js-stat-num",
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.7",
        )
        .to(
          ".js-pillar",
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 },
          "-=0.4",
        )
        .to(".js-rcc-card", { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 }, "-=0.2");

      // Counter tweens
      const chapters = { val: 0 };
      const countries = { val: 0 };
      ScrollTrigger.create({
        trigger: ctxRoot,
        start: "top 60%",
        once: true,
        onEnter: () => {
          gsap.to(chapters, {
            val: GDG_FACTS.globalChapters,
            duration: reduced ? 0.01 : 1.6,
            ease: "power2.out",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `${Math.round(chapters.val).toLocaleString()}+`;
              }
            },
          });
          gsap.to(countries, {
            val: GDG_FACTS.globalCountries,
            duration: reduced ? 0.01 : 1.4,
            ease: "power2.out",
            delay: 0.2,
            onUpdate: () => {
              if (countriesRef.current) {
                countriesRef.current.textContent = Math.round(countries.val).toString();
              }
            },
          });
        },
      });

      if (!reduced) {
        gsap.to(".js-rcc-pulse", {
          scale: 1.4,
          autoAlpha: 0,
          duration: 1.6,
          repeat: -1,
          ease: "power2.out",
          delay: 1.8,
        });
      }
    },
    { scope: root },
  );

  // Pinned-scroll moment: pillars cross-fade through as user scrolls
  useGSAP(
    () => {
      const scope = pinScopeRef.current;
      if (!scope) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // On small screens or reduced motion, skip pinning to avoid iOS Safari jank
      const supportsPin = window.matchMedia("(min-width: 480px) and (min-height: 640px)").matches;
      if (reduced || !supportsPin) return;

      const pillars = scope.querySelectorAll<HTMLDivElement>(".js-pillar-pin");
      if (pillars.length === 0) return;

      gsap.set(pillars, { autoAlpha: 0, y: 20 });
      gsap.set(pillars[0], { autoAlpha: 1, y: 0 });

      const stages = pillars.length;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: `+=${stages * 100}%`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      pillars.forEach((p, i) => {
        if (i === 0) return;
        tl.to(pillars[i - 1], { autoAlpha: 0, y: -20, duration: 0.5 }, i)
          .to(p, { autoAlpha: 1, y: 0, duration: 0.5 }, i);
      });
    },
    { scope: pinScopeRef },
  );

  return (
    <section ref={root} id="about-gdg" className="scroll-mt-20">
      <ChapterMarker number="01" label="What is GDG?" color="blue" />
      <div className="bg-gradient-to-b from-gdg-paper via-white to-gdg-mist px-5 pb-20 pt-4 sm:px-8">
        <div className="mx-auto max-w-xl">
          <SplitTitle
            text="A global developer community, built by Google."
            as="h2"
            className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-gdg-ink sm:text-5xl"
          />

          <figure className="js-quote mt-7 rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <div
                aria-hidden
                className="mt-1 flex h-7 items-center text-3xl leading-none text-gdg-blue"
              >
                &ldquo;
              </div>
              <blockquote className="text-base leading-relaxed text-gdg-ink/90">
                {GDG_FACTS.officialDescription}
              </blockquote>
            </div>
            <figcaption className="mt-3 pl-9 font-mono text-[10px] uppercase tracking-[0.16em] text-gdg-mute">
              — developers.google.com / community / gdg
            </figcaption>
          </figure>

          {/* World dots + connection line */}
          <div className="mt-8 overflow-hidden rounded-3xl bg-gdg-ink p-5 shadow-lift">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
              Global reach
            </p>
            <div className="mt-3 flex items-baseline gap-6">
              <div>
                <span
                  ref={counterRef}
                  className="js-stat-num inline-block font-display text-4xl font-bold tabular-nums text-white"
                >
                  0+
                </span>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                  chapters
                </p>
              </div>
              <div>
                <span
                  ref={countriesRef}
                  className="js-stat-num inline-block font-display text-4xl font-bold tabular-nums text-white"
                >
                  0
                </span>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                  countries
                </p>
              </div>
            </div>

            <div className="mt-4 -mx-1 overflow-hidden">
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                width="100%"
                height="auto"
                role="img"
                aria-label="Stylized world dot grid"
                className="block"
              >
                {Array.from({ length: COLS * ROWS }).map((_, i) => {
                  const col = i % COLS;
                  const row = Math.floor(i / COLS);
                  const { cx, cy } = dotPos(col, row);
                  const isLand = CONTINENT_DOTS.has(i);
                  const color = isLand
                    ? GOOGLE_COLORS[(col + row) % GOOGLE_COLORS.length]
                    : "rgba(255,255,255,0.10)";
                  return (
                    <circle
                      key={i}
                      className="js-dot"
                      cx={cx}
                      cy={cy}
                      r={isLand ? DOT_R : DOT_R * 0.55}
                      fill={color}
                    />
                  );
                })}

                <line
                  className="js-line"
                  x1={dotPos(MV.col, MV.row).cx}
                  y1={dotPos(MV.col, MV.row).cy}
                  x2={dotPos(RVS.col, RVS.row).cx}
                  y2={dotPos(RVS.col, RVS.row).cy}
                  stroke="#FBBC04"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />

                <circle
                  className="js-rcc-pulse"
                  cx={dotPos(RVS.col, RVS.row).cx}
                  cy={dotPos(RVS.col, RVS.row).cy}
                  r={DOT_R + 1}
                  fill="none"
                  stroke="#FBBC04"
                  strokeWidth={1.5}
                  opacity={0.7}
                />
              </svg>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Mountain View → Riverside · GDG on Campus brings the same global ecosystem to RCC.
            </p>
          </div>

          {/* Pillars (two-tier: pinned cross-fade on big screens, static grid on small) */}
          <div className="mt-8">
            <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gdg-mute">
              Four pillars
            </p>
            {/* Static grid — always visible (pin layers over it on big screens) */}
            <div className="grid grid-cols-2 gap-3">
              {GDG_PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="js-pillar relative overflow-hidden rounded-2xl bg-white p-4 shadow-soft"
                >
                  <span
                    aria-hidden
                    className={`absolute -right-3 -top-3 h-10 w-10 rounded-full opacity-15 ${PILLAR_BG[p.color]}`}
                  />
                  <h3 className={`font-display text-lg font-bold tracking-tight ${PILLAR_TEXT[p.color]}`}>
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-gdg-ink/80">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pinned cross-fade moment — separate scope, only fires on larger viewports */}
          <div ref={pinScopeRef} className="relative mt-10 hidden h-[60vh] sm:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <div className="relative h-[18rem] w-full max-w-md">
                {GDG_PILLARS.map((p) => (
                  <div
                    key={p.title}
                    className="js-pillar-pin absolute inset-0 flex flex-col justify-center rounded-3xl bg-white p-8 shadow-lift"
                    style={{ opacity: 0 }}
                  >
                    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${PILLAR_TEXT[p.color]}`}>
                      {p.title}
                    </p>
                    <p className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-gdg-ink">
                      {p.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gdg-line bg-white px-5 py-4">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
              GDG on Campus
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gdg-ink/85">
              {GDG_FACTS.onCampusDescription}
            </p>
          </div>

          <article className="js-rcc-card relative mt-6 overflow-hidden rounded-3xl bg-gdg-ink shadow-lift">
            <BrandImage
              src={`${import.meta.env.BASE_URL}brand/chapter-banner.png`}
              alt="GDG on Campus Riverside City College banner"
              className="h-32 w-full object-cover opacity-70"
              fallback={
                <div
                  aria-hidden
                  className="h-32 w-full"
                  style={{
                    background:
                      "linear-gradient(115deg, #4285F4 0%, #34A853 35%, #FBBC04 65%, #EA4335 100%)",
                    opacity: 0.85,
                  }}
                />
              }
            />
            <div className="relative -mt-10 px-5 pb-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-ink shadow-soft">
                <span className="inline-block h-2 w-2 rounded-full bg-gdg-green" />
                {RCC_CHAPTER.established}
              </div>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight text-white">
                {RCC_CHAPTER.fullName}
              </h3>
              <p className="mt-1 text-sm text-white/75">
                {CLUB_FACTS.activeMembers} active members · {RCC_CHAPTER.region}
              </p>
              <a
                href={RCC_CHAPTER.link}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-ink active:scale-[0.98]"
              >
                See the global directory
                <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GDG_FACTS, GDG_PILLARS, RCC_CHAPTER } from "../data/gdg";
import { CLUB_FACTS } from "../data/budget";
import { BrandImage } from "./BrandImage";
import { ChapterMarker } from "./ChapterMarker";
import { RareSeat } from "./RareSeat";
import { SplitTitle } from "./SplitTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

const PILLAR_HEX: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

const PILLAR_TEXT: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "text-gdg-blue",
  red: "text-gdg-red",
  yellow: "text-gdg-yellow",
  green: "text-gdg-green",
};

const COLS = 13;
const ROWS = 6;
const DOT_R = 3;
const DOT_GAP_X = 22;
const DOT_GAP_Y = 22;
const SVG_W = COLS * DOT_GAP_X;
const SVG_H = ROWS * DOT_GAP_Y;

const CONTINENT_DOTS = new Set<number>([
  1, 14, 15, 27, 28, 29, 41, 42, 54,
  4, 5, 17, 18, 30, 31, 44, 57,
  7, 8, 9, 20, 21, 22, 34, 35, 47,
  49, 62,
]);

const MV = { col: 1, row: 1 };
const RVS = { col: 1, row: 2 };

const dotPos = (col: number, row: number) => ({
  cx: col * DOT_GAP_X + DOT_GAP_X / 2,
  cy: row * DOT_GAP_Y + DOT_GAP_Y / 2,
});

const mv = dotPos(MV.col, MV.row);
const rvs = dotPos(RVS.col, RVS.row);
const arcD = `M ${mv.cx} ${mv.cy} Q ${(mv.cx + rvs.cx) / 2 + 24} ${(mv.cy + rvs.cy) / 2} ${rvs.cx} ${rvs.cy}`;

export function WhatIsGDG() {
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const countriesRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const ctxRoot = root.current;
      if (!ctxRoot) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Initial states
      gsap.set(".js-lede", { autoAlpha: 0, y: 18, filter: "blur(4px)" });
      gsap.set(".js-quote", { autoAlpha: 0, y: 18 });
      gsap.set(".js-quote-mark", { autoAlpha: 0, scale: 0.5, rotation: -10 });

      gsap.set(".js-scale-eyebrow", { autoAlpha: 0, y: 10 });
      gsap.set(".js-scale-counter", { autoAlpha: 0, scale: 0.94, filter: "blur(10px)" });
      gsap.set(".js-scale-sub", { autoAlpha: 0, y: 12 });
      gsap.set(".js-dot", { autoAlpha: 0, scale: 0 });
      gsap.set(".js-arc", { strokeDasharray: 220, strokeDashoffset: 220 });
      gsap.set(".js-mv-core", { autoAlpha: 0, scale: 0 });
      gsap.set(".js-rvs-core", { autoAlpha: 0, scale: 0 });
      gsap.set(".js-rvs-halo", { autoAlpha: 0, scale: 0 });
      gsap.set(".js-map-label", { autoAlpha: 0, y: 8 });
      gsap.set(".js-handoff", { autoAlpha: 0, y: 18, filter: "blur(6px)" });

      gsap.set(".js-pillars-head", { autoAlpha: 0, y: 14 });
      gsap.set(".js-pillar-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".js-pillar-num", { autoAlpha: 0, x: -14 });
      gsap.set(".js-pillar-title", { autoAlpha: 0, y: 10 });
      gsap.set(".js-pillar-body", { autoAlpha: 0, y: 8 });
      gsap.set(".js-oncampus", { autoAlpha: 0, y: 16 });

      gsap.set(".js-mandate-bg", { scale: 1.08 });
      gsap.set(".js-mandate-eyebrow", { autoAlpha: 0, y: 12 });
      gsap.set(".js-mandate-line1", { autoAlpha: 0, y: 18, filter: "blur(8px)" });
      gsap.set(".js-mandate-line2", { autoAlpha: 0, y: 18, filter: "blur(8px)" });
      gsap.set(".js-mandate-footer", { autoAlpha: 0, y: 12 });
      gsap.set(".js-rcc-card", { autoAlpha: 0, y: 28, scale: 0.96 });

      // ACT I — Identity
      ScrollTrigger.create({
        trigger: ".js-act-i",
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-lede", {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: reduced ? 0.01 : 0.7,
          })
            .to(
              ".js-quote-mark",
              {
                autoAlpha: 1,
                scale: 1,
                rotation: 0,
                duration: reduced ? 0.01 : 0.6,
                ease: "back.out(2.2)",
              },
              "-=0.3",
            )
            .to(
              ".js-quote",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.6 },
              "-=0.4",
            );
        },
      });

      // ACT II — Scale (dramatic)
      ScrollTrigger.create({
        trigger: ".js-act-ii",
        start: "top 70%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-scale-eyebrow", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.5,
          })
            .to(
              ".js-scale-counter",
              {
                autoAlpha: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: reduced ? 0.01 : 1.0,
              },
              "-=0.2",
            )
            .to(
              ".js-scale-sub",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.55 },
              "-=0.5",
            )
            .to(
              ".js-dot",
              {
                autoAlpha: 1,
                scale: 1,
                duration: reduced ? 0.01 : 0.55,
                stagger: { each: reduced ? 0 : 0.01, from: "random" },
                ease: "back.out(2)",
              },
              "-=0.5",
            )
            .to(
              ".js-arc",
              {
                strokeDashoffset: 0,
                duration: reduced ? 0.01 : 1.1,
                ease: "power2.inOut",
              },
              "-=0.4",
            )
            .to(
              ".js-mv-core",
              {
                autoAlpha: 1,
                scale: 1,
                duration: reduced ? 0.01 : 0.4,
                ease: "back.out(2.4)",
              },
              "-=0.9",
            )
            .to(
              ".js-rvs-halo",
              {
                autoAlpha: 0.55,
                scale: 1,
                duration: reduced ? 0.01 : 0.6,
                ease: "power2.out",
              },
              "-=0.25",
            )
            .to(
              ".js-rvs-core",
              {
                autoAlpha: 1,
                scale: 1,
                duration: reduced ? 0.01 : 0.5,
                ease: "back.out(2.8)",
              },
              "-=0.4",
            )
            .to(
              ".js-map-label",
              {
                autoAlpha: 1,
                y: 0,
                duration: reduced ? 0.01 : 0.5,
                stagger: reduced ? 0 : 0.1,
              },
              "-=0.2",
            )
            .to(
              ".js-handoff",
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: reduced ? 0.01 : 0.9,
              },
              "-=0.1",
            );

          // Counter tweens
          const chapters = { val: 0 };
          gsap.to(chapters, {
            val: GDG_FACTS.globalChapters,
            duration: reduced ? 0.01 : 1.8,
            delay: 0.3,
            ease: "power2.out",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `${Math.round(chapters.val).toLocaleString()}+`;
              }
            },
          });
          const countries = { val: 0 };
          gsap.to(countries, {
            val: GDG_FACTS.globalCountries,
            duration: reduced ? 0.01 : 1.4,
            delay: 0.6,
            ease: "power2.out",
            onUpdate: () => {
              if (countriesRef.current) {
                countriesRef.current.textContent = Math.round(countries.val).toString();
              }
            },
          });

          if (!reduced) {
            // Continuous gentle pulse at Riverside node
            gsap.to(".js-rvs-halo", {
              scale: 1.6,
              autoAlpha: 0,
              duration: 1.8,
              repeat: -1,
              ease: "power2.out",
              delay: 1.6,
            });
          }
        },
      });

      // ACT III — Pillars (editorial reveal)
      ScrollTrigger.create({
        trigger: ".js-act-iii",
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-pillars-head", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.55,
          }).to(
            ".js-oncampus",
            { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.5, delay: reduced ? 0 : 0.4 },
            0,
          );
        },
      });

      const pillarRows = gsap.utils.toArray<HTMLElement>(".js-pillar-row");
      pillarRows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 88%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({
              delay: reduced ? 0 : i * 0.05,
              defaults: { ease: "power3.out" },
            });
            tl.to(row.querySelector(".js-pillar-rule"), {
              scaleX: 1,
              duration: reduced ? 0.01 : 0.55,
            })
              .to(
                row.querySelector(".js-pillar-num"),
                { autoAlpha: 1, x: 0, duration: reduced ? 0.01 : 0.4 },
                "-=0.3",
              )
              .to(
                row.querySelector(".js-pillar-title"),
                { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.45 },
                "-=0.25",
              )
              .to(
                row.querySelector(".js-pillar-body"),
                { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.4 },
                "-=0.2",
              );
          },
        });
      });

      // ACT IV — Mandate manifesto
      ScrollTrigger.create({
        trigger: ".js-act-iv",
        start: "top 65%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-mandate-bg", {
            scale: 1,
            duration: reduced ? 0.01 : 2.4,
            ease: "power1.out",
          })
            .to(
              ".js-mandate-eyebrow",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.5 },
              0,
            )
            .to(
              ".js-mandate-line1",
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: reduced ? 0.01 : 0.9,
              },
              0.2,
            )
            .to(
              ".js-mandate-line2",
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: reduced ? 0.01 : 0.95,
              },
              0.6,
            )
            .to(
              ".js-mandate-footer",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.5 },
              0.95,
            )
            .to(
              ".js-rcc-card",
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: reduced ? 0.01 : 0.75,
              },
              1.1,
            );
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about-gdg" className="scroll-mt-20">
      <ChapterMarker number="01" label="What is GDG?" color="blue" />

      {/* ACT I — Identity */}
      <div className="js-act-i bg-gradient-to-b from-gdg-paper via-white to-white px-5 pb-14 pt-4 sm:px-8">
        <div className="mx-auto max-w-xl">
          <SplitTitle
            text="A career-development club, backed by Google."
            as="h2"
            className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-gdg-ink sm:text-5xl"
          />

          <p className="js-lede mt-6 text-base leading-relaxed text-gdg-ink/80">
            {GDG_FACTS.plainSummary}
          </p>

          <figure className="js-quote relative mt-8 rounded-3xl bg-gdg-mist/70 px-6 py-7">
            <span
              aria-hidden
              className="js-quote-mark absolute -left-1 -top-4 font-display text-[5rem] font-bold leading-none text-gdg-blue/25"
            >
              &ldquo;
            </span>
            <blockquote className="relative text-base leading-relaxed text-gdg-ink/85">
              {GDG_FACTS.officialDescription}
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2">
              <span aria-hidden className="inline-block h-px w-6 bg-gdg-blue" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gdg-mute">
                developers.google.com / community / gdg
              </span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* ACT II — Scale (full-bleed dark) */}
      <div className="js-act-ii relative overflow-hidden bg-gdg-ink py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 18% 25%, #4285F4 0%, transparent 36%), radial-gradient(circle at 82% 75%, #34A853 0%, transparent 36%), radial-gradient(circle at 50% 50%, #FBBC04 0%, transparent 30%)",
          }}
        />

        <div className="relative mx-auto max-w-xl px-5 sm:px-8">
          <div className="js-scale-eyebrow flex items-center gap-2">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gdg-yellow" />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-white/70">
              Global reach
            </p>
          </div>

          <div className="js-scale-counter mt-5">
            <span
              ref={counterRef}
              className="block font-display text-[5.5rem] font-bold leading-[0.95] tabular-nums text-white sm:text-[7rem]"
              style={{ letterSpacing: "-0.045em" }}
            >
              0+
            </span>
            <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
              chapters worldwide
            </p>
          </div>

          <div className="js-scale-sub mt-6 flex items-baseline gap-3 border-t border-white/10 pt-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              In
            </span>
            <span
              ref={countriesRef}
              className="font-display text-4xl font-bold tabular-nums text-gdg-yellow"
            >
              0
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              countries
            </span>
          </div>

          <div className="relative mt-10 -mx-2">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              width="100%"
              height="auto"
              role="img"
              aria-label="Stylized world dot grid showing the line from Mountain View to Riverside"
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

              <path
                className="js-arc"
                d={arcD}
                stroke="#FBBC04"
                strokeWidth={1.4}
                fill="none"
                strokeLinecap="round"
              />

              <circle
                className="js-mv-core"
                cx={mv.cx}
                cy={mv.cy}
                r={DOT_R + 1.6}
                fill="#4285F4"
              />

              <circle
                className="js-rvs-halo"
                cx={rvs.cx}
                cy={rvs.cy}
                r={DOT_R + 5}
                fill="none"
                stroke="#FBBC04"
                strokeWidth={1.4}
              />
              <circle
                className="js-rvs-core"
                cx={rvs.cx}
                cy={rvs.cy}
                r={DOT_R + 2.4}
                fill="#FBBC04"
              />
            </svg>

            <div className="mt-4 grid grid-cols-2 gap-3 px-1">
              <div className="js-map-label">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  Mountain View
                </span>
                <p className="mt-0.5 text-[11px] leading-snug text-white/75">
                  Google HQ · the source
                </p>
              </div>
              <div className="js-map-label text-right">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gdg-yellow">
                  Riverside
                </span>
                <p className="mt-0.5 text-[11px] leading-snug text-white/75">
                  RCC · the seat
                </p>
              </div>
            </div>
          </div>

          <p className="js-handoff mt-12 font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl">
            Now, one of those chapters is{" "}
            <span className="text-gdg-yellow">here.</span>
          </p>
        </div>
      </div>

      {/* ACT III — Pillars (editorial) */}
      <div className="js-act-iii bg-white px-5 pb-14 pt-16 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-xl">
          <div className="js-pillars-head">
            <div className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gdg-ink" />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-gdg-mute">
                How it works
              </p>
            </div>
            <h3 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight text-gdg-ink sm:text-5xl">
              Four pillars.
            </h3>
          </div>

          <ul className="mt-10 space-y-9">
            {GDG_PILLARS.map((p, i) => (
              <li key={p.title} className="js-pillar-row relative pt-4">
                <span
                  aria-hidden
                  className="js-pillar-rule absolute left-0 top-0 h-px w-full origin-left"
                  style={{
                    background: `linear-gradient(90deg, ${PILLAR_HEX[p.color]} 0%, ${PILLAR_HEX[p.color]}33 60%, transparent 100%)`,
                  }}
                />
                <div className="flex items-baseline gap-5">
                  <span
                    className="js-pillar-num font-mono text-[11px] font-medium tracking-[0.24em]"
                    style={{ color: PILLAR_HEX[p.color] }}
                  >
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <h4
                      className={`js-pillar-title font-display text-3xl font-bold leading-none tracking-tight ${PILLAR_TEXT[p.color]} sm:text-4xl`}
                    >
                      {p.title}.
                    </h4>
                    <p className="js-pillar-body mt-3 max-w-md text-sm leading-relaxed text-gdg-ink/75">
                      {p.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="js-oncampus mt-14 rounded-2xl border border-gdg-line bg-gdg-mist/50 px-5 py-4">
            <div className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-gdg-green" />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gdg-mute">
                GDG on Campus
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gdg-ink/85">
              {GDG_FACTS.onCampusDescription}
            </p>
          </div>
        </div>
      </div>

      {/* ACT IV — Mandate manifesto (full-bleed colored) */}
      <div className="js-act-iv relative overflow-hidden">
        <div
          aria-hidden
          className="js-mandate-bg absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #4285F4 0%, #34A853 35%, #FBBC04 70%, #EA4335 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gdg-ink/65 mix-blend-multiply"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.20) 0%, transparent 40%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.10) 0%, transparent 42%)",
          }}
        />

        <div className="relative px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-xl">
            <div className="js-mandate-eyebrow flex items-center gap-2">
              <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gdg-yellow" />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-white/70">
                Our chapter's mandate
              </p>
            </div>

            <h3 className="mt-6 font-display font-bold leading-[1.02] tracking-tight text-white">
              <span className="js-mandate-line1 block text-[2.5rem] text-white/55 sm:text-[3.25rem]">
                Most chapters serve developers.
              </span>
              <span className="js-mandate-line2 mt-3 block text-[2.5rem] text-white sm:text-[3.25rem]">
                Ours <span className="text-gdg-yellow">forges</span> professionals.
              </span>
            </h3>

            <p className="js-mandate-footer mt-8 max-w-md text-base leading-relaxed text-white/85">
              Across every discipline at RCC. Biology, business, humanities, engineering, communications, computer science.
            </p>

            <article className="js-rcc-card mt-12 overflow-hidden rounded-3xl bg-white shadow-lift">
              <BrandImage
                src={`${import.meta.env.BASE_URL}brand/chapter-banner.png`}
                alt="GDG on Campus Riverside City College banner"
                className="h-32 w-full object-cover"
                fallback={
                  <div
                    aria-hidden
                    className="h-32 w-full"
                    style={{
                      background:
                        "linear-gradient(115deg, #4285F4 0%, #34A853 35%, #FBBC04 65%, #EA4335 100%)",
                    }}
                  />
                }
              />
              <div className="relative -mt-9 px-5 pb-6 pt-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-gdg-ink px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white shadow-soft">
                  <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gdg-green" />
                  {RCC_CHAPTER.established}
                </div>
                <h4 className="mt-6 font-display text-xl font-bold leading-tight tracking-tight text-gdg-ink">
                  {RCC_CHAPTER.fullName}
                </h4>
                <p className="mt-1 text-sm text-gdg-mute">
                  {CLUB_FACTS.activeMembers} active members · {RCC_CHAPTER.region}
                </p>
                <a
                  href={RCC_CHAPTER.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gdg-ink px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white active:scale-[0.98]"
                >
                  See the global directory
                  <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* RareSeat — final note on white */}
      <div className="bg-white px-5 pb-14 pt-4 sm:px-8">
        <div className="mx-auto max-w-xl">
          <RareSeat />
        </div>
      </div>
    </section>
  );
}

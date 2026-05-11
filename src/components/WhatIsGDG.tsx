import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GDG_CITIES, GDG_FACTS, GDG_PILLARS, RCC_CHAPTER } from "../data/gdg";
import { CLUB_FACTS } from "../data/budget";
import { BrandImage } from "./BrandImage";
import { ChapterMarker } from "./ChapterMarker";
import { RareSeat } from "./RareSeat";
import { SplitTitle } from "./SplitTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

/**
 * Cinematic world map: every dot is one of the 1,000+ GDG chapters,
 * placed geographically on a stylized equirectangular world bitmap.
 * Riverside is highlighted as a single yellow, pulsing dot at its true
 * latitude/longitude — concrete proof of global scale.
 *
 * Each row is exactly 40 chars: '#' = land, '.' = water.
 * Columns span -180° to +180° longitude (9° each);
 * rows span +85° to -60° latitude (~5.8° each).
 */
const GRID_COLS = 40;
const GRID_ROWS = 25;
const GRID_GAP = 14;
const DOT_R = 1.6;
const GRID_W = GRID_COLS * GRID_GAP;
const GRID_H = GRID_ROWS * GRID_GAP;

const WORLD_ROWS = [
  "........................................",
  "..............##........................",
  ".......##....####........###############",
  "...##.######..####..####################",
  "..###############...####################",
  "....##########.....#####################",
  "....#########......#####################",
  ".....########......#####################",
  "......#######......########.######.#####",
  ".......######......#######..########....",
  ".........###........######.####.###.....",
  "..........###.......######.####.####....",
  "...........###......####...###..###.....",
  "............###....#######.....####.....",
  ".............####...####.......#####....",
  ".............####...####........######..",
  ".............####....####........#####..",
  "..............###.....###........#####..",
  "..............##......###........#####..",
  ".............###......##.........####...",
  ".............##.......#...........##....",
  ".............##.......................##",
  ".............#..........................",
  "........................................",
  "........................................",
];

// Riverside, CA → ~34°N, -117°W → col 7, row 9 (Southern California)
const RCC_COL = 7;
const RCC_ROW = 9;
const RCC_INDEX = RCC_ROW * GRID_COLS + RCC_COL;
const rccCx = RCC_COL * GRID_GAP + GRID_GAP / 2;
const rccCy = RCC_ROW * GRID_GAP + GRID_GAP / 2;

const COLOR_PALETTE = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

const hashChannel = (i: number) => ((i * 2654435761) >>> 0) % 100;

const dotColor = (i: number): string | null => {
  const h = hashChannel(i);
  if (h < 4) return COLOR_PALETTE[0];
  if (h < 8) return COLOR_PALETTE[1];
  if (h < 12) return COLOR_PALETTE[2];
  if (h < 16) return COLOR_PALETTE[3];
  return null;
};

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
      gsap.set(".js-scale-bignum", { autoAlpha: 0, scale: 0.86, filter: "blur(18px)" });
      gsap.set(".js-scale-chapters", { autoAlpha: 0, y: 16, filter: "blur(8px)" });
      gsap.set(".js-scale-meta", { autoAlpha: 0, y: 10 });
      gsap.set(".js-scale-stat", { autoAlpha: 0, y: 20 });
      gsap.set(".js-cities-band", { autoAlpha: 0 });
      gsap.set(".js-scale-glow", { autoAlpha: 0, scale: 0.6 });
      gsap.set(".js-grid-dot", { autoAlpha: 0 });
      gsap.set(".js-rcc-callout", { autoAlpha: 0 });
      gsap.set(".js-rcc-halo", { autoAlpha: 0 });
      gsap.set(".js-rcc-core", { autoAlpha: 0 });
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

      // ACT II — Scale (cinematic)
      ScrollTrigger.create({
        trigger: ".js-act-ii",
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-scale-glow", {
            autoAlpha: 1,
            scale: 1,
            duration: reduced ? 0.01 : 1.6,
            ease: "power2.out",
          })
            .to(
              ".js-scale-eyebrow",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.45 },
              "-=1.3",
            )
            .to(
              ".js-scale-bignum",
              {
                autoAlpha: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: reduced ? 0.01 : 1.2,
                ease: "power4.out",
              },
              "-=1.0",
            )
            .to(
              ".js-scale-chapters",
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: reduced ? 0.01 : 0.65,
              },
              "-=0.55",
            )
            .to(
              ".js-scale-meta",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.55 },
              "-=0.4",
            )
            .to(
              ".js-cities-band",
              { autoAlpha: 1, duration: reduced ? 0.01 : 0.6 },
              "-=0.3",
            )
            .to(
              ".js-scale-stat",
              {
                autoAlpha: 1,
                y: 0,
                duration: reduced ? 0.01 : 0.55,
                stagger: reduced ? 0 : 0.1,
                ease: "back.out(1.6)",
              },
              "-=0.3",
            )
            .to(
              ".js-grid-dot",
              {
                autoAlpha: 1,
                duration: reduced ? 0.01 : 0.5,
                stagger: reduced
                  ? 0
                  : {
                      amount: 1.6,
                      grid: [GRID_ROWS, GRID_COLS],
                      from: "center",
                    },
                ease: "power2.out",
              },
              "-=0.3",
            )
            .to(
              ".js-rcc-core",
              { autoAlpha: 1, duration: reduced ? 0.01 : 0.4 },
              "-=0.4",
            )
            .to(
              ".js-rcc-halo",
              { autoAlpha: 0.7, duration: reduced ? 0.01 : 0.5 },
              "-=0.3",
            )
            .to(
              ".js-rcc-callout",
              { autoAlpha: 1, duration: reduced ? 0.01 : 0.55 },
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

          // Mega chapter counter
          const chapters = { val: 0 };
          gsap.to(chapters, {
            val: GDG_FACTS.globalChapters,
            duration: reduced ? 0.01 : 2.2,
            delay: 0.5,
            ease: "power2.out",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `${Math.round(chapters.val).toLocaleString()}+`;
              }
            },
          });
          // Countries counter (in the stat tile)
          const countries = { val: 0 };
          gsap.to(countries, {
            val: GDG_FACTS.globalCountries,
            duration: reduced ? 0.01 : 1.6,
            delay: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              if (countriesRef.current) {
                countriesRef.current.textContent = Math.round(countries.val).toString();
              }
            },
          });

          if (!reduced) {
            // Slowly drifting backdrop glow
            gsap.to(".js-scale-glow", {
              rotate: 360,
              duration: 42,
              repeat: -1,
              ease: "none",
              transformOrigin: "50% 50%",
            });
            // Continuous halo pulse on the Riverside chapter dot
            // Animate the SVG attribute `r` so the pulse expands around the
            // circle's true center without relying on browser SVG
            // transform-origin behavior.
            gsap.to(".js-rcc-halo", {
              attr: { r: DOT_R * 9 },
              autoAlpha: 0,
              duration: 1.9,
              repeat: -1,
              ease: "power2.out",
              delay: 1.8,
            });

            // Light, continuous twinkle on a few colored chapter dots
            gsap.to(".js-grid-color", {
              opacity: 0.55,
              duration: 1.6,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              stagger: { each: 0.04, from: "random" },
              delay: 2.4,
            });
            // Marquee scroll
            const track = root.current?.querySelector<HTMLDivElement>(
              ".js-cities-track",
            );
            if (track) {
              gsap.fromTo(
                track,
                { xPercent: 0 },
                {
                  xPercent: -50,
                  duration: 38,
                  ease: "none",
                  repeat: -1,
                },
              );
            }
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

      {/* ACT II — Scale (cinematic full-bleed) */}
      <div className="js-act-ii relative overflow-hidden bg-black">
        {/* Rotating gradient glow */}
        <div
          aria-hidden
          className="js-scale-glow pointer-events-none absolute left-1/2 top-1/2 h-[140vw] w-[140vw] max-h-[1100px] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "conic-gradient(from 200deg at 50% 50%, #4285F4 0deg, #34A853 90deg, #FBBC04 180deg, #EA4335 270deg, #4285F4 360deg)",
          }}
        />
        {/* Subtle starfield veil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0",
            maskImage:
              "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
          }}
        />
        {/* Soft dark vignette at top + bottom edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="relative px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
          <div className="mx-auto max-w-xl">
            <div className="js-scale-eyebrow flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #4285F4 0%, #34A853 33%, #FBBC04 66%, #EA4335 100%)",
                }}
              />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">
                Global reach · {new Date().getFullYear()}
              </p>
            </div>

            {/* Mega counter */}
            <div className="js-scale-bignum mt-6 sm:mt-8">
              <span
                ref={counterRef}
                className="block whitespace-nowrap font-display font-bold leading-[0.86] tabular-nums"
                style={{
                  fontSize: "clamp(3.75rem, 21vw, 11rem)",
                  letterSpacing: "-0.06em",
                  backgroundImage:
                    "linear-gradient(135deg, #4285F4 0%, #34A853 32%, #FBBC04 64%, #EA4335 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 0 60px rgba(66,133,244,0.15)",
                }}
              >
                0+
              </span>
            </div>

            <p className="js-scale-chapters mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
              chapters.
            </p>
            <p className="js-scale-meta mt-3 max-w-md text-sm leading-relaxed text-white/70">
              GDG runs on every populated continent and ships hands-on training inside{" "}
              <span className="text-white">{GDG_FACTS.globalCountries}+ countries</span>{" "}
              every academic year.
            </p>
          </div>

          {/* Cities marquee — full-bleed */}
          <div className="js-cities-band relative mt-12 overflow-hidden border-y border-white/15 bg-black/55 py-4 backdrop-blur-md">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent"
            />
            <div className="js-cities-track flex w-max">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-8 px-4">
                  {GDG_CITIES.map((city, i) => {
                    const isHome = city === "Riverside";
                    return (
                      <span
                        key={`${copy}-${i}`}
                        className={`flex shrink-0 items-center gap-8 font-display text-xl font-semibold tracking-tight sm:text-2xl ${
                          isHome ? "text-gdg-yellow" : "text-white/55"
                        }`}
                      >
                        <span className="whitespace-nowrap">{city}</span>
                        <span
                          aria-hidden
                          className="inline-block h-1 w-1 rounded-full bg-white/30"
                        />
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Stat triplet */}
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
            <div className="js-scale-stat rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-md">
              <p
                className="font-display text-2xl font-bold leading-none tabular-nums sm:text-3xl"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #4285F4, #34A853)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {GDG_FACTS.globalChaptersDisplay}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70">
                Chapters
              </p>
            </div>
            <div className="js-scale-stat rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-md">
              <p className="font-display text-2xl font-bold leading-none tabular-nums text-gdg-yellow sm:text-3xl">
                <span ref={countriesRef}>0</span>
                <span className="text-white/60">+</span>
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70">
                Countries
              </p>
            </div>
            <div className="js-scale-stat rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-md">
              <p
                className="font-display text-2xl font-bold leading-none tabular-nums sm:text-3xl"
                style={{
                  backgroundImage: "linear-gradient(135deg, #FBBC04, #EA4335)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {GDG_FACTS.globalContinents}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70">
                Continents
              </p>
            </div>
          </div>

          {/* Chapter world map — every dot is one of 1,000+ chapters, placed geographically */}
          <div className="relative mx-auto mt-14 w-full max-w-2xl">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              Every dot is a chapter
            </p>
            <svg
              viewBox={`0 0 ${GRID_W} ${GRID_H}`}
              width="100%"
              height="auto"
              role="img"
              aria-label="A dotted world map where each dot marks a Google Developer Groups chapter, with Riverside City College highlighted in yellow"
              className="block"
              preserveAspectRatio="xMidYMid meet"
            >
              {WORLD_ROWS.flatMap((rowStr, row) =>
                rowStr.split("").map((cell, col) => {
                  if (cell !== "#") return null;
                  const i = row * GRID_COLS + col;
                  if (i === RCC_INDEX) return null;
                  const cx = col * GRID_GAP + GRID_GAP / 2;
                  const cy = row * GRID_GAP + GRID_GAP / 2;
                  const color = dotColor(i);
                  const isColored = color !== null;
                  return (
                    <circle
                      key={i}
                      className={`js-grid-dot${isColored ? " js-grid-color" : ""}`}
                      cx={cx}
                      cy={cy}
                      r={isColored ? DOT_R * 1.4 : DOT_R}
                      fill={color ?? "rgba(255,255,255,0.45)"}
                    />
                  );
                }),
              )}

              {/* RCC connecting line — drops into the Pacific (down-left) to clear N. American land dots */}
              <line
                className="js-rcc-callout"
                x1={rccCx}
                y1={rccCy}
                x2={rccCx - 32}
                y2={rccCy + 36}
                stroke="#FBBC04"
                strokeWidth={0.6}
                strokeLinecap="round"
              />
              {/* RCC dot (halo + core) */}
              <circle
                className="js-rcc-halo"
                cx={rccCx}
                cy={rccCy}
                r={DOT_R * 5}
                fill="none"
                stroke="#FBBC04"
                strokeWidth={1.1}
              />
              <circle
                className="js-rcc-core"
                cx={rccCx}
                cy={rccCy}
                r={DOT_R * 2.4}
                fill="#FBBC04"
              />
              {/* RCC label (anchored inside SVG, scales with grid) */}
              <g className="js-rcc-callout">
                <text
                  x={rccCx - 36}
                  y={rccCy + 50}
                  fill="#FBBC04"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                  }}
                >
                  RCC · Riverside, CA
                </text>
                <text
                  x={rccCx - 36}
                  y={rccCy + 61}
                  fill="rgba(255,255,255,0.7)"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                    fontSize: 7,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  1 of {GDG_FACTS.globalChaptersDisplay} chapters
                </text>
              </g>
            </svg>
          </div>

          <p className="js-handoff mx-auto mt-14 max-w-xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl">
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

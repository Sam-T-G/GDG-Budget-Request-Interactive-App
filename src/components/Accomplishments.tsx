import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ACCOMPLISHMENTS, type LogoSlot } from "../data/budget";
import { SectionShell } from "./SectionShell";
import { BrandImage } from "./BrandImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE = import.meta.env.BASE_URL;

const ACCENT_TEXT: Record<"blue" | "red" | "yellow" | "green", string> = {
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

const ACCENT_HEX: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

function LogoTile({
  slot,
  className,
  onWhite,
}: {
  slot: LogoSlot;
  className?: string;
  onWhite?: boolean;
}) {
  return (
    <div
      className={`relative flex aspect-[5/3] items-center justify-center overflow-hidden rounded-2xl ${onWhite ? "bg-white shadow-soft" : "bg-gdg-paper shadow-soft"} ${className ?? ""}`}
    >
      <BrandImage
        src={`${BASE}brand/${slot.file}`}
        alt={`${slot.name} logo`}
        className="max-h-[60%] max-w-[80%] object-contain"
        fallback={
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
            <span
              aria-hidden
              className={`h-1 w-6 rounded-full ${ACCENT_BG[slot.accent]}`}
            />
            <span
              className={`font-display text-lg font-bold leading-none tracking-tight ${ACCENT_TEXT[slot.accent]}`}
            >
              {slot.short}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-gdg-mute">
              {slot.name}
            </span>
          </div>
        }
      />
    </div>
  );
}

export function Accomplishments() {
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const { berkeley, citrushack, industry } = ACCOMPLISHMENTS;

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".js-acc-block", { autoAlpha: 0, y: 24 });
      gsap.set(".js-acc-arrow", { strokeDasharray: "120 120", strokeDashoffset: 120 });
      gsap.set(".js-acc-berkeley-logo", { autoAlpha: 0, scale: 0.9 });
      gsap.set(".js-acc-eecs", { autoAlpha: 0, y: 12 });
      gsap.set(".js-acc-firstplace", { autoAlpha: 0, scale: 0.6, rotate: -12 });
      gsap.set(".js-acc-vs-tile", { autoAlpha: 0, y: 18, scale: 0.94 });
      gsap.set(".js-acc-strike", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".js-acc-rcc-pill", { autoAlpha: 0, y: 10 });
      gsap.set(".js-acc-company", { autoAlpha: 0, y: 18 });
      gsap.set(".js-acc-hairline", { scaleX: 0, transformOrigin: "left center" });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".js-acc-block", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.6,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.18,
          });
        },
      });

      // Berkeley counter
      const berkVal = { v: 0 };
      ScrollTrigger.create({
        trigger: ".js-acc-berkeley",
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(berkVal, {
            v: berkeley.headlineCount,
            duration: reduced ? 0.01 : 1.2,
            ease: "power2.out",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = Math.round(berkVal.v).toString();
              }
            },
          });
          gsap.to(".js-acc-arrow", {
            strokeDashoffset: 0,
            duration: reduced ? 0.01 : 0.8,
            ease: "power2.inOut",
            delay: reduced ? 0 : 0.2,
          });
          gsap.to(".js-acc-berkeley-logo", {
            autoAlpha: 1,
            scale: 1,
            duration: reduced ? 0.01 : 0.6,
            ease: "back.out(1.6)",
            delay: reduced ? 0 : 0.3,
          });
          gsap.to(".js-acc-eecs", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.55,
            ease: "power3.out",
            delay: reduced ? 0 : 0.7,
          });
        },
      });

      // Citrushack
      ScrollTrigger.create({
        trigger: ".js-acc-citrushack",
        start: "top 80%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-acc-firstplace", {
            autoAlpha: 1,
            scale: 1,
            rotate: -4,
            duration: reduced ? 0.01 : 0.7,
            ease: "back.out(2.2)",
          })
            .to(
              ".js-acc-hairline",
              {
                scaleX: 1,
                duration: reduced ? 0.01 : 0.6,
                ease: "power2.inOut",
              },
              "-=0.3",
            )
            .to(
              ".js-acc-vs-tile",
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: reduced ? 0.01 : 0.5,
                stagger: reduced ? 0 : 0.1,
                ease: "back.out(1.6)",
              },
              "-=0.2",
            )
            .to(
              ".js-acc-strike",
              {
                scaleX: 1,
                duration: reduced ? 0.01 : 0.45,
                stagger: reduced ? 0 : 0.1,
                ease: "power2.inOut",
              },
              "-=0.15",
            )
            .to(
              ".js-acc-rcc-pill",
              {
                autoAlpha: 1,
                y: 0,
                duration: reduced ? 0.01 : 0.5,
              },
              "-=0.1",
            );
        },
      });

      // Industry logos
      ScrollTrigger.create({
        trigger: ".js-acc-industry",
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(".js-acc-company", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.55,
            stagger: reduced ? 0 : 0.12,
            ease: "back.out(1.4)",
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <SectionShell
      id="accomplishments"
      chapter={{ number: "05", label: "Track Record" }}
      title="Where our members are going."
      tint="blue"
    >
      <div ref={root} className="space-y-7">
        {/* ── Berkeley ──────────────────────────── */}
        <article className="js-acc-block js-acc-berkeley overflow-hidden rounded-3xl bg-white shadow-lift">
          <div className="flex items-center gap-3 border-b border-gdg-line px-5 py-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-gdg-blue" aria-hidden />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-gdg-mute">
              Transfer outcomes · Class of 2026
            </p>
          </div>

          <div className="px-5 pt-5">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
              <span
                ref={counterRef}
                className="font-display text-7xl font-bold leading-none tabular-nums text-gdg-ink"
              >
                0
              </span>
              <div className="flex items-center gap-3 pb-2">
                <svg
                  width="46"
                  height="14"
                  viewBox="0 0 46 14"
                  aria-hidden
                  className="overflow-visible"
                >
                  <line
                    className="js-acc-arrow"
                    x1="2"
                    y1="7"
                    x2="40"
                    y2="7"
                    stroke={ACCENT_HEX.blue}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    className="js-acc-arrow"
                    d="M34 1 L42 7 L34 13"
                    fill="none"
                    stroke={ACCENT_HEX.blue}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-display text-2xl font-bold leading-none tracking-tight text-gdg-blue">
                  {berkeley.destination}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gdg-ink/80">
              <span className="font-medium text-gdg-ink">{berkeley.program}.</span>{" "}
              {berkeley.transferRateDetail}
            </p>

            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gdg-paper px-4 py-3">
              <span className="font-display text-3xl font-bold tabular-nums text-gdg-blue">
                {berkeley.transferRate}
              </span>
              <span className="font-mono text-[10px] uppercase leading-snug tracking-[0.16em] text-gdg-mute">
                Transfer admit rate
                <br />
                Berkeley CS
              </span>
            </div>

            <div className="js-acc-berkeley-logo mt-4">
              <LogoTile slot={berkeley.schoolLogo} onWhite />
            </div>
          </div>

          <div className="js-acc-eecs mt-5 border-t border-gdg-line bg-gdg-ink px-5 py-5 text-white">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-6 rounded-full bg-gdg-yellow"
              />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-gdg-yellow">
                EECS · admitted
              </p>
            </div>
            <p className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight">
              <span className="text-gdg-yellow">{berkeley.eecs.count}</span> in EECS.
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
              {berkeley.eecs.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/85">{berkeley.eecs.claim}</p>
          </div>
        </article>

        {/* ── Citrushack ────────────────────────── */}
        <article className="js-acc-block js-acc-citrushack relative overflow-hidden rounded-3xl bg-gradient-to-br from-gdg-paper via-white to-white p-5 shadow-lift">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-gdg-yellow" aria-hidden />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-gdg-mute">
              {citrushack.eventName} · Hackathon
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-end gap-4">
            <div
              className="js-acc-firstplace flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-white shadow-lift"
              style={{
                background: `conic-gradient(from 220deg, ${ACCENT_HEX.yellow}, ${ACCENT_HEX.red}, ${ACCENT_HEX.yellow})`,
              }}
            >
              <div className="flex h-[88%] w-[88%] flex-col items-center justify-center rounded-full bg-gdg-ink">
                <span className="font-display text-2xl font-bold leading-none tracking-tight">
                  {citrushack.place}
                </span>
                <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/70">
                  {citrushack.placeLabel}
                </span>
              </div>
            </div>
            <div className="pb-1">
              <p className="font-display text-xl font-bold leading-tight tracking-tight text-gdg-ink">
                {citrushack.eventTagline}
              </p>
            </div>
          </div>

          <div
            className="js-acc-hairline mt-5 h-px w-full bg-gdg-line"
            aria-hidden
          />

          <p className="mt-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gdg-mute">
            Teams beaten
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            {citrushack.schoolsBeaten.map((s) => (
              <div key={s.name} className="js-acc-vs-tile relative">
                <LogoTile slot={s} />
                <span
                  aria-hidden
                  className="js-acc-strike pointer-events-none absolute left-3 right-3 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gdg-red/80"
                />
              </div>
            ))}
          </div>

          <div className="js-acc-rcc-pill mt-4 inline-flex items-center gap-2 rounded-full bg-gdg-ink px-3 py-1.5 text-white shadow-soft">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gdg-green" aria-hidden />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em]">
              Fully RCC team · GDG @ RCC
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gdg-ink/80">{citrushack.detail}</p>
        </article>

        {/* ── Industry ──────────────────────────── */}
        <article className="js-acc-block js-acc-industry overflow-hidden rounded-3xl bg-gdg-ink p-5 text-white shadow-lift">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-gdg-red" aria-hidden />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
              Industry pipeline
            </p>
          </div>
          <p className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight">
            {industry.headline}
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">{industry.detail}</p>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {industry.companies.map((c) => (
              <div key={c.name} className="js-acc-company">
                <LogoTile slot={c} onWhite />
              </div>
            ))}
          </div>
        </article>
      </div>
    </SectionShell>
  );
}

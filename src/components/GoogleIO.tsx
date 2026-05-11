import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GOOGLE_IO } from "../data/budget";
import type { GoogleColor } from "../data/budget";
import { BrandImage } from "./BrandImage";
import { SplitTitle } from "./SplitTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE = import.meta.env.BASE_URL;

const ACCENT_HEX: Record<GoogleColor, string> = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

const ACCENT_BG: Record<GoogleColor, string> = {
  blue: "bg-gdg-blue",
  red: "bg-gdg-red",
  yellow: "bg-gdg-yellow",
  green: "bg-gdg-green",
};

const ACCENT_TEXT: Record<GoogleColor, string> = {
  blue: "text-gdg-blue",
  red: "text-gdg-red",
  yellow: "text-gdg-yellow",
  green: "text-gdg-green",
};

const IO_GRADIENT =
  "linear-gradient(95deg, #4285F4 0%, #34A853 32%, #FBBC04 64%, #EA4335 100%)";

export function GoogleIO() {
  const root = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".js-io-eyebrow", { autoAlpha: 0, y: 10 });
      gsap.set(".js-io-mark", { autoAlpha: 0, scale: 0.94, filter: "blur(8px)" });
      gsap.set(".js-io-year", { autoAlpha: 0, x: -10 });
      gsap.set(".js-io-meta", { autoAlpha: 0, y: 10 });
      gsap.set(".js-io-orb", { autoAlpha: 0, scale: 0.6 });

      gsap.set(".js-hook-head", { autoAlpha: 0, y: 18, filter: "blur(6px)" });
      gsap.set(".js-hook-body", { autoAlpha: 0, y: 10 });

      gsap.set(".js-coverage-tile", { autoAlpha: 0, y: 24, scale: 0.96 });
      gsap.set(".js-attendee-card", { autoAlpha: 0, y: 18 });

      gsap.set(".js-photo-head", { autoAlpha: 0, y: 12 });
      gsap.set(".js-photo-card", { autoAlpha: 0, y: 22, scale: 0.97 });

      gsap.set(".js-speaker-head", { autoAlpha: 0, y: 14 });
      gsap.set(".js-speaker-card", { autoAlpha: 0, y: 24 });

      gsap.set(".js-closing", { autoAlpha: 0, y: 18, filter: "blur(6px)" });

      // HERO timeline
      ScrollTrigger.create({
        trigger: ".js-io-hero",
        start: "top 70%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-io-orb", {
            autoAlpha: 1,
            scale: 1,
            duration: reduced ? 0.01 : 1.4,
            ease: "power2.out",
          })
            .to(
              ".js-io-eyebrow",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.5 },
              "-=1.1",
            )
            .to(
              ".js-io-mark",
              {
                autoAlpha: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: reduced ? 0.01 : 0.9,
              },
              "-=0.6",
            )
            .to(
              ".js-io-year",
              { autoAlpha: 1, x: 0, duration: reduced ? 0.01 : 0.6 },
              "-=0.5",
            )
            .to(
              ".js-io-meta",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.6 },
              "-=0.3",
            );

          if (!reduced && orbRef.current) {
            gsap.to(orbRef.current, {
              rotate: 360,
              duration: 28,
              repeat: -1,
              ease: "none",
            });
          }
        },
      });

      // HOOK
      ScrollTrigger.create({
        trigger: ".js-io-hook",
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-hook-head", {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: reduced ? 0.01 : 0.9,
          }).to(
            ".js-hook-body",
            { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.6 },
            "-=0.4",
          );
        },
      });

      // COVERAGE
      ScrollTrigger.create({
        trigger: ".js-io-coverage",
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(".js-coverage-tile", {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: reduced ? 0.01 : 0.55,
            stagger: reduced ? 0 : 0.08,
            ease: "back.out(1.5)",
          });
        },
      });

      // ATTENDEES
      ScrollTrigger.create({
        trigger: ".js-io-attendees",
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(".js-attendee-card", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.55,
            stagger: reduced ? 0 : 0.1,
            ease: "power3.out",
          });
        },
      });

      // PHOTOS
      ScrollTrigger.create({
        trigger: ".js-io-photos",
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(".js-photo-head", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.55,
            ease: "power3.out",
          });
          gsap.to(".js-photo-card", {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: reduced ? 0.01 : 0.6,
            stagger: reduced ? 0 : 0.07,
            ease: "power3.out",
            delay: reduced ? 0 : 0.2,
          });
        },
      });

      // SPEAKERS
      ScrollTrigger.create({
        trigger: ".js-io-speakers",
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-speaker-head", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.55,
          }).to(
            ".js-speaker-card",
            {
              autoAlpha: 1,
              y: 0,
              duration: reduced ? 0.01 : 0.7,
              stagger: reduced ? 0 : 0.15,
            },
            "-=0.2",
          );
        },
      });

      // CLOSING
      ScrollTrigger.create({
        trigger: ".js-io-closing",
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(".js-closing", {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: reduced ? 0.01 : 0.9,
            ease: "power3.out",
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="google-io"
      aria-label="Google I/O 2026 sponsorship"
      className="relative scroll-mt-20"
    >
      {/* === HERO === */}
      <div className="js-io-hero relative overflow-hidden bg-black">
        {/* Gradient orb */}
        <div
          ref={orbRef}
          aria-hidden
          className="js-io-orb pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full opacity-70 blur-2xl sm:-right-24 sm:h-[32rem] sm:w-[32rem]"
          style={{
            background:
              "conic-gradient(from 200deg at 50% 50%, #4285F4 0deg, #34A853 90deg, #FBBC04 180deg, #EA4335 270deg, #4285F4 360deg)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 80% 0%, rgba(66,133,244,0.18) 0%, transparent 45%), radial-gradient(ellipse at 0% 100%, rgba(234,67,53,0.14) 0%, transparent 50%)",
          }}
        />
        {/* Thin top hairline that connects to prior chapter */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-0 h-px"
          style={{ background: IO_GRADIENT }}
        />

        <div className="relative px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20">
          <div className="mx-auto max-w-xl">
            <div className="js-io-eyebrow flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: IO_GRADIENT }}
              />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-white/70">
                {GOOGLE_IO.eyebrow}
              </p>
            </div>

            <div className="js-io-mark mt-7">
              <h2 className="font-display font-bold leading-[0.92] tracking-tight">
                <span className="block text-[3.25rem] text-white sm:text-7xl">
                  {GOOGLE_IO.display.brand}
                </span>
                <span
                  className="mt-1 block text-[5.5rem] sm:text-[7.5rem]"
                  style={{
                    backgroundImage: IO_GRADIENT,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {GOOGLE_IO.display.mark}
                </span>
              </h2>
              <span className="js-io-year mt-3 inline-block font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {GOOGLE_IO.display.year}
              </span>
            </div>

            <dl className="js-io-meta mt-10 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Keynote
                </dt>
                <dd className="mt-1 text-sm leading-snug text-white/90">
                  {GOOGLE_IO.dates}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Venue
                </dt>
                <dd className="mt-1 text-sm leading-snug text-white/90">
                  {GOOGLE_IO.venue}
                </dd>
              </div>
            </dl>
            <p className="js-io-meta mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-gdg-yellow">
              {GOOGLE_IO.week}
            </p>
          </div>
        </div>
      </div>

      {/* === HOOK === */}
      <div className="js-io-hook relative overflow-hidden bg-gdg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(251,188,4,0.35) 0%, transparent 50%)",
          }}
        />
        <div className="relative px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-xl">
            <SplitTitle
              text={GOOGLE_IO.hook.headline}
              as="h3"
              className="js-hook-head font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl"
            />
            <p className="js-hook-body mt-6 max-w-lg text-base leading-relaxed text-white/80">
              {GOOGLE_IO.hook.body}
            </p>
          </div>
        </div>
      </div>

      {/* === COVERAGE === */}
      <div className="js-io-coverage bg-gdg-ink px-5 pb-12 sm:px-8">
        <div className="mx-auto max-w-xl">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
            What Google is covering
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {GOOGLE_IO.coverage.map((c) => (
              <li
                key={c.title}
                className="js-coverage-tile relative overflow-hidden rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur"
              >
                <span
                  aria-hidden
                  className={`absolute -right-3 -top-3 h-10 w-10 rounded-full opacity-30 blur-md ${ACCENT_BG[c.color]}`}
                />
                <span
                  aria-hidden
                  className="block h-1 w-8 rounded-full"
                  style={{ background: ACCENT_HEX[c.color] }}
                />
                <h4 className="mt-3 font-display text-base font-bold tracking-tight text-white">
                  {c.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{c.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* === ATTENDEES === */}
      <div className="js-io-attendees bg-gdg-ink px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-xl">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
            The two seats
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GOOGLE_IO.attendees.map((a, i) => (
              <div
                key={a.name}
                className="js-attendee-card relative overflow-hidden rounded-2xl bg-white p-4 shadow-lift"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-1"
                  style={{
                    background:
                      i === 0
                        ? "linear-gradient(180deg, #4285F4, #34A853)"
                        : "linear-gradient(180deg, #FBBC04, #EA4335)",
                  }}
                />
                <div className="flex items-center gap-3 pl-2">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-soft"
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(135deg, #4285F4, #34A853)"
                          : "linear-gradient(135deg, #FBBC04, #EA4335)",
                    }}
                    aria-hidden
                  >
                    <span className="font-display text-sm font-bold tracking-wide">
                      {a.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-base font-bold leading-tight text-gdg-ink">
                      {a.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gdg-mute">
                      {a.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === PHOTO CAROUSEL === */}
      <div className="js-io-photos relative bg-white pb-14 pt-16 sm:pt-20">
        <div className="js-photo-head mx-auto max-w-xl px-5 sm:px-8">
          <div className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gdg-ink" />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-gdg-mute">
              The setting
            </p>
          </div>
          <h3 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tight text-gdg-ink sm:text-4xl">
            Mountain View.
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gdg-ink/70">
            Five days inside Google's campus and at Shoreline Amphitheatre. The same ground that hosts every major Google announcement.
          </p>
        </div>

        <div
          className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {GOOGLE_IO.photos.map((p, i) => (
            <figure
              key={p.file}
              className="js-photo-card relative w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl bg-gdg-mist shadow-lift sm:w-[60%]"
            >
              <div className="aspect-[4/5]">
                <BrandImage
                  src={`${BASE}brand/io/${p.file}`}
                  alt={p.caption}
                  className="h-full w-full object-cover"
                  fallback={
                    <div
                      aria-hidden
                      className="flex h-full w-full flex-col items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #4285F4 0%, #34A853 35%, #FBBC04 70%, #EA4335 100%)",
                      }}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                        Photo {i + 1}
                      </span>
                    </div>
                  }
                />
              </div>
              <figcaption className="flex items-start justify-between gap-3 bg-gdg-ink/95 px-4 py-3 text-white">
                <p className="font-display text-sm font-semibold leading-tight">
                  {p.caption}
                </p>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                  {p.credit}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mx-auto mt-3 max-w-xl px-5 font-mono text-[9px] uppercase tracking-[0.16em] text-gdg-mute sm:px-8">
          {GOOGLE_IO.photoCredit}
        </p>
      </div>

      {/* === SPEAKERS === */}
      <div className="js-io-speakers relative overflow-hidden bg-gdg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 15% 25%, #4285F4 0%, transparent 38%), radial-gradient(circle at 85% 75%, #EA4335 0%, transparent 38%)",
          }}
        />
        <div className="relative px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20">
          <div className="mx-auto max-w-xl">
            <div className="js-speaker-head">
              <div className="flex items-center gap-2">
                <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gdg-yellow" />
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
                  On the keynote stage
                </p>
              </div>
              <h3 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl">
                {GOOGLE_IO.speakersHeadline}
              </h3>
            </div>

            <div className="mt-10 space-y-5">
              {GOOGLE_IO.speakers.map((s) => (
                <article
                  key={s.name}
                  className="js-speaker-card overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur"
                >
                  <div className="flex items-start gap-4 p-5">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lift"
                      style={{
                        background:
                          s.accent === "blue"
                            ? "linear-gradient(135deg, #4285F4, #34A853)"
                            : "linear-gradient(135deg, #FBBC04, #EA4335)",
                      }}
                      aria-hidden
                    >
                      <span className="font-display text-base font-bold tracking-wide">
                        {s.initials}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-xl font-bold leading-tight tracking-tight text-white">
                        {s.name}
                      </h4>
                      <p
                        className={`mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${ACCENT_TEXT[s.accent]}`}
                      >
                        {s.title}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-sm leading-relaxed text-white/80">{s.bio}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === CLOSING NAIL === */}
      <div className="js-io-closing relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: IO_GRADIENT }}
        />
        <div aria-hidden className="absolute inset-0 bg-black/55 mix-blend-multiply" />
        <div className="relative px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-xl">
            <p className="js-closing font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl">
              {GOOGLE_IO.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

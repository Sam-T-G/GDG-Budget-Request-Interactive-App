import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RARE_SEAT, type RareSeatPeer } from "../data/gdg";
import { BrandImage } from "./BrandImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE = import.meta.env.BASE_URL;
const RCC_INDEX = 6;

type Tile = { kind: "peer"; peer: RareSeatPeer } | { kind: "rcc" };

export function RareSeat() {
  const root = useRef<HTMLDivElement>(null);

  const tiles: Tile[] = [];
  let peerCursor = 0;
  for (let i = 0; i < 12; i += 1) {
    if (i === RCC_INDEX) {
      tiles.push({ kind: "rcc" });
    } else {
      tiles.push({ kind: "peer", peer: RARE_SEAT.peers[peerCursor] });
      peerCursor += 1;
    }
  }

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".js-rs-eyebrow", { autoAlpha: 0, y: -6 });
      gsap.set(".js-rs-title", { autoAlpha: 0, y: 14 });
      gsap.set(".js-rs-stat", { autoAlpha: 0, y: 14 });
      gsap.set(".js-rs-body", { autoAlpha: 0, y: 10 });
      gsap.set(".js-rs-peer", { autoAlpha: 0, y: 12, scale: 0.92 });
      gsap.set(".js-rs-rcc", { autoAlpha: 0, scale: 0.5 });
      gsap.set(".js-rs-rcc-halo", { autoAlpha: 0, scale: 0.6 });
      gsap.set(".js-rs-foot", { autoAlpha: 0, y: 8 });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.to(".js-rs-eyebrow", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.4,
          })
            .to(
              ".js-rs-title",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.6 },
              "-=0.15",
            )
            .to(
              ".js-rs-stat",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.55 },
              "-=0.3",
            )
            .to(
              ".js-rs-body",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.5 },
              "-=0.25",
            )
            // Peers swarm in dim — they're the room, not the spotlight.
            .to(
              ".js-rs-peer",
              {
                autoAlpha: 0.6,
                y: 0,
                scale: 1,
                duration: reduced ? 0.01 : 0.5,
                stagger: { each: reduced ? 0 : 0.05, from: "random" },
                ease: "back.out(1.3)",
              },
              "-=0.1",
            )
            // RCC lands hard with halo.
            .to(
              ".js-rs-rcc-halo",
              {
                autoAlpha: 1,
                scale: 1,
                duration: reduced ? 0.01 : 0.55,
                ease: "power2.out",
              },
              "+=0.15",
            )
            .to(
              ".js-rs-rcc",
              {
                autoAlpha: 1,
                scale: 1,
                duration: reduced ? 0.01 : 0.6,
                ease: "back.out(2.4)",
              },
              "<",
            )
            .to(
              ".js-rs-foot",
              { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.5 },
              "-=0.1",
            );

          if (!reduced) {
            gsap.to(".js-rs-rcc-halo", {
              scale: 1.12,
              autoAlpha: 0.55,
              duration: 1.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }
        },
      });
    },
    { scope: root },
  );

  return (
    <article
      ref={root}
      className="relative mt-6 overflow-hidden rounded-3xl bg-gdg-ink p-5 text-white shadow-lift sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "conic-gradient(from 220deg, #4285F4, #EA4335, #FBBC04, #34A853, #4285F4)",
        }}
      />

      <div className="js-rs-eyebrow relative flex items-center gap-2">
        <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gdg-yellow" />
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
          {RARE_SEAT.eyebrow}
        </p>
      </div>

      <h3 className="js-rs-title relative mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl">
        {RARE_SEAT.title}
      </h3>

      <div className="js-rs-stat relative mt-5 flex items-baseline gap-3">
        <span className="font-display text-[5rem] font-bold leading-none tabular-nums text-gdg-yellow sm:text-[6rem]">
          {RARE_SEAT.bigStat}
        </span>
        <span className="font-mono text-[11px] uppercase leading-snug tracking-[0.18em] text-white/60">
          {RARE_SEAT.bigStatLabel}
        </span>
      </div>

      <p className="js-rs-body relative mt-4 text-sm leading-relaxed text-white/80">
        {RARE_SEAT.body}
      </p>

      {/* The room — peer university logos surrounding the lit RCC tile. */}
      <div className="relative mt-5 grid grid-cols-3 gap-2">
        {tiles.map((tile, i) =>
          tile.kind === "peer" ? (
            <div
              key={`peer-${i}`}
              className="js-rs-peer flex aspect-[5/3] items-center justify-center overflow-hidden rounded-xl bg-white/90 p-2"
            >
              <BrandImage
                src={`${BASE}brand/${tile.peer.file}`}
                alt={`${tile.peer.name} logo`}
                className="max-h-[70%] max-w-[80%] object-contain"
                fallback={
                  <span className="text-center font-mono text-[9px] uppercase tracking-[0.14em] text-gdg-ink/70">
                    {tile.peer.short}
                  </span>
                }
              />
            </div>
          ) : (
            <div
              key={`rcc-${i}`}
              className="relative flex aspect-[5/3] items-center justify-center"
            >
              <span
                aria-hidden
                className="js-rs-rcc-halo absolute inset-0 rounded-xl bg-gdg-yellow blur-[10px]"
              />
              <div className="js-rs-rcc relative flex h-full w-full items-center justify-center rounded-xl bg-gdg-yellow p-2 text-gdg-ink shadow-lift">
                <BrandImage
                  src={`${BASE}brand/rcc-horizontal.png`}
                  alt="Riverside City College logo"
                  className="max-h-[80%] max-w-[88%] object-contain"
                  fallback={
                    <div className="flex flex-col items-center justify-center">
                      <span className="font-display text-base font-bold leading-none tracking-tight">
                        RCC
                      </span>
                      <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em]">
                        Community college
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
          ),
        )}
      </div>

      <p className="js-rs-foot relative mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
        {RARE_SEAT.footnote}
      </p>
    </article>
  );
}

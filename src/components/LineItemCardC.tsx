import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ExpenseRow, GoogleColor, LineItem } from "../data/budget";
import { haptic } from "../hooks/useHaptic";
import { AnimatedCounter } from "./AnimatedCounter";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

const ACCENT_RING: Record<GoogleColor, string> = {
  blue: "ring-gdg-blue/30",
  red: "ring-gdg-red/30",
  yellow: "ring-gdg-yellow/40",
  green: "ring-gdg-green/30",
};

const fmt = new Intl.NumberFormat("en-US");

type Props = { item: LineItem; index: number };

export function LineItemCardC({ item, index }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const max = Math.max(...item.expenses.map((e) => e.amount));
  const trackMax = max * 2;
  const matchedTotal = item.total * 2;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(el, { autoAlpha: 0, y: 24 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.55,
            ease: "power3.out",
            delay: reduced ? 0 : index * 0.06,
          });
        },
      });
    },
    { scope: root, dependencies: [index] },
  );

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (open) {
        gsap.to(panel, {
          height: "auto",
          autoAlpha: 1,
          duration: reduced ? 0.01 : 0.45,
          ease: "power3.out",
        });
        gsap.fromTo(
          panel.querySelectorAll<HTMLDivElement>(".js-bar-shadow"),
          { width: 0 },
          {
            width: (i) => `${(item.expenses[i].amount * 2 / trackMax) * 100}%`,
            duration: reduced ? 0.01 : 0.8,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.05,
            delay: reduced ? 0 : 0.1,
          },
        );
        gsap.fromTo(
          panel.querySelectorAll<HTMLDivElement>(".js-bar-solid"),
          { width: 0 },
          {
            width: (i) => `${(item.expenses[i].amount / trackMax) * 100}%`,
            duration: reduced ? 0.01 : 0.65,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.05,
            delay: reduced ? 0 : 0.25,
          },
        );
        gsap.fromTo(
          panel.querySelectorAll<HTMLElement>(".js-row-fade"),
          { autoAlpha: 0, y: 6 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.4,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.04,
          },
        );
      } else {
        gsap.to(panel, {
          height: 0,
          autoAlpha: 0,
          duration: reduced ? 0.01 : 0.35,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [open, trackMax] },
  );

  return (
    <div
      ref={root}
      className={`overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ${ACCENT_RING[item.accent]}`}
    >
      <button
        type="button"
        onClick={() => {
          haptic(8);
          setOpen((v) => !v);
        }}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors active:bg-gdg-mist"
        aria-expanded={open}
      >
        <div className={`mt-1 h-10 w-1.5 shrink-0 rounded-full ${ACCENT_BG[item.accent]}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gdg-mute">
              Line {String(index + 1).padStart(2, "0")}
            </p>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gdg-ink/80 ring-1 ${ACCENT_RING[item.accent]}`}
            >
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${ACCENT_BG[item.accent]}`} />
              {item.status}
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight text-gdg-ink">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-gdg-mute">{item.subtitle}</p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <AnimatedCounter
              value={item.total}
              className={`font-display text-3xl font-bold tabular-nums ${ACCENT_TEXT[item.accent]}`}
            />
            <span className="text-xs text-gdg-mute">· {item.attendance}</span>
          </div>
        </div>
        <span
          className="mt-1 inline-block text-gdg-mute transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          ▾
        </span>
      </button>

      <div ref={panelRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="space-y-5 border-t border-gdg-line px-5 py-5">
          <div className="js-row-fade">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
              Overview
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-gdg-ink/85">{item.overview}</p>
          </div>

          <div className="js-row-fade flex items-center justify-between rounded-xl bg-gdg-mist/60 px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gdg-mute">
              Bar legend
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-gdg-ink/80">
                <span aria-hidden className={`h-2 w-4 rounded-full ${ACCENT_BG[item.accent]}`} />
                ASRCC
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gdg-ink/80">
                <span
                  aria-hidden
                  className={`h-2 w-4 rounded-full ${ACCENT_BG[item.accent]} opacity-40`}
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0 3px, transparent 3px 6px)",
                  }}
                />
                +Google match
              </span>
            </div>
          </div>

          <div className="js-row-fade">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
                Expense breakdown
              </p>
              <p className="text-[10px] text-gdg-mute">{item.eventType}</p>
            </div>
            <ul className="space-y-3">
              {item.expenses.map((row, i) => (
                <ExpenseRowC key={`${row.label}-${i}`} row={row} />
              ))}
            </ul>
          </div>

          <div className="js-row-fade flex items-center justify-between rounded-2xl bg-gdg-ink px-4 py-3 text-white">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                Line total
              </span>
              <span
                className={`font-display text-xl font-bold tabular-nums ${ACCENT_TEXT[item.accent]}`}
              >
                ${fmt.format(item.total)}
              </span>
            </div>
            <span aria-hidden className="font-display text-lg text-white/60">
              →
            </span>
            <div className="flex flex-col items-end">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                With match
              </span>
              <span className="font-display text-xl font-bold tabular-nums text-white">
                ${fmt.format(matchedTotal)}+
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseRowC({ row }: { row: ExpenseRow }) {
  return (
    <li>
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-gdg-ink">{row.label}</span>
        <span
          aria-hidden
          className="mx-1 mt-2 flex-1 self-end border-b border-dotted border-gdg-line/80"
        />
        <span className="font-mono text-sm font-medium tabular-nums text-gdg-ink">
          ${fmt.format(row.amount)}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gdg-mute">
          / ${fmt.format(row.amount * 2)}
        </span>
      </div>
      <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-gdg-mist">
        <div
          className={`js-bar-shadow absolute left-0 top-0 h-full ${ACCENT_BG[row.color]} opacity-40`}
          style={{
            width: 0,
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0 3px, transparent 3px 6px)",
          }}
        />
        <div
          className={`js-bar-solid absolute left-0 top-0 h-full ${ACCENT_BG[row.color]}`}
          style={{ width: 0 }}
        />
      </div>
      {(row.math || row.source) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {row.math && (
            <span className="font-mono text-[10px] leading-snug text-gdg-mute">{row.math}</span>
          )}
          {row.source && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-gdg-mist/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gdg-ink/75">
              {row.source}
            </span>
          )}
        </div>
      )}
    </li>
  );
}

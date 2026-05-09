import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { LineItem, GoogleColor } from "../data/budget";
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

type Props = {
  item: LineItem;
  index: number;
};

export function LineItemCard({ item, index }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const max = Math.max(...item.expenses.map((e) => e.amount));

  // Card entrance reveal
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

  // Expand / collapse + bar reveal
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
          panel.querySelectorAll<HTMLDivElement>(".js-bar"),
          { width: 0 },
          {
            width: (i) => {
              const amt = item.expenses[i]?.amount ?? 0;
              return `${(amt / max) * 100}%`;
            },
            duration: reduced ? 0.01 : 0.7,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.06,
            delay: reduced ? 0 : 0.15,
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
    { dependencies: [open, max] },
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
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gdg-mute">
            Line {String(index + 1).padStart(2, "0")} · {item.status}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold leading-snug tracking-tight text-gdg-ink">
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

      <div
        ref={panelRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="space-y-5 border-t border-gdg-line px-5 py-5">
          <div className="js-row-fade">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
              Overview
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-gdg-ink/85">{item.overview}</p>
          </div>

          <div className="js-row-fade">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
              Expected outcome
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-gdg-ink/85">{item.outcome}</p>
          </div>

          <div className="js-row-fade">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
                Expense breakdown
              </p>
              <p className="text-[10px] text-gdg-mute">{item.eventType}</p>
            </div>
            <ul className="space-y-2.5">
              {item.expenses.map((row, i) => (
                <li key={`${row.label}-${i}`} className="space-y-1">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-gdg-ink">{row.label}</span>
                    <span className="font-medium tabular-nums text-gdg-ink">
                      ${fmt.format(row.amount)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gdg-mist">
                    <div className={`js-bar h-full ${ACCENT_BG[row.color]}`} style={{ width: 0 }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="js-row-fade flex items-baseline justify-between rounded-2xl bg-gdg-mist px-4 py-3">
            <span className="text-sm text-gdg-mute">Line total</span>
            <span
              className={`font-display text-xl font-bold tabular-nums ${ACCENT_TEXT[item.accent]}`}
            >
              ${fmt.format(item.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

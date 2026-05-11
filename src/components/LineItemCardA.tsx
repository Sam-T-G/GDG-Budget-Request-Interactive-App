import { useMemo, useRef, useState } from "react";
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

const ACCENT_HEX: Record<GoogleColor, string> = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

const fmt = new Intl.NumberFormat("en-US");

type Props = { item: LineItem; index: number };

const DONUT_R = 38;
const DONUT_C = 2 * Math.PI * DONUT_R;

export function LineItemCardA({ item, index }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [matched, setMatched] = useState(false);
  const [revealedRow, setRevealedRow] = useState<number | null>(null);

  const segments = useMemo(() => {
    let cumulative = 0;
    return item.expenses.map((row) => {
      const portion = row.amount / item.total;
      const length = portion * DONUT_C;
      const offset = (cumulative / item.total) * DONUT_C;
      cumulative += row.amount;
      return { length, offset, color: ACCENT_HEX[row.color] };
    });
  }, [item.expenses, item.total]);

  const max = Math.max(...item.expenses.map((e) => e.amount));
  const trackMax = max * 2;

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
          panel.querySelectorAll<HTMLDivElement>(".js-bar-solid"),
          { width: 0 },
          {
            width: (i) => `${(item.expenses[i].amount / trackMax) * 100}%`,
            duration: reduced ? 0.01 : 0.7,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.05,
            delay: reduced ? 0 : 0.2,
          },
        );
        gsap.fromTo(
          panel.querySelectorAll<SVGCircleElement>(".js-donut-seg"),
          { strokeDashoffset: (i) => segments[i].length },
          {
            strokeDashoffset: 0,
            duration: reduced ? 0.01 : 0.9,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.07,
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
        setMatched(false);
        setRevealedRow(null);
      }
    },
    { dependencies: [open, trackMax] },
  );

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(panel.querySelectorAll<HTMLDivElement>(".js-bar-match"), {
        width: matched
          ? (i) => `${(item.expenses[i].amount / trackMax) * 100}%`
          : 0,
        duration: reduced ? 0.01 : 0.75,
        ease: matched ? "elastic.out(1, 0.6)" : "power3.in",
        stagger: reduced ? 0 : 0.04,
      });
      gsap.to(panel.querySelectorAll<SVGCircleElement>(".js-donut-seg"), {
        strokeWidth: matched ? 14 : 10,
        duration: reduced ? 0.01 : 0.4,
        ease: "power2.out",
      });
    },
    { dependencies: [matched, trackMax] },
  );

  const displayTotal = matched ? item.total * 2 : item.total;

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
        <div className="space-y-5 border-t border-gdg-line bg-gdg-paper/40 px-5 py-5">
          <div className="js-row-fade">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
              Overview
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-gdg-ink/85">{item.overview}</p>
          </div>

          <div className="js-row-fade flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft">
            <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0">
              <circle cx="50" cy="50" r={DONUT_R} fill="none" stroke="#EEF0F4" strokeWidth="10" />
              {segments.map((seg, i) => (
                <circle
                  key={i}
                  className="js-donut-seg"
                  cx="50"
                  cy="50"
                  r={DONUT_R}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="10"
                  strokeDasharray={`${seg.length} ${DONUT_C - seg.length}`}
                  strokeLinecap="butt"
                  transform={`rotate(${(seg.offset / DONUT_C) * 360 - 90} 50 50)`}
                  style={{ strokeDashoffset: seg.length }}
                />
              ))}
              <text
                x="50"
                y="54"
                textAnchor="middle"
                className="fill-gdg-ink font-display"
                style={{ fontSize: "13px", fontWeight: 700 }}
              >
                {item.expenses.length}
              </text>
            </svg>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
                Allocation
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gdg-ink/85">
                {item.expenses.length} expense lines, GSA-grounded.
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-gdg-mute">
                Live total
              </p>
              <p
                className={`font-display text-2xl font-bold tabular-nums ${ACCENT_TEXT[item.accent]}`}
              >
                ${fmt.format(displayTotal)}
                {matched && (
                  <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gdg-mute">
                    matched
                  </span>
                )}
              </p>
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
                <ExpenseRowA
                  key={`${row.label}-${i}`}
                  row={row}
                  revealed={revealedRow === i}
                  onToggle={() => {
                    haptic(4);
                    setRevealedRow((cur) => (cur === i ? null : i));
                  }}
                />
              ))}
            </ul>
          </div>

          <div className="js-row-fade flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
                Google match
              </p>
              <p className="mt-0.5 text-xs text-gdg-ink/75">
                Flip to visualize doubling.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={matched}
              onClick={() => {
                haptic(10);
                setMatched((v) => !v);
              }}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${matched ? ACCENT_BG[item.accent] : "bg-gdg-line"}`}
            >
              <span
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition-transform"
                style={{ transform: matched ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
          </div>

          {item.outcomes && item.outcomes.length > 0 && (
            <div className="js-row-fade">
              <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gdg-mute">
                What this produces
              </p>
              <div className="grid grid-cols-2 gap-2">
                {item.outcomes.map((o, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl bg-white p-3 shadow-soft ring-1 ${ACCENT_RING[item.accent]}`}
                  >
                    <p
                      className={`font-display text-2xl font-bold leading-none tracking-tight ${ACCENT_TEXT[item.accent]}`}
                    >
                      {o.headline}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-snug text-gdg-ink/75">
                      {o.sublabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExpenseRowA({
  row,
  revealed,
  onToggle,
}: {
  row: ExpenseRow;
  revealed: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-baseline gap-2 text-left"
        aria-expanded={revealed}
      >
        <span className="text-sm text-gdg-ink">{row.label}</span>
        <span
          aria-hidden
          className="mx-1 mt-2 flex-1 self-end border-b border-dotted border-gdg-line/80"
        />
        <span className="font-mono text-sm font-medium tabular-nums text-gdg-ink">
          ${fmt.format(row.amount)}
        </span>
        <span
          aria-hidden
          className="ml-1 inline-block text-[10px] text-gdg-mute transition-transform"
          style={{ transform: revealed ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>
      <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-gdg-mist">
        <div className={`js-bar-solid h-full ${ACCENT_BG[row.color]}`} style={{ width: 0 }} />
        <div
          className={`js-bar-match h-full ${ACCENT_BG[row.color]} opacity-50`}
          style={{
            width: 0,
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.45) 0 3px, transparent 3px 6px)",
          }}
        />
      </div>
      {revealed && (row.math || row.source) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-gdg-mist/60 px-3 py-2">
          {row.math && (
            <span className="font-mono text-[11px] leading-snug text-gdg-ink/80">
              {row.math}
            </span>
          )}
          {row.source && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gdg-ink/75 shadow-soft">
              {row.source}
            </span>
          )}
        </div>
      )}
    </li>
  );
}

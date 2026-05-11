import { GOOGLE_MATCH, LINE_ITEMS, TOTAL_REQUEST } from "../data/budget";
import { AnimatedCounter } from "./AnimatedCounter";
import { LineItemCardA } from "./LineItemCardA";
import { LineItemCardB } from "./LineItemCardB";
import { LineItemCardC } from "./LineItemCardC";
import { SectionShell } from "./SectionShell";

const fmt = new Intl.NumberFormat("en-US");
const MATCHED_TOTAL = TOTAL_REQUEST * 2;

const VARIANTS = [
  {
    Component: LineItemCardA,
    label: "Variant A · Ledger that breathes",
    detail: "Donut + per-row math reveal + match toggle + outcomes",
  },
  {
    Component: LineItemCardB,
    label: "Variant B · Stripped",
    detail: "Receipt + per-row math reveal + match toggle",
  },
  {
    Component: LineItemCardC,
    label: "Variant C · Always-on shadow",
    detail: "Ghost bars show the Google match constantly — no toggle",
  },
];

export function TheAsk() {
  return (
    <SectionShell
      id="ask"
      chapter={{ number: "03", label: "The Ask" }}
      title="$12,000 across three programs."
      tint="red"
    >
      <p className="text-sm text-gdg-mute">
        Tap any card to expand. Three presentation variants below — same data, different design.
      </p>

      <div className="mt-5 space-y-6">
        {LINE_ITEMS.map((item, i) => {
          const { Component, label, detail } = VARIANTS[i];
          return (
            <div key={item.id} className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gdg-ink">
                  {label}
                </p>
                <p className="text-[10px] text-gdg-mute">{detail}</p>
              </div>
              <Component item={item} index={i} />
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-baseline justify-between rounded-3xl bg-gdg-ink px-5 py-4 text-white shadow-lift">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/70">
          Total requested
        </span>
        <AnimatedCounter
          value={TOTAL_REQUEST}
          className="font-display text-3xl font-bold tabular-nums text-white"
        />
      </div>

      <div className="mt-3 overflow-hidden rounded-3xl border border-gdg-line bg-white shadow-soft">
        <div className="flex items-center gap-2 bg-gdg-paper px-5 py-2.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gdg-green" />
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-gdg-mute">
            {GOOGLE_MATCH.eyebrow}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="font-display text-xl font-bold leading-tight tracking-tight text-gdg-ink">
            {GOOGLE_MATCH.headline}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gdg-ink/80">{GOOGLE_MATCH.detail}</p>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gdg-ink px-4 py-3 text-white">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-display text-2xl font-bold tabular-nums leading-none">
                ${fmt.format(TOTAL_REQUEST)}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                ASRCC
              </span>
            </div>
            <span aria-hidden className="shrink-0 font-display text-lg font-bold text-white/60">
              →
            </span>
            <div className="flex min-w-0 flex-1 flex-col items-end">
              <span className="font-display text-2xl font-bold tabular-nums leading-none text-gdg-yellow">
                ${fmt.format(MATCHED_TOTAL)}+
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                On-ground
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

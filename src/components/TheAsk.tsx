import { LINE_ITEMS, TOTAL_REQUEST } from "../data/budget";
import { AnimatedCounter } from "./AnimatedCounter";
import { LineItemCard } from "./LineItemCard";
import { SectionShell } from "./SectionShell";

export function TheAsk() {
  return (
    <SectionShell
      id="ask"
      chapter={{ number: "03", label: "The Ask" }}
      title="$12,000 across three programs."
      tint="red"
    >
      <p className="text-sm text-gdg-mute">Tap any card to expand the full expense breakdown.</p>

      <div className="mt-5 space-y-4">
        {LINE_ITEMS.map((item, i) => (
          <LineItemCard key={item.id} item={item} index={i} />
        ))}
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
    </SectionShell>
  );
}

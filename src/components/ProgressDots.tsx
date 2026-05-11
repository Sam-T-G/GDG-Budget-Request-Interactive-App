import { useEffect, useState } from "react";
import { haptic } from "../hooks/useHaptic";

const SECTIONS = [
  { id: "hero", label: "Top", color: "#1F1F1F" },
  { id: "about-gdg", label: "About GDG", color: "#4285F4" },
  { id: "mission", label: "Our Chapter", color: "#34A853" },
  { id: "impact", label: "Impact", color: "#FBBC04" },
  { id: "accomplishments", label: "Track Record", color: "#4285F4" },
  { id: "ask", label: "The Ask", color: "#EA4335" },
  { id: "why", label: "Why ASRCC", color: "#34A853" },
  { id: "qa", label: "Q & A", color: "#EA4335" },
];

export function ProgressDots() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(s.id);
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      aria-label="Section progress"
      className="fixed right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2.5"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              haptic(6);
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            aria-label={`Jump to ${s.label}`}
            className="group flex items-center gap-2"
          >
            <span
              className="hidden rounded-full bg-gdg-ink/85 px-2 py-0.5 text-[10px] font-medium text-white sm:group-hover:inline-block"
            >
              {s.label}
            </span>
            <span
              className="block rounded-full transition-all"
              style={{
                width: isActive ? 12 : 7,
                height: isActive ? 12 : 7,
                background: isActive ? s.color : "#C4C7CB",
                boxShadow: isActive ? `0 0 0 4px ${s.color}26` : "none",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}

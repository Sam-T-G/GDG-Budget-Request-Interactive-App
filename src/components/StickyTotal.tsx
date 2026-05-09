import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TOTAL_REQUEST } from "../data/budget";
import { haptic } from "../hooks/useHaptic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fmt = new Intl.NumberFormat("en-US");

export function StickyTotal() {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(el, { autoAlpha: 0, y: 16 });

      const show = () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: reduced ? 0.01 : 0.3,
          overwrite: "auto",
        });
      const hide = () =>
        gsap.to(el, {
          autoAlpha: 0,
          y: 16,
          duration: reduced ? 0.01 : 0.3,
          overwrite: "auto",
        });

      ScrollTrigger.create({
        start: 350,
        end: "max",
        onEnter: show,
        onLeaveBack: hide,
      });

      // Hide once the Q&A section is in view so it doesn't sit on top of
      // the celebration CTA / footer.
      const qa = document.getElementById("qa");
      if (qa) {
        ScrollTrigger.create({
          trigger: qa,
          start: "top 70%",
          end: "bottom top",
          onEnter: hide,
          onLeaveBack: show,
        });
      }
    },
    { scope: ref },
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        haptic(8);
        document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="fixed bottom-[calc(var(--safe-bottom)+1rem)] left-1/2 z-30 -translate-x-1/2 rounded-full bg-gdg-ink px-5 py-3 text-sm font-medium text-white shadow-lift active:scale-[0.98]"
      style={{ opacity: 0 }}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
        Total ·{" "}
      </span>
      <span className="font-bold tabular-nums">${fmt.format(TOTAL_REQUEST)}</span>
    </button>
  );
}

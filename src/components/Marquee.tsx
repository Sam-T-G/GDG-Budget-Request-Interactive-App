import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  items: string[];
  /** Seconds for one full traversal. Larger = slower. */
  duration?: number;
  /** Background color class, e.g. "bg-gdg-ink" or "bg-gdg-blue". */
  bgClassName?: string;
  /** Text color class. */
  textClassName?: string;
};

const BULLET = "·";

export function Marquee({
  items,
  duration = 28,
  bgClassName = "bg-gdg-ink",
  textClassName = "text-white",
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      const track = root.current?.querySelector<HTMLDivElement>(".js-marquee-track");
      if (!track) return;
      // Two copies inside the track; animate -50% so the second copy slides in seamlessly.
      gsap.fromTo(
        track,
        { xPercent: 0 },
        {
          xPercent: -50,
          duration,
          ease: "none",
          repeat: -1,
        },
      );
    },
    { scope: root },
  );

  const stripe = (
    <div className="flex shrink-0 items-center gap-6 px-3">
      {items.map((it, i) => (
        <span key={i} className="flex shrink-0 items-center gap-6">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em]">{it}</span>
          <span aria-hidden className="text-base opacity-60">
            {BULLET}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={root}
      className={`relative overflow-hidden border-y border-gdg-ink/10 py-3 ${bgClassName} ${textClassName}`}
      aria-hidden
    >
      <div className="js-marquee-track flex w-max">
        {stripe}
        {stripe}
      </div>
    </div>
  );
}

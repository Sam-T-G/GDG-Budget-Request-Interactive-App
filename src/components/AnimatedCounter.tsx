import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fmt = new Intl.NumberFormat("en-US");

type Props = {
  value: number;
  prefix?: string;
  className?: string;
  triggerOnView?: boolean;
  /** Tween duration in seconds. */
  duration?: number;
};

export function AnimatedCounter({
  value,
  prefix = "$",
  className,
  triggerOnView = true,
  duration = 1.4,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const obj = { val: 0 };
      const update = () => {
        el.textContent = `${prefix}${fmt.format(Math.round(obj.val))}`;
      };
      update();

      const run = () =>
        gsap.to(obj, {
          val: value,
          duration: reduced ? 0.01 : duration,
          ease: "power2.out",
          onUpdate: update,
        });

      if (triggerOnView) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: run,
        });
      } else {
        run();
      }
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}0
    </span>
  );
}

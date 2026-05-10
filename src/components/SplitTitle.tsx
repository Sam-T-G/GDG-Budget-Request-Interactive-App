import { useRef, type ElementType, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** Delay (seconds) before stagger fires once the title enters view. */
  delay?: number;
  /** Stagger amount (seconds). Tune lower for short titles. */
  stagger?: number;
  /** If true, animates on mount instead of on scroll into view. */
  immediate?: boolean;
  /** Animation flavor. */
  flavor?: "rise" | "scatter";
};

/**
 * Hand-rolled SplitText replacement: wraps each character in a span and
 * staggers its entrance with GSAP. No paid plugin required.
 */
export function SplitTitle({
  text,
  as: Tag = "h2",
  className,
  style,
  delay = 0,
  stagger = 0.04,
  immediate = false,
  flavor = "rise",
}: Props) {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const chars = el.querySelectorAll<HTMLSpanElement>(".js-char");

      const initial =
        flavor === "scatter"
          ? {
              autoAlpha: 0,
              y: () => gsap.utils.random(-40, 40),
              x: () => gsap.utils.random(-30, 30),
              rotate: () => gsap.utils.random(-25, 25),
              filter: "blur(8px)",
            }
          : { autoAlpha: 0, y: 24, filter: "blur(4px)" };

      gsap.set(chars, initial);

      const animate = () =>
        gsap.to(chars, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          filter: "blur(0px)",
          duration: reduced ? 0.01 : flavor === "scatter" ? 0.9 : 0.7,
          stagger: reduced ? 0 : stagger,
          ease: "power3.out",
          delay,
        });

      if (immediate) {
        animate();
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: animate,
        });
      }
    },
    { scope: root, dependencies: [text, immediate, flavor] },
  );

  // Split into words + whitespace runs. Words become atomic
  // `inline-block whitespace-nowrap` containers so the browser can never break
  // mid-word; whitespace stays as real text nodes so breaks happen at spaces.
  const segments = text.split(/(\s+)/);

  return (
    <Tag ref={root as React.RefObject<HTMLElement>} className={className} style={style}>
      {segments.map((seg, si) => {
        if (seg === "") return null;
        if (/^\s+$/.test(seg)) {
          return (
            <span key={si} aria-hidden style={{ whiteSpace: "pre" }}>
              {seg}
            </span>
          );
        }
        return (
          <span key={si} className="inline-block whitespace-nowrap" aria-hidden>
            {Array.from(seg).map((ch, ci) => (
              <span key={ci} className="js-char inline-block">
                {ch}
              </span>
            ))}
          </span>
        );
      })}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

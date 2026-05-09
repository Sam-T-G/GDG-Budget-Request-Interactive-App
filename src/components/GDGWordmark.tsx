import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];
const LETTERS = ["G", "D", "G"];

type Props = {
  className?: string;
};

export function GDGWordmark({ className }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const letters = root.current?.querySelectorAll<HTMLSpanElement>(".js-gdg-letter");
      if (!letters || letters.length === 0) return;

      gsap.set(letters, {
        y: () => gsap.utils.random(-50, 50),
        x: () => gsap.utils.random(-30, 30),
        rotate: () => gsap.utils.random(-30, 30),
        autoAlpha: 0,
        filter: "blur(10px)",
      });

      gsap.to(letters, {
        x: 0,
        y: 0,
        rotate: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: reduced ? 0.01 : 0.9,
        ease: "power4.out",
        stagger: reduced ? 0 : 0.08,
      });

      if (!reduced) {
        // Slow color cycling
        letters.forEach((letter, i) => {
          gsap.to(letter, {
            color: COLORS[(i + 1) % COLORS.length],
            duration: 2,
            delay: 1.5 + i * 0.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      <div className="flex items-baseline gap-1 font-display text-[5.5rem] font-bold leading-none tracking-tight sm:text-[7rem]">
        {LETTERS.map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className="js-gdg-letter inline-block"
            style={{ color: COLORS[i % COLORS.length], willChange: "transform" }}
          >
            {letter}
          </span>
        ))}
      </div>
      <span className="sr-only">GDG</span>
    </div>
  );
}

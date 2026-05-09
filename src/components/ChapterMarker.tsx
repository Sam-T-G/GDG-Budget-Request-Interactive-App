import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  number: string;
  label: string;
  color: "blue" | "red" | "yellow" | "green" | "ink";
};

const COLOR: Record<Props["color"], string> = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
  ink: "#1F1F1F",
};

export function ChapterMarker({ number, label, color }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".js-cm-num", { autoAlpha: 0, x: -8 });
      gsap.set(".js-cm-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".js-cm-label", { autoAlpha: 0, x: -8 });
      gsap.set(".js-cm-dot", { autoAlpha: 0, scale: 0 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".js-cm-num", { autoAlpha: 1, x: 0, duration: reduced ? 0.01 : 0.4 })
            .to(".js-cm-rule", { scaleX: 1, duration: reduced ? 0.01 : 0.5 }, "-=0.1")
            .to(".js-cm-dot", { autoAlpha: 1, scale: 1, duration: reduced ? 0.01 : 0.3, ease: "back.out(2.4)" }, "-=0.2")
            .to(".js-cm-label", { autoAlpha: 1, x: 0, duration: reduced ? 0.01 : 0.4 }, "-=0.3");
        },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mx-auto flex max-w-xl items-center gap-3 px-5 pt-8 sm:px-8">
      <span className="js-cm-num font-mono text-[11px] font-medium tracking-[0.2em] text-gdg-mute">
        {number}
      </span>
      <span
        className="js-cm-rule h-px flex-1 origin-left"
        style={{ background: `linear-gradient(90deg, ${COLOR[color]}, ${COLOR[color]}00)` }}
      />
      <span
        className="js-cm-dot h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: COLOR[color] }}
      />
      <span className="js-cm-label font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gdg-ink">
        {label}
      </span>
    </div>
  );
}

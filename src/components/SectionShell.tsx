import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChapterMarker } from "./ChapterMarker";
import { SplitTitle } from "./SplitTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tint = "blue" | "red" | "yellow" | "green" | "ink";

type Props = {
  id: string;
  chapter: { number: string; label: string };
  title: string;
  children: ReactNode;
  tint?: Tint;
};

export function SectionShell({ id, chapter, title, children, tint = "ink" }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(".js-section-body", { autoAlpha: 0, y: 24 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".js-section-body", {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.7,
            ease: "power3.out",
            delay: reduced ? 0 : 0.15,
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className="scroll-mt-20">
      <ChapterMarker number={chapter.number} label={chapter.label} color={tint} />
      <div className="px-5 pb-20 pt-4 sm:px-8">
        <div className="mx-auto max-w-xl">
          <SplitTitle
            text={title}
            as="h2"
            className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-gdg-ink sm:text-5xl"
          />
          <div className="js-section-body mt-7">{children}</div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SECTION_IDS = [
  "hero",
  "about-gdg",
  "mission",
  "ask",
  "impact",
  "accomplishments",
  "why",
  "qa",
];

/**
 * Document-spanning ribbon. The path is drawn progressively bound to scroll
 * progress. A "comet" head sits at the current draw tip, glowing in proportion
 * to scroll velocity. Each section emits a ripple from the comet as it enters
 * view, so the ribbon's energy hands off into the section.
 */
export function GlobalRibbon() {
  const root = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const rippleRef = useRef<SVGCircleElement>(null);

  // Build / rebuild the document-tall path whenever the body resizes
  // (line-item accordions expand, fonts settle, etc.).
  useEffect(() => {
    const update = () => {
      const path = pathRef.current;
      const svg = svgRef.current;
      const wrap = root.current;
      if (!path || !svg || !wrap) return;

      const w = window.innerWidth;
      const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      wrap.style.height = `${h}px`;

      // Snake path from top → bottom, weaving across viewport width.
      const left = w * 0.12;
      const right = w * 0.88;
      const center = w * 0.5;

      const d = [
        `M ${center} 0`,
        `C ${right} ${h * 0.05}, ${left} ${h * 0.13}, ${right * 0.9} ${h * 0.21}`,
        `S ${left * 1.5} ${h * 0.34}, ${right * 0.95} ${h * 0.43}`,
        `S ${left * 1.1} ${h * 0.55}, ${right * 0.7} ${h * 0.62}`,
        `S ${left} ${h * 0.74}, ${right * 0.88} ${h * 0.82}`,
        `S ${left * 1.6} ${h * 0.92}, ${center} ${h - 4}`,
      ].join(" ");

      path.setAttribute("d", d);
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len} ${len}`;
      path.dataset.length = String(len);

      ScrollTrigger.refresh();
    };

    update();

    let raf = 0;
    const queue = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(queue);
    ro.observe(document.body);
    window.addEventListener("resize", queue);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", queue);
      cancelAnimationFrame(raf);
    };
  }, []);

  useGSAP(
    () => {
      const path = pathRef.current;
      const comet = cometRef.current;
      const glow = glowRef.current;
      const ripple = rippleRef.current;
      if (!path || !comet || !glow || !ripple) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Wait one frame so the path has its `d` set before measuring.
      requestAnimationFrame(() => {
        const lenAttr = path.dataset.length;
        const totalLen = lenAttr ? parseFloat(lenAttr) : path.getTotalLength();

        if (reduced) {
          path.style.strokeDashoffset = "0";
          const tip = path.getPointAtLength(totalLen);
          comet.setAttribute("transform", `translate(${tip.x}, ${tip.y})`);
          return;
        }

        // Initial: nothing drawn, comet at start.
        path.style.strokeDashoffset = String(totalLen);
        const start = path.getPointAtLength(0.1);
        comet.setAttribute("transform", `translate(${start.x}, ${start.y})`);

        ScrollTrigger.create({
          start: 0,
          end: "max",
          scrub: 0.6,
          onUpdate: (self) => {
            const len = parseFloat(path.dataset.length || "0") || path.getTotalLength();
            const drawn = len * self.progress;
            path.style.strokeDashoffset = String(len - drawn);

            const safe = Math.max(0.1, Math.min(len - 0.1, drawn));
            const point = path.getPointAtLength(safe);
            comet.setAttribute("transform", `translate(${point.x}, ${point.y})`);

            // Glow scales with absolute scroll velocity (px/s).
            const vel = Math.min(Math.abs(self.getVelocity()) / 1000, 2.5);
            const r = 14 + vel * 14;
            const op = 0.35 + Math.min(vel * 0.25, 0.45);
            glow.setAttribute("r", String(r));
            glow.style.opacity = String(op);
          },
        });

        // Section "ripples" — each section briefly pulses a ring at the
        // comet's current position when it enters/leaves view, signalling
        // the ribbon's hand-off into that section.
        SECTION_IDS.forEach((id) => {
          const target = document.getElementById(id);
          if (!target) return;
          const fire = () => {
            gsap.fromTo(
              ripple,
              { attr: { r: 4 }, opacity: 0.6 },
              {
                attr: { r: 38 },
                opacity: 0,
                duration: 0.9,
                ease: "power2.out",
                overwrite: "auto",
              },
            );
          };
          ScrollTrigger.create({
            trigger: target,
            start: "top 65%",
            onEnter: fire,
            onEnterBack: fire,
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-[25] overflow-hidden"
      style={{ height: "100%" }}
    >
      <svg
        ref={svgRef}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="presentation"
      >
        <defs>
          <linearGradient id="grbn-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="33%" stopColor="#EA4335" />
            <stop offset="66%" stopColor="#FBBC04" />
            <stop offset="100%" stopColor="#34A853" />
          </linearGradient>
          <radialGradient id="grbn-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBC04" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#EA4335" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          ref={pathRef}
          stroke="url(#grbn-grad)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.55"
          strokeLinecap="round"
        />

        <g ref={cometRef}>
          <circle ref={glowRef} r="14" fill="url(#grbn-glow)" opacity="0.4" />
          <circle
            ref={rippleRef}
            r="4"
            fill="none"
            stroke="#FBBC04"
            strokeWidth="1.5"
            opacity="0"
          />
          <circle r="3.5" fill="#FFFFFF" />
          <circle r="2.2" fill="#FBBC04" />
        </g>
      </svg>
    </div>
  );
}

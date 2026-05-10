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
 * progress with a heavy scrub for "lag" feel. A comet head sits at the current
 * draw tip, glowing in proportion to scroll velocity. Each section emits a
 * ripple from the comet as it enters view.
 *
 * Sits at z-0 — behind every section/card. Visible in the gaps where
 * section content is transparent.
 */
export function GlobalRibbon() {
  const root = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const echoRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const rippleRef = useRef<SVGCircleElement>(null);

  // Path with distinct movement zones — fast dives, horizontal sweeps,
  // long lazy stretches, and sharp pivots so momentum feels varied.
  const buildPath = (w: number, h: number) => {
    const L = w * 0.08;
    const M = w * 0.5;
    const R = w * 0.92;
    return [
      `M ${M} 0`,
      // dive right and bounce
      `C ${R * 1.1} ${h * 0.02}, ${R * 1.15} ${h * 0.05}, ${R} ${h * 0.08}`,
      // hard sweep left across viewport
      `C ${R * 0.5} ${h * 0.1}, ${L * 0.3} ${h * 0.12}, ${L} ${h * 0.15}`,
      // arc back to far right (loop-back pivot)
      `C ${L * 0.2} ${h * 0.2}, ${R * 1.2} ${h * 0.21}, ${R * 0.88} ${h * 0.25}`,
      // cascade down + drift left
      `C ${R * 0.5} ${h * 0.3}, ${R * 0.35} ${h * 0.34}, ${L * 1.4} ${h * 0.38}`,
      // long horizontal lag — nearly flat right
      `C ${L * 0.4} ${h * 0.4}, ${R * 1.1} ${h * 0.43}, ${R * 0.92} ${h * 0.48}`,
      // diagonal swing down-left with momentum
      `C ${R * 0.4} ${h * 0.54}, ${L * 0.5} ${h * 0.56}, ${L * 0.55} ${h * 0.62}`,
      // bounce hard right
      `C ${L * 1.6} ${h * 0.67}, ${R * 1.15} ${h * 0.65}, ${R * 0.72} ${h * 0.72}`,
      // settle leftward
      `C ${R * 0.3} ${h * 0.78}, ${L * 0.4} ${h * 0.82}, ${L * 0.8} ${h * 0.86}`,
      // final swoop home to center-bottom
      `C ${L * 1.9} ${h * 0.93}, ${R * 0.8} ${h * 0.96}, ${M} ${h - 4}`,
    ].join(" ");
  };

  useEffect(() => {
    const update = () => {
      const path = pathRef.current;
      const echo = echoRef.current;
      const svg = svgRef.current;
      const wrap = root.current;
      if (!path || !svg || !wrap) return;

      const w = window.innerWidth;
      const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      wrap.style.height = `${h}px`;

      const d = buildPath(w, h);
      path.setAttribute("d", d);
      echo?.setAttribute("d", d);
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
      const echo = echoRef.current;
      const comet = cometRef.current;
      const glow = glowRef.current;
      const ripple = rippleRef.current;
      if (!path || !comet || !glow || !ripple) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      requestAnimationFrame(() => {
        const lenAttr = path.dataset.length;
        const totalLen = lenAttr ? parseFloat(lenAttr) : path.getTotalLength();

        if (reduced) {
          path.style.strokeDashoffset = "0";
          if (echo) echo.style.opacity = "0.18";
          const tip = path.getPointAtLength(totalLen);
          comet.setAttribute("transform", `translate(${tip.x}, ${tip.y})`);
          return;
        }

        path.style.strokeDashoffset = String(totalLen);
        const start = path.getPointAtLength(0.1);
        comet.setAttribute("transform", `translate(${start.x}, ${start.y})`);

        ScrollTrigger.create({
          start: 0,
          end: "max",
          // Heavier scrub so the ribbon "lags behind" the user's scroll —
          // momentum feels physical, not painted on.
          scrub: 1.1,
          onUpdate: (self) => {
            const len = parseFloat(path.dataset.length || "0") || path.getTotalLength();
            const drawn = len * self.progress;
            path.style.strokeDashoffset = String(len - drawn);

            const safe = Math.max(0.1, Math.min(len - 0.1, drawn));
            const point = path.getPointAtLength(safe);
            comet.setAttribute("transform", `translate(${point.x}, ${point.y})`);

            const vel = Math.min(Math.abs(self.getVelocity()) / 1000, 2.5);
            const r = 14 + vel * 16;
            const op = 0.35 + Math.min(vel * 0.3, 0.5);
            glow.setAttribute("r", String(r));
            glow.style.opacity = String(op);
          },
        });

        SECTION_IDS.forEach((id) => {
          const target = document.getElementById(id);
          if (!target) return;
          const fire = () => {
            gsap.fromTo(
              ripple,
              { attr: { r: 4 }, opacity: 0.7 },
              {
                attr: { r: 44 },
                opacity: 0,
                duration: 1,
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
      className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
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

        {/* Echo trail — full path drawn very faintly so the user sees where
            the ribbon will eventually go, like a planned trajectory. */}
        <path
          ref={echoRef}
          stroke="url(#grbn-grad)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.12"
          strokeLinecap="round"
        />

        <path
          ref={pathRef}
          stroke="url(#grbn-grad)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
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

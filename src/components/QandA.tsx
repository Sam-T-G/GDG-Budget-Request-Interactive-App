import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import { QA_ITEMS, CLUB_FACTS } from "../data/budget";
import { SectionShell } from "./SectionShell";
import { haptic } from "../hooks/useHaptic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

function QARow({ index, question, answer }: { index: number; question: string; answer: string }) {
  const [open, setOpen] = useState(index === 0);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Entrance reveal
  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(el, { autoAlpha: 0, y: 12 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.45,
            ease: "power3.out",
            delay: reduced ? 0 : index * 0.05,
          });
        },
      });
    },
    { scope: cardRef, dependencies: [index] },
  );

  // Initial open state for first card needs to be expanded (no animation)
  useEffect(() => {
    const panel = panelRef.current;
    if (panel && open && index === 0) {
      gsap.set(panel, { height: "auto", autoAlpha: 1 });
    }
  }, [index, open]);

  // Expand / collapse
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(panel, {
        height: open ? "auto" : 0,
        autoAlpha: open ? 1 : 0,
        duration: reduced ? 0.01 : 0.35,
        ease: "power3.out",
      });
    },
    { dependencies: [open] },
  );

  return (
    <div ref={cardRef} className="overflow-hidden rounded-2xl bg-white shadow-soft">
      <button
        type="button"
        onClick={() => {
          haptic(8);
          setOpen((v) => !v);
        }}
        className="flex w-full items-start gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <span
          className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold text-white"
          style={{ background: GOOGLE_COLORS[index % GOOGLE_COLORS.length] }}
          aria-hidden
        >
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium leading-snug text-gdg-ink">{question}</span>
        <span
          className="text-gdg-mute transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          ▾
        </span>
      </button>
      <div ref={panelRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <p className="border-t border-gdg-line px-4 py-4 text-sm leading-relaxed text-gdg-ink/85">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function QandA() {
  const [thanked, setThanked] = useState(false);

  function fireConfetti() {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: GOOGLE_COLORS,
      scalar: 0.9,
    });
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.6 },
      colors: GOOGLE_COLORS,
      startVelocity: 35,
      scalar: 0.7,
    });
  }

  return (
    <SectionShell
      id="qa"
      chapter={{ number: "07", label: "Q & A" }}
      title="Anticipated committee questions."
      tint="red"
    >
      <p className="text-sm text-gdg-mute">
        The hearing is a 15-minute Q&amp;A. Tap any question to see the prepared answer.
      </p>

      <div className="mt-5 space-y-2.5">
        {QA_ITEMS.map((qa, i) => (
          <QARow key={i} index={i} question={qa.question} answer={qa.answer} />
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-gdg-paper p-6 text-center shadow-soft">
        <p className="font-display text-lg font-semibold text-gdg-ink">
          Thank you for considering our request.
        </p>
        <p className="mt-1 text-sm text-gdg-mute">
          Questions after the hearing? {CLUB_FACTS.primaryContact} ·{" "}
          <a href={`mailto:${CLUB_FACTS.primaryEmail}`} className="text-gdg-blue underline">
            {CLUB_FACTS.primaryEmail}
          </a>
        </p>
        <button
          type="button"
          onClick={() => {
            haptic([6, 30, 6]);
            fireConfetti();
            setThanked(true);
          }}
          className="mt-4 rounded-full bg-gdg-ink px-5 py-2.5 text-sm font-medium text-white shadow-lift active:scale-[0.98]"
        >
          {thanked ? "🎉 Thanks again" : "Tap to celebrate 🎉"}
        </button>
      </div>
    </SectionShell>
  );
}

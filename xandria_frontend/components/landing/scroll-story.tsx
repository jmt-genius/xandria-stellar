"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    quote: "When you buy a book on Kindle, you own a license. Amazon can revoke it.",
    source: "Terms of Service, Section 3",
    emphasis: "You don't own anything.",
  },
  {
    quote: "85% of authors earn less than $1,000 per year from their writing.",
    source: "Authors Guild Survey",
    emphasis: "Creators are invisible.",
  },
  {
    quote: "Xandria records every purchase on the Stellar blockchain. 5 seconds. $0.00001.",
    source: null,
    emphasis: "We built something different.",
    isAccent: true,
  },
];

function StoryFrame({
  quote,
  source,
  emphasis,
  isAccent,
  index,
}: {
  quote: string;
  source: string | null;
  emphasis: string;
  isAccent?: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [40, 0, 0, -40]);
  const lineScale = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <div ref={ref} className="h-[80vh] md:h-[85vh] flex items-center justify-center px-6">
      <motion.div
        style={{ opacity, y }}
        className="max-w-2xl text-center"
      >
        {/* Step indicator */}
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-muted block mb-8">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Quote */}
        <p className={`font-display text-[clamp(1.3rem,3.5vw,2rem)] leading-[1.4] tracking-wide mb-6 ${
          isAccent ? "text-accent" : "text-text-primary"
        }`}>
          &ldquo;{quote}&rdquo;
        </p>

        {/* Source */}
        {source && (
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-muted mb-8">
            &mdash; {source}
          </p>
        )}

        {/* Emphasis line */}
        <motion.div
          style={{ scaleX: lineScale }}
          className="mx-auto w-12 h-[1px] bg-accent mb-6 origin-center"
        />

        <p className={`font-body text-sm tracking-wide ${
          isAccent ? "text-accent/80" : "text-text-secondary"
        }`}>
          {emphasis}
        </p>
      </motion.div>
    </div>
  );
}

export default function ScrollStory() {
  return (
    <section className="relative">
      {/* Vertical line threading through */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-border/30 hidden md:block" />

      {steps.map((step, i) => (
        <StoryFrame key={i} {...step} index={i} />
      ))}
    </section>
  );
}

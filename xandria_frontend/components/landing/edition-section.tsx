"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const editions = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", mint: "0047", color: "#8B6914" },
  { title: "1984", author: "George Orwell", mint: "0183", color: "#4A5568" },
  { title: "Meditations", author: "Marcus Aurelius", mint: "0012", color: "#6B4226" },
];

function EditionCard({ title, author, mint, color, index }: {
  title: string;
  author: string;
  mint: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -5 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative"
    >
      {/* Book cover mock */}
      <div
        className="relative aspect-[2/3] rounded-lg overflow-hidden"
        style={{
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {/* Cover background with subtle gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(145deg, ${color}22, ${color}08, #0A0A08)`,
          }}
        />

        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 70%, ${color}40 0%, transparent 50%), radial-gradient(circle at 70% 30%, ${color}30 0%, transparent 40%)`,
          }}
        />

        {/* Top decorative line */}
        <div className="absolute top-6 left-6 right-6 h-[1px] opacity-20"
          style={{ background: color }}
        />

        {/* Title on cover */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
          <p className="font-display text-lg md:text-xl text-text-primary/80 leading-tight tracking-wide">
            {title}
          </p>
          <div className="w-8 h-[1px] my-3 opacity-30" style={{ background: color }} />
          <p className="font-body text-xs text-text-secondary/60">
            {author}
          </p>
        </div>

        {/* Mint number — the collectible soul */}
        <div className="absolute bottom-4 right-4">
          <span
            className="font-mono text-[11px] tracking-wider"
            style={{
              color: "#D9A963",
              opacity: 0.85,
              textShadow: "0 0 12px rgba(217,169,99,0.4)",
            }}
          >
            No. {mint}
          </span>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-6 left-6 right-6 h-[1px] opacity-10"
          style={{ background: color }}
        />

        {/* Hover: warm spine light */}
        <div className="absolute inset-y-0 left-0 w-[2px] bg-accent/0 group-hover:bg-accent/60 transition-colors duration-500" />

        {/* Hover: card lift shadow */}
        <div className="absolute inset-0 shadow-none group-hover:shadow-[0_12px_48px_rgba(217,169,99,0.08)] transition-shadow duration-500 rounded-lg" />
      </div>

      {/* Below cover info */}
      <div className="mt-4">
        <p className="font-display text-base text-text-primary tracking-wide">{title}</p>
        <p className="font-body text-xs text-text-muted mt-1">{author}</p>
      </div>
    </motion.div>
  );
}

export default function EditionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const cardsX = useTransform(scrollYProgress, [0.1, 0.5], [40, 0]);

  return (
    <section ref={ref} className="relative py-24 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[1px] bg-accent" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent">
                Collectible editions
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(2rem,5vw,3.5rem)] text-text-primary leading-[1.1] tracking-wide mb-6"
            >
              Every copy is{" "}
              <span className="landing-shimmer-text">numbered</span>.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body text-base text-text-secondary leading-relaxed mb-8 max-w-md"
            >
              Each purchase mints a unique edition with an AI-generated cover
              and a mint number stamped on-chain. Your copy is yours alone &mdash;
              a collectible artifact, not a fungible file.
            </motion.p>

            {/* Details list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              {[
                ["Mint number", "Unique per edition, derived on-chain"],
                ["AI covers", "Generated in a unified Xandria visual style"],
                ["Limited runs", "Authors control supply — some editions are finite"],
              ].map(([label, desc]) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <span className="font-body text-sm text-text-primary">{label}</span>
                    <span className="font-body text-sm text-text-muted"> &mdash; {desc}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Edition cards */}
          <motion.div
            style={{ x: cardsX }}
            className="grid grid-cols-3 gap-4 md:gap-6"
          >
            {editions.map((edition, i) => (
              <EditionCard key={edition.title} {...edition} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

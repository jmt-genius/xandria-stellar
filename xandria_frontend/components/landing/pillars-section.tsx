"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "Discover",
    subtitle: "A marketplace of conviction",
    body: "Browse books that matter. Each title lives on-chain with transparent pricing, no middlemen, and AI-generated covers that make every edition a collectible artifact.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="18" cy="18" r="12" />
        <line x1="27" y1="27" x2="36" y2="36" />
        <circle cx="18" cy="18" r="4" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Own",
    subtitle: "Assets, not licenses",
    body: "Every purchase mints a unique edition recorded on the Stellar blockchain. Your wallet holds the proof. No platform can revoke it. No company can take it back.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="6" y="10" width="28" height="22" rx="2" />
        <path d="M6 16h28" />
        <circle cx="20" cy="26" r="3" />
        <path d="M14 6h12" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Read",
    subtitle: "Intelligence, not just consumption",
    body: "A full-screen reader with DRM protection, page-turn animations, and an AI assistant that can summarize chapters, explain themes, and argue ideas with you.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4 6v28l16-8 16 8V6H4z" />
        <line x1="12" y1="14" x2="28" y2="14" />
        <line x1="12" y1="19" x2="24" y2="19" />
        <line x1="12" y1="24" x2="20" y2="24" />
      </svg>
    ),
  },
];

export default function PillarsSection() {
  return (
    <section className="relative py-24 md:py-40 px-6">
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-[1px] bg-accent" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent">
            How it works
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[clamp(2rem,5vw,3.5rem)] text-text-primary leading-[1.1] tracking-wide"
        >
          Three acts.
          <br />
          <span className="text-text-secondary">One library.</span>
        </motion.h2>
      </div>

      {/* Pillars grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.number}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="group relative p-8 md:p-10 border-b md:border-b-0 md:border-r border-border last:border-r-0 last:border-b-0"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(217,169,99,0.03),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              {/* Number */}
              <span className="font-mono text-[11px] tracking-[0.2em] text-text-muted block mb-8">
                {pillar.number}
              </span>

              {/* Icon */}
              <div className="text-accent/50 group-hover:text-accent transition-colors duration-500 mb-8">
                {pillar.icon}
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl md:text-3xl text-text-primary mb-2 tracking-wide">
                {pillar.title}
              </h3>

              {/* Subtitle */}
              <p className="font-body text-sm text-accent mb-6">
                {pillar.subtitle}
              </p>

              {/* Body */}
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                {pillar.body}
              </p>
            </div>

            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-accent/0 group-hover:bg-accent/30 transition-colors duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedNumber({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const duration = 1800;
      const start = Date.now();
      const step = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplay(Math.floor(eased * value));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { value: 5, suffix: "s", label: "Settlement finality", detail: "Not minutes. Not hours. Seconds." },
  { value: 100000, suffix: "+", label: "Transactions per ledger", detail: "Capacity that scales with demand." },
  { value: 0, suffix: "$0.00001", label: "Cost per transaction", detail: "Micro-purchases, finally viable.", isCustom: true },
];

const features = [
  {
    title: "Proof of Agreement",
    body: "Stellar uses Federated Byzantine Agreement — no mining, no staking, no wasted energy. Validators agree through trust, not competition.",
  },
  {
    title: "Native Asset Issuance",
    body: "Every book edition is a Stellar asset. Issued for $0.06, no smart contract deployment required. Protocol-level scarcity controls.",
  },
  {
    title: "Built-in DEX",
    body: "Path payments let readers pay in any currency. The network converts automatically. Price in XLM, pay in anything.",
  },
  {
    title: "Soroban Contracts",
    body: "Rust-based WASM smart contracts with rent-based storage. Sustainable state management — no forever-growing chain bloat.",
  },
];

export default function StellarSection() {
  return (
    <section className="relative py-24 md:py-40 px-6 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(217,169,99,0.04),transparent_70%)]" />
        {/* Horizontal lines */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 80px)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-[1px] bg-accent" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent">
            Infrastructure
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[clamp(2rem,5vw,3.5rem)] text-text-primary leading-[1.1] tracking-wide mb-4"
        >
          Why Stellar.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-base text-text-secondary max-w-lg mb-16 md:mb-24 leading-relaxed"
        >
          Not every blockchain deserves a bookstore. Stellar earned it — with
          speed, sustainability, and economics that make micro-ownership real.
        </motion.p>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 mb-20 md:mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="text-center md:border-r border-border last:border-r-0 py-4"
            >
              <div className="font-mono text-[clamp(2.5rem,6vw,4rem)] text-accent landing-stat-glow mb-2">
                {stat.isCustom ? (
                  <span>$0.00001</span>
                ) : (
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} delay={i * 200} />
                )}
              </div>
              <div className="font-body text-sm text-text-primary mb-1">{stat.label}</div>
              <div className="font-body text-xs text-text-muted">{stat.detail}</div>
            </motion.div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group bg-background p-8 md:p-12 relative"
            >
              {/* Hover warmth */}
              <div className="absolute inset-0 bg-[rgba(217,169,99,0.015)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="font-display text-xl text-text-primary mb-3 tracking-wide">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-text-secondary leading-relaxed">
                  {feature.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

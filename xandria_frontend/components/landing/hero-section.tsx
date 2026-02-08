"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section ref={containerRef} className="relative h-[110vh] overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(217,169,99,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(217,169,99,0.04),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 120px)`,
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* ASCII Art ghost — right side, fades on scroll */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.6], [0.7, 0]) }}
        className="absolute right-0 top-[40%] -translate-y-1/2 w-[50vw] h-[90vh] bg-contain bg-center bg-no-repeat pointer-events-none"
        aria-hidden
      >
        <div
          className="w-full h-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/hero-ascii-art.png')`,
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 h-screen flex items-center px-6 md:px-16"
      >
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
          {/* Left: Text */}
          <motion.div
            style={{ y: textY }}
            className="flex-1 text-center md:text-left"
          >
            {/* Overline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-8 justify-center md:justify-start"
            >
              <div className="w-8 h-[1px] bg-accent" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent">
                Built on Stellar
              </span>
              <div className="w-8 h-[1px] bg-accent md:hidden" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] tracking-[0.02em] text-text-primary"
            >
              Xandria
            </motion.h1>

            {/* Amber rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-6 w-24 h-[1px] bg-accent origin-left mx-auto md:mx-0"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="font-display text-[clamp(1.1rem,2.5vw,1.75rem)] text-text-secondary mt-6 tracking-wide"
            >
              The library you own.
            </motion.p>

            {/* Descriptor */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="font-body text-[13px] text-text-muted mt-6 max-w-sm leading-relaxed mx-auto md:mx-0"
            >
              Decentralized books. True ownership. AI that reads with you.
            </motion.p>
          </motion.div>

          {/* Right: spacer to keep text on the left */}
          <div className="flex-1 hidden md:block" />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-6 z-20"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-text-muted">
              Scroll
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-muted">
              <polyline points="3 6 8 11 13 6" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

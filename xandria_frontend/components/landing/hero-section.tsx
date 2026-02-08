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

      {/* ASCII Art Background - Seamlessly blended */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[50vw] h-[80vh] bg-contain bg-right bg-no-repeat opacity-[0.15]"
        style={{
          backgroundImage: `url('/hero-ascii-art.svg')`,
          mixBlendMode: 'screen',
        }}
      />
      {/* Gradient overlay to blend ASCII into background */}
      <div 
        className="absolute right-0 top-0 w-[60vw] h-full"
        style={{
          background: `radial-gradient(ellipse 80% 100% at 100% 50%, transparent 0%, #0A0A08 70%)`,
        }}
      />
      {/* Additional subtle vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,8,0.4)_100%)]" />

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 h-screen flex items-center justify-center px-6 md:px-16"
      >
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
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

          {/* Right: ASCII art with ambient glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 flex justify-center md:justify-end pointer-events-none select-none relative"
          >
            {/* Glow behind statue */}
            <div className="absolute inset-0 blur-[80px] bg-[rgba(217,169,99,0.08)] rounded-full scale-125" />
            
            {/* ASCII Container with blend mode */}
            <div className="relative w-[280px] md:w-[360px] lg:w-[420px] aspect-[2/3]">
              {/* The ASCII image as background */}
              <div 
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/hero-ascii-art.svg')`,
                  filter: 'sepia(30%) saturate(150%) brightness(0.9)',
                }}
              />
              {/* Gradient overlay to blend edges */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 70% 90% at 50% 50%, transparent 30%, rgba(10,10,8,0.6) 70%, rgba(10,10,8,1) 100%)`,
                }}
              />
              {/* Warm tint overlay */}
              <div 
                className="absolute inset-0 mix-blend-overlay opacity-30"
                style={{
                  background: 'linear-gradient(180deg, rgba(217,169,99,0.2) 0%, transparent 50%, rgba(217,169,99,0.1) 100%)',
                }}
              />
              {/* Light sweep animation */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "200%", opacity: [0, 0.5, 0] }}
                transition={{ duration: 3, delay: 1.8, ease: "easeInOut" }}
                className="absolute inset-0 z-20 w-[40%]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(232,224,212,0.15), transparent)",
                }}
              />
            </div>
          </motion.div>
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

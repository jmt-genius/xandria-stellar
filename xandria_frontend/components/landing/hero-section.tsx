"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col items-center justify-center relative">
      {/* Warm radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[rgba(217,169,99,0.03)] blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="font-display text-5xl md:text-6xl text-text-primary tracking-wide">
          Xandria
        </h1>
        <p className="font-body text-xl text-text-secondary mt-4">
          A library you own.
        </p>

        {/* Amber rule */}
        <div className="mx-auto mt-8 w-16 h-[1px] bg-accent" />

        <p className="font-body text-base text-text-muted mt-6">
          Books as assets, not files.
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-text-muted"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  );
}

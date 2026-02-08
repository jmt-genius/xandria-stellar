"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="font-display text-xl text-text-primary tracking-wider hover:text-accent transition-colors duration-300">
        Xandria
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <Link
          href="/marketplace"
          className="font-mono text-[11px] tracking-[0.15em] uppercase text-text-muted hover:text-text-secondary transition-colors duration-300 hidden sm:block"
        >
          Marketplace
        </Link>
        <Link
          href="/marketplace"
          className="group flex items-center gap-2 font-body text-sm text-accent hover:text-accent/80 transition-colors duration-300"
        >
          <span>Enter</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <line x1="2" y1="7" x2="12" y2="7" />
            <polyline points="8 3 12 7 8 11" />
          </svg>
        </Link>
      </div>
    </motion.nav>
  );
}

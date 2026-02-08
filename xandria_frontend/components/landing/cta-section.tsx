"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Library", href: "/library" },
  { label: "Publish", href: "/upload-book" },
];

export default function CtaSection() {
  return (
    <section className="relative py-32 md:py-48 px-6 overflow-hidden">
      {/* Background atmosphere — converging warmth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(217,169,99,0.05),transparent_70%)]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Top ornament */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="landing-divider mb-16 origin-center"
        />

        {/* The statement */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-[clamp(2rem,6vw,4rem)] text-text-primary leading-[1.1] tracking-wide mb-6"
        >
          Your library awaits.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body text-base text-text-secondary leading-relaxed mb-12 max-w-md mx-auto"
        >
          True ownership. Protected content. An AI that reads with you.
          Built on Stellar. Open forever.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link
            href="/marketplace"
            className="group relative inline-flex items-center gap-3 py-4 px-12 bg-accent text-background font-body font-medium text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,169,99,0.3)]"
          >
            <span>Enter Xandria</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <line x1="3" y1="8" x2="13" y2="8" />
              <polyline points="9 4 13 8 9 12" />
            </svg>
          </Link>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="landing-divider mt-16 origin-center"
        />

        {/* Footer-like bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          {/* Quick links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-xs text-text-muted hover:text-text-secondary transition-colors duration-300 tracking-wide uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Brand mark */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-display text-xl text-text-primary tracking-wider">
              Xandria
            </span>
            <p className="font-mono text-[10px] text-text-muted tracking-wide">
              Decentralized books on the Stellar network
            </p>
          </div>

          {/* Tech badges */}
          <div className="flex items-center gap-4 mt-2">
            {["Stellar", "Soroban", "IPFS", "AI"].map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] tracking-[0.15em] uppercase text-text-muted/50 border border-border/50 rounded-full px-3 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const layers = [
  {
    label: "Ownership verification",
    detail: "Stellar assets in your wallet",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    label: "Encrypted content",
    detail: "No raw files, ever",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1.5" />
      </svg>
    ),
  },
  {
    label: "Reader-layer DRM",
    detail: "Copy, print, and extract — blocked",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <line x1="2" y1="8" x2="22" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="15" x2="14" y2="15" />
      </svg>
    ),
  },
  {
    label: "Invisible watermark",
    detail: "Your wallet address, composited at 3% opacity",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
];

export default function ProtectionSection() {
  return (
    <section className="relative py-24 md:py-40 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(217,169,99,0.03),transparent)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Reader mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Reader frame */}
            <div className="relative bg-background rounded-xl border border-border overflow-hidden"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
            >
              {/* Top bar mockup */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-text-muted/30" />
                  <span className="font-mono text-[10px] text-text-muted">
                    Library
                  </span>
                </div>
                <span className="font-display text-xs text-text-secondary">
                  The Art of War
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  3 / 24
                </span>
              </div>

              {/* Content area */}
              <div className="p-8 md:p-12 min-h-[320px] relative">
                {/* Simulated text lines */}
                <div className="max-w-[400px] mx-auto space-y-4">
                  <div className="font-display text-lg text-accent/80 mb-6 text-center">
                    Chapter III
                  </div>
                  {[100, 95, 88, 100, 72, 96, 85, 100, 60].map((width, i) => (
                    <div
                      key={i}
                      className="h-[6px] rounded-full bg-text-primary/8"
                      style={{ width: `${width}%` }}
                    />
                  ))}
                </div>

                {/* Watermark overlay — visible in mockup */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.06]">
                  <div
                    className="font-mono text-[10px] text-text-primary tracking-[0.3em] whitespace-nowrap"
                    style={{ transform: "rotate(-30deg) scale(2)" }}
                  >
                    G4KF...9X2D &nbsp;&nbsp; G4KF...9X2D &nbsp;&nbsp; G4KF...9X2D &nbsp;&nbsp; G4KF...9X2D
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-[2px] bg-border">
                <div className="h-full w-[38%] bg-accent" />
              </div>
            </div>

            {/* Floating DRM indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-surface border border-border rounded-full px-4 py-1.5"
            >
              <span className="font-body text-[11px] text-text-muted">
                This content is protected
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Text + layers */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[1px] bg-accent" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent">
                Protection
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(2rem,5vw,3rem)] text-text-primary leading-[1.1] tracking-wide mb-4"
            >
              DRM that respects you.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body text-base text-text-secondary leading-relaxed mb-10 max-w-md"
            >
              We don&apos;t stop you from photographing a page &mdash; just like
              a physical book. We stop scalable piracy. Mass copying. Redistribution.
              The protection is invisible until someone tests it.
            </motion.p>

            {/* Protection layers */}
            <div className="space-y-0">
              {layers.map((layer, i) => (
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="group flex items-start gap-4 py-4 border-b border-border last:border-b-0"
                >
                  <div className="text-accent/40 group-hover:text-accent/80 transition-colors duration-300 mt-0.5 shrink-0">
                    {layer.icon}
                  </div>
                  <div>
                    <span className="font-body text-sm text-text-primary">{layer.label}</span>
                    <p className="font-body text-xs text-text-muted mt-0.5">{layer.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

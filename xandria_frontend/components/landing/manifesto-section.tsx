"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineScale = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  return (
    <section ref={ref} className="relative py-32 md:py-48 px-6">
      {/* Warm glow from center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(217,169,99,0.03),transparent)]" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Top divider */}
        <motion.div
          style={{ scaleX: lineScale }}
          className="landing-divider mb-16 md:mb-24 origin-center"
        />

        {/* The manifesto */}
        <div className="space-y-8 md:space-y-10">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-text-primary leading-[1.3] tracking-wide"
          >
            You don&apos;t own your digital books.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-text-secondary leading-[1.3] tracking-wide"
          >
            You rent access. You agree to terms. And one day, the{" "}
            <span className="text-text-primary">platform disappears</span>{" "}
            and your library goes with it.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-16 h-[1px] bg-accent origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-accent leading-[1.3] tracking-wide"
          >
            Xandria changes that.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-body text-base md:text-lg text-text-secondary leading-relaxed max-w-xl"
          >
            Every book you buy is a real asset on the Stellar blockchain &mdash;
            in your wallet, not someone else&apos;s cloud. Protected by DRM that
            respects you. Enhanced by AI that reads with you. Owned forever.
          </motion.p>
        </div>

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="landing-divider mt-16 md:mt-24 origin-center"
        />
      </div>
    </section>
  );
}

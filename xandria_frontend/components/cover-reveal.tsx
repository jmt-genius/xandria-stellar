"use client";

import { motion } from "framer-motion";
import { formatMintNumber } from "@/lib/stellar";

export default function CoverReveal({
  coverUri,
  mintNumber,
  onComplete,
}: {
  coverUri: string;
  mintNumber: number;
  onComplete?: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-[var(--shadow-cover)]">
        {/* Cover image with clip-path animation */}
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          onAnimationComplete={onComplete}
        >
          <img
            src={coverUri}
            alt="Edition cover"
            className="w-full h-full object-cover"
          />
          {/* Leading edge amber gradient */}
          <motion.div
            className="absolute inset-y-0 w-[3px]"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(217,169,99,0.8), rgba(255,255,255,0.9), rgba(217,169,99,0.8), transparent)",
            }}
            initial={{ right: "100%" }}
            animate={{ right: "0%" }}
            transition={{
              duration: 1.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        </motion.div>

        {/* Mint number */}
        <motion.span
          className="absolute bottom-3 right-3 font-mono text-[11px] text-accent/85 z-10"
          style={{ textShadow: "0 0 12px rgba(217,169,99,0.4)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.6 }}
        >
          {formatMintNumber(mintNumber)}
        </motion.span>
      </div>
    </div>
  );
}

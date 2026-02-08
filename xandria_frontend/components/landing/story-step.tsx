"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type StoryStepProps = {
  heading: string;
  body: string;
  comingSoon?: boolean;
  icon: React.ReactNode;
};

export default function StoryStep({ heading, body, comingSoon, icon }: StoryStepProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);

  return (
    <div ref={ref} className="h-[80vh] flex items-center justify-center px-6">
      <motion.div
        style={{ opacity, y }}
        className="max-w-md text-center"
      >
        <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center text-accent/60">
          {icon}
        </div>
        <h2 className="font-display text-2xl text-text-primary mb-3">
          {heading}
          {comingSoon && (
            <span className="ml-2 font-body text-xs text-text-muted align-middle">
              Coming soon
            </span>
          )}
        </h2>
        <p className="font-body text-base text-text-secondary leading-relaxed">
          {body}
        </p>
      </motion.div>
    </div>
  );
}

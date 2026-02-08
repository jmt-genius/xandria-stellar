"use client";

import { motion } from "framer-motion";

type SessionSummaryProps = {
  durationMinutes: number;
  pagesRead: number;
  concepts: string[];
  onSave: () => void;
};

export default function SessionSummary({ durationMinutes, pagesRead, concepts, onSave }: SessionSummaryProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[360px] bg-surface border border-border rounded-xl p-5 shadow-[var(--shadow-modal)]"
    >
      <h3 className="font-display text-lg text-text-primary mb-3">Session complete</h3>
      <div className="flex gap-4 mb-3">
        <div>
          <p className="font-mono text-xs text-text-muted">Time</p>
          <p className="font-display text-lg text-text-primary">{durationMinutes}m</p>
        </div>
        <div>
          <p className="font-mono text-xs text-text-muted">Pages</p>
          <p className="font-display text-lg text-text-primary">{pagesRead}</p>
        </div>
      </div>
      {concepts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {concepts.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 text-[10px] bg-accent-subtle text-accent rounded-full border border-accent/20"
            >
              {c}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={onSave}
        className="w-full py-2 bg-accent text-background text-sm font-body font-medium transition-opacity hover:opacity-90"
      >
        Save & Exit
      </button>
    </motion.div>
  );
}

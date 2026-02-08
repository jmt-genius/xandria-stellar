"use client";

import { motion, AnimatePresence } from "framer-motion";

type InfoModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function InfoModal({ open, onClose, children }: InfoModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-[var(--shadow-modal)] relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary text-lg transition-colors"
              >
                &#10005;
              </button>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

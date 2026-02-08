"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Book } from "@/types";
import { useStore } from "@/stores/useStore";
import { uuid } from "@/lib/utils";
import CoverReveal from "./cover-reveal";

type Phase = "confirm" | "signing" | "minting" | "success" | "error";

export default function PurchaseModal({
  book,
  onClose,
}: {
  book: Book;
  onClose: () => void;
}) {
  const { walletAddress, buyBookOnChain, addNotification } = useStore();
  const [phase, setPhase] = useState<Phase>("confirm");
  const [error, setError] = useState<string | null>(null);
  const [mintNumber] = useState(() => {
    if (book.isSpecial && book.remainingSupply > 0) {
      return book.totalSupply - book.remainingSupply + 1;
    }
    return Math.floor(Math.random() * 200) + 1;
  });

  const handleConfirm = async () => {
    setPhase("signing");
    setError(null);

    try {
      await buyBookOnChain(book.id);
      setPhase("minting");
    } catch (err) {
      console.error("Purchase failed:", err);
      const message = err instanceof Error ? err.message : "Purchase failed";
      setError(message);
      setPhase("error");
    }
  };

  const handleRevealComplete = () => {
    setTimeout(() => {
      addNotification({
        id: uuid(),
        title: `${book.title}`,
        subtitle: `Edition ${formatMint(mintNumber)}`,
        type: "purchase",
      });
      setPhase("success");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={phase === "confirm" || phase === "error" ? onClose : undefined} />
      <motion.div
        className="relative bg-surface border border-border rounded-xl max-w-md w-full mx-4 shadow-[var(--shadow-modal)] overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {phase === "confirm" && (
            <motion.div
              key="confirm"
              className="p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-display text-xl text-text-primary mb-6">
                Confirm Purchase
              </h2>
              <div className="flex gap-4 mb-6">
                <div className="w-16 aspect-[2/3] rounded overflow-hidden flex-shrink-0">
                  <img src={book.coverUri} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-display text-text-primary">{book.title}</p>
                  <p className="text-text-secondary text-sm">{book.author}</p>
                </div>
              </div>
              <div className="space-y-2 mb-8 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Price</span>
                  <span className="font-mono text-accent">
                    {book.price % 1 === 0 ? Math.round(book.price) : book.price.toFixed(2)} XLM
                  </span>
                </div>
                {walletAddress && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Wallet</span>
                    <span className="font-mono text-text-muted text-xs">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-border text-text-secondary hover:text-text-primary transition-colors text-sm font-body"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!walletAddress}
                  className="flex-1 py-3 bg-accent text-background font-body font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Confirm Purchase
                </button>
              </div>
            </motion.div>
          )}

          {phase === "signing" && (
            <motion.div
              key="signing"
              className="p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-secondary text-sm">
                Waiting for wallet signature...
              </p>
              <p className="text-text-muted text-xs mt-2">
                Please confirm the transaction in Freighter
              </p>
            </motion.div>
          )}

          {phase === "error" && (
            <motion.div
              key="error"
              className="p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-display text-lg text-text-primary mb-3">
                Purchase Failed
              </p>
              <p className="text-error text-sm mb-6 break-words">
                {error}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-border text-text-secondary hover:text-text-primary transition-colors text-sm font-body"
                >
                  Close
                </button>
                <button
                  onClick={() => setPhase("confirm")}
                  className="flex-1 py-3 bg-accent text-background font-body font-medium text-sm transition-opacity hover:opacity-90"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {phase === "minting" && (
            <motion.div
              key="minting"
              className="p-8 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-center py-8">
                <CoverReveal
                  coverUri={book.coverUri}
                  mintNumber={mintNumber}
                  onComplete={handleRevealComplete}
                />
              </div>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div
              key="success"
              className="p-8 bg-black text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-[var(--shadow-cover)] relative">
                  <img src={book.coverUri} alt={book.title} className="w-full h-full object-cover" />
                  <span
                    className="absolute bottom-3 right-3 font-mono text-[11px] text-accent/85"
                    style={{ textShadow: "0 0 12px rgba(217,169,99,0.4)" }}
                  >
                    {formatMint(mintNumber)}
                  </span>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <p className="font-display text-xl text-accent">
                  Edition {formatMint(mintNumber)}
                </p>
                <p className="text-text-secondary text-sm mt-1">is yours</p>
              </motion.div>
              <div className="flex gap-3 mt-8">
                <a
                  href="/library"
                  className="flex-1 py-3 border border-border text-text-secondary hover:text-text-primary transition-colors text-sm font-body text-center"
                >
                  Go to Library
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-accent text-background font-body font-medium text-sm transition-opacity hover:opacity-90"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function formatMint(n: number) {
  return `No. ${String(n).padStart(4, "0")}`;
}

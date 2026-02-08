"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Book, OwnedBook } from "@/types";
import { formatMintNumber } from "@/lib/stellar";

export default function ReaderTopBar({
  book,
  ownedBook,
  currentPage,
  totalPages,
  onToggleAi,
  aiOpen,
  extraActions,
}: {
  book: Book;
  ownedBook: OwnedBook;
  currentPage: number;
  totalPages: number;
  onToggleAi: () => void;
  aiOpen: boolean;
  extraActions?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    setVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setVisible(false), 3000);
  }, []);

  useEffect(() => {
    hideTimerRef.current = setTimeout(() => setVisible(false), 3000);
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) resetTimer();
    };
    const handleTouch = () => resetTimer();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [resetTimer]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 bg-[#0A0A08]/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left: Back */}
          <Link
            href="/library"
            className="text-text-muted text-sm hover:text-text-secondary transition-colors"
          >
            &#8592; Library
          </Link>

          {/* Center: Title + thumbnail */}
          <div className="flex items-center gap-3">
            <span className="font-display text-sm text-text-secondary truncate max-w-[200px]">
              {book.title}
            </span>
            <div className="w-8 h-12 rounded overflow-hidden flex-shrink-0 relative">
              {book.coverUri ? (
                <img
                  src={book.coverUri}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <span className="font-mono text-[10px] text-text-muted">
              {formatMintNumber(ownedBook.mintNumber)}
            </span>
          </div>

          {/* Right: Page + AI toggle */}
          <div className="flex items-center gap-4">
            {extraActions}
            <span className="font-mono text-xs text-text-muted">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={onToggleAi}
              className={`w-5 h-5 flex items-center justify-center transition-colors ${
                aiOpen ? "text-accent" : "text-text-muted hover:text-text-secondary"
              }`}
              aria-label="Toggle AI Assistant"
              style={
                aiOpen
                  ? { filter: "drop-shadow(0 0 6px rgba(217,169,99,0.4))" }
                  : undefined
              }
            >
              &#10024;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

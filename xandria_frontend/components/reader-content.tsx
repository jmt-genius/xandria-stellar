"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { uuid } from "@/lib/utils";
import { serializeRange, deserializeRange, applyHighlightMark } from "@/lib/highlight-utils";
import HighlightMenu from "@/components/reader/highlight-menu";
import type { Highlight } from "@/types";

const HIGHLIGHT_COLOR = "rgba(217, 169, 99, 0.25)";

export default function ReaderContent({
  content,
  chapterTitle,
  pageIndex,
  direction,
  bookId,
  chapterIndex,
  pageInChapter,
}: {
  content: string;
  chapterTitle?: string;
  pageIndex: number;
  direction: number;
  bookId: number;
  chapterIndex: number;
  pageInChapter: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [pendingRange, setPendingRange] = useState<Range | null>(null);

  const { addHighlight, getHighlightsForPage, walletAddress, setSelectedText } = useStore();

  // Re-apply saved highlights after content renders
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Small delay to ensure dangerouslySetInnerHTML content is in the DOM
    const timer = setTimeout(() => {
      const highlights = getHighlightsForPage(bookId, chapterIndex, pageInChapter);
      for (const h of highlights) {
        const range = deserializeRange(h, container);
        if (range) {
          applyHighlightMark(range, h.color, h.id);
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [bookId, chapterIndex, pageInChapter, pageIndex, getHighlightsForPage]);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentRef.current) {
      setMenuPosition(null);
      setPendingRange(null);
      setSelectedText(null);
      return;
    }

    const range = selection.getRangeAt(0);

    // Verify selection is within our content div
    if (!contentRef.current.contains(range.commonAncestorContainer)) {
      setMenuPosition(null);
      setPendingRange(null);
      setSelectedText(null);
      return;
    }

    const text = range.toString().trim();
    if (text) {
      setSelectedText(text.slice(0, 1000));
    }

    const rect = range.getBoundingClientRect();
    setMenuPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
    setPendingRange(range.cloneRange());
  }, [setSelectedText]);

  const handleHighlight = useCallback(() => {
    if (!pendingRange || !contentRef.current || !walletAddress) return;

    const text = pendingRange.toString().slice(0, 500);
    if (!text.trim()) return;

    const serialized = serializeRange(pendingRange, contentRef.current);

    const highlight: Highlight = {
      id: uuid(),
      bookId,
      ownerAddress: walletAddress,
      text,
      color: HIGHLIGHT_COLOR,
      createdAt: new Date().toISOString(),
      chapterIndex,
      pageInChapter,
      ...serialized,
    };

    // Apply visual mark
    applyHighlightMark(pendingRange, HIGHLIGHT_COLOR, highlight.id);

    // Persist
    addHighlight(highlight);

    // Clean up
    window.getSelection()?.removeAllRanges();
    setMenuPosition(null);
    setPendingRange(null);
  }, [pendingRange, bookId, chapterIndex, pageInChapter, walletAddress, addHighlight]);

  // Dismiss menu on mousedown outside
  const handleMouseDown = useCallback(() => {
    if (menuPosition) {
      setMenuPosition(null);
      setPendingRange(null);
      setSelectedText(null);
    }
  }, [menuPosition, setSelectedText]);

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-[640px]">
        {chapterTitle && (
          <h2 className="font-display text-[28px] text-accent text-center mb-16 mt-16 leading-tight">
            {chapterTitle}
          </h2>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pageIndex}
            ref={contentRef}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-reader text-[19px] leading-[1.8] tracking-[0.01em] text-[#E8E0D4]"
            style={{
              fontFamily: "var(--font-reader), Georgia, serif",
              userSelect: "text",
              WebkitUserSelect: "text",
            }}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {menuPosition && (
          <HighlightMenu
            position={menuPosition}
            onHighlight={handleHighlight}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

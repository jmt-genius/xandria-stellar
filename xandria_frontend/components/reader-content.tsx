"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ReaderContent({
  content,
  chapterTitle,
  pageIndex,
  direction,
}: {
  content: string;
  chapterTitle?: string;
  pageIndex: number;
  direction: number;
}) {
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
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-reader text-[19px] leading-[1.8] tracking-[0.01em] text-[#E8E0D4]"
            style={{ fontFamily: "var(--font-reader), Georgia, serif" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/useStore";
import DrmWrapper from "@/components/drm-wrapper";
import ReaderTopBar from "@/components/reader-top-bar";
import ReaderContent from "@/components/reader-content";
import ProgressBar from "@/components/progress-bar";
import AiPanel from "@/components/ai-panel";

export default function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const bookId = parseInt(id);
  const router = useRouter();

  const { books, fetchBooks, isOwned, getOwnedBook, walletAddress, currentPage, setCurrentPage } = useStore();
  const [aiOpen, setAiOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchBooks().then(() => setLoaded(true));
  }, [fetchBooks]);

  const book = useMemo(() => books.find((b) => b.id === bookId), [books, bookId]);
  const ownedBook = getOwnedBook(bookId);
  const owned = isOwned(bookId);

  // Flatten all pages
  const allPages = useMemo(() => {
    if (!book) return [];
    const pages: { content: string; chapterTitle?: string; chapterIndex: number; pageInChapter: number }[] = [];
    book.chapters.forEach((chapter, ci) => {
      chapter.content.forEach((page, pi) => {
        pages.push({
          content: page,
          chapterTitle: pi === 0 ? chapter.title : undefined,
          chapterIndex: ci,
          pageInChapter: pi,
        });
      });
    });
    return pages;
  }, [book]);

  const pageIdx = currentPage[bookId] || 0;
  const totalPages = allPages.length;

  const goNext = useCallback(() => {
    if (pageIdx < totalPages - 1) {
      setDirection(1);
      setCurrentPage(bookId, pageIdx + 1);
    }
  }, [pageIdx, totalPages, bookId, setCurrentPage]);

  const goPrev = useCallback(() => {
    if (pageIdx > 0) {
      setDirection(-1);
      setCurrentPage(bookId, pageIdx - 1);
    }
  }, [pageIdx, bookId, setCurrentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setAiOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-[#0A0A08] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!book || !owned || !ownedBook) {
    return (
      <div className="fixed inset-0 bg-[#0A0A08] flex flex-col items-center justify-center">
        <p className="font-display text-xl text-text-secondary mb-4">
          {!book ? "Book not found" : "You don't own this book"}
        </p>
        <button
          onClick={() => router.push(book ? `/marketplace/${bookId}` : "/marketplace")}
          className="text-accent text-sm hover:underline"
        >
          {book ? "View in marketplace" : "Browse marketplace"}
        </button>
      </div>
    );
  }

  if (allPages.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#0A0A08] flex flex-col items-center justify-center">
        <p className="font-display text-xl text-text-secondary mb-4">
          No content available
        </p>
        <button
          onClick={() => router.push("/library")}
          className="text-accent text-sm hover:underline"
        >
          Back to Library
        </button>
      </div>
    );
  }

  const currentPageData = allPages[pageIdx];
  const progress = totalPages > 1 ? (pageIdx + 1) / totalPages : 1;
  const isLastPage = pageIdx === totalPages - 1;

  return (
    <div className="fixed inset-0 bg-[#0A0A08] flex flex-col">
      <DrmWrapper walletAddress={walletAddress || ""}>
        <ReaderTopBar
          book={book}
          ownedBook={ownedBook}
          currentPage={pageIdx}
          totalPages={totalPages}
          onToggleAi={() => setAiOpen(!aiOpen)}
          aiOpen={aiOpen}
        />

        <div className="flex-1 flex relative overflow-hidden pt-16">
          {/* Left click zone */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[15%] z-10 cursor-pointer group"
            onClick={goPrev}
          >
            {pageIdx > 0 && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted/15 text-2xl group-hover:text-text-muted/30 transition-colors">
                &#8249;
              </span>
            )}
          </div>

          {/* Content */}
          <ReaderContent
            content={currentPageData.content}
            chapterTitle={currentPageData.chapterTitle}
            pageIndex={pageIdx}
            direction={direction}
          />

          {/* Right click zone */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[15%] z-10 cursor-pointer group"
            onClick={goNext}
          >
            {!isLastPage ? (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted/15 text-2xl group-hover:text-text-muted/30 transition-colors">
                &#8250;
              </span>
            ) : null}
          </div>
        </div>

        {/* End of book state */}
        {isLastPage && (
          <div className="text-center pb-12">
            <p className="text-text-secondary text-sm mb-3">
              You&apos;ve finished the book
            </p>
            <button
              onClick={() => router.push("/library")}
              className="text-accent text-sm hover:underline"
            >
              Back to Library
            </button>
          </div>
        )}

        <ProgressBar progress={progress} />
      </DrmWrapper>

      <AiPanel
        bookId={bookId}
        open={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
}

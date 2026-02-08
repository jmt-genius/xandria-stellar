"use client";

import { useEffect, useState, useCallback, useMemo, useRef, use } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { bookMetadata } from "@/data/book-metadata";
import DrmWrapper from "@/components/drm-wrapper";
import ReaderTopBar from "@/components/reader-top-bar";
import ReaderContent from "@/components/reader-content";
import ProgressBar from "@/components/progress-bar";
import EndSessionButton from "@/components/reader/end-session-button";

const AiPanel = dynamic(() => import("@/components/ai-panel"), { ssr: false });
const SessionSummary = dynamic(() => import("@/components/reader/session-summary"), { ssr: false });
const WhyDrmModal = dynamic(() => import("@/components/modals/why-drm-modal"), { ssr: false });

export default function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const bookId = parseInt(id);
  const router = useRouter();

  const { books, fetchBooks, isOwned, getOwnedBook, checkOnChainOwnership, walletAddress, currentPage, setCurrentPage, startReadingSession, endReadingSession } = useStore();
  const [aiOpen, setAiOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [showDrmModal, setShowDrmModal] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const startPageRef = useRef<number>(0);

  useEffect(() => {
    fetchBooks().then(() => setLoaded(true));
  }, [fetchBooks]);

  const book = useMemo(() => books.find((b) => b.id === bookId), [books, bookId]);
  const ownedBook = getOwnedBook(bookId);
  const owned = isOwned(bookId);
  const metadata = bookMetadata[bookId];

  // Start reading session on mount
  useEffect(() => {
    if (loaded && verified && owned && !sessionIdRef.current) {
      sessionIdRef.current = startReadingSession(bookId);
      startPageRef.current = currentPage[bookId] || 0;
    }
  }, [loaded, verified, owned, bookId, startReadingSession, currentPage]);

  // On-chain ownership verification
  useEffect(() => {
    if (!loaded || !walletAddress || !book) return;
    if (!owned) {
      setVerified(false);
      return;
    }
    if (book.authorAddress === walletAddress) {
      setVerified(true);
      return;
    }
    let cancelled = false;
    checkOnChainOwnership(bookId).then((result) => {
      if (!cancelled) setVerified(result);
    });
    return () => { cancelled = true; };
  }, [loaded, walletAddress, book, owned, bookId, checkOnChainOwnership]);

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

  const handleEndSession = () => {
    setShowSessionSummary(true);
  };

  const handleSaveAndExit = () => {
    if (sessionIdRef.current) {
      const concepts = metadata?.concepts?.slice(0, 3) || [];
      endReadingSession(sessionIdRef.current, concepts);
      sessionIdRef.current = null;
    }
    router.push("/library");
  };

  const pagesRead = Math.abs(pageIdx - startPageRef.current) + 1;
  const sessionStart = sessionIdRef.current
    ? useStore.getState().readingSessions.find((s) => s.id === sessionIdRef.current)?.startedAt
    : null;
  const sessionDuration = sessionStart
    ? Math.round((Date.now() - new Date(sessionStart).getTime()) / 60000)
    : 0;

  if (!loaded || verified === null) {
    return (
      <div className="fixed inset-0 bg-[#0A0A08] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="fixed inset-0 bg-[#0A0A08] flex flex-col items-center justify-center">
        <p className="font-display text-xl text-text-secondary mb-4">
          Connect your wallet to read this book
        </p>
        <button
          onClick={() => router.push("/marketplace")}
          className="text-accent text-sm hover:underline"
        >
          Browse marketplace
        </button>
      </div>
    );
  }

  if (!book || !owned || !ownedBook || !verified) {
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
      <DrmWrapper walletAddress={walletAddress || ""} onProtectionAttempt={() => setShowDrmModal(true)}>
        <ReaderTopBar
          book={book}
          ownedBook={ownedBook}
          currentPage={pageIdx}
          totalPages={totalPages}
          onToggleAi={() => setAiOpen((prev) => !prev)}
          aiOpen={aiOpen}
          extraActions={<EndSessionButton onClick={handleEndSession} />}
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
              onClick={handleSaveAndExit}
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

      <AnimatePresence>
        {showSessionSummary && (
          <SessionSummary
            durationMinutes={sessionDuration}
            pagesRead={pagesRead}
            concepts={metadata?.concepts?.slice(0, 3) || []}
            onSave={handleSaveAndExit}
          />
        )}
      </AnimatePresence>

      <WhyDrmModal
        open={showDrmModal}
        onClose={() => setShowDrmModal(false)}
      />
    </div>
  );
}

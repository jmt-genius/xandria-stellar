"use client";

import { useEffect, useState, useCallback, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useStore } from "@/stores/useStore";
import DrmWrapper from "@/components/drm-wrapper";
import ReaderTopBar from "@/components/reader-top-bar";
import ReaderContent from "@/components/reader-content";
import ProgressBar from "@/components/progress-bar";
import AiPanel from "@/components/ai-panel";

// Dynamic imports for file readers (they use browser-only APIs)
const EpubReader = dynamic(() => import("@/components/epub-reader").catch(err => {
  console.error("[Reader Debug] Failed to load EpubReader module:", err);
  return () => <div className="text-red-500 p-4">Error loading EPUB reader: {err.message}</div>;
}), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const PdfReader = dynamic(() => import("@/components/pdf-reader"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

// Detect file type from URL
function getFileType(uri: string): "epub" | "pdf" | "unknown" {
  console.log("Analyzing file type for URI:", uri);
  if (!uri) return "unknown";

  const lower = uri.toLowerCase();

  // Try to clean potential query params
  // If IPFS gateway or direct link has extension
  if (lower.includes(".epub")) return "epub";
  if (lower.includes(".pdf")) return "pdf";

  // If no extension but looks like IPFS hash (often 46 chars starting with Qm or 59 starting with bafy)
  // Default to EPUB as it's the most common format here, and our EPUB reader now handles binary validation
  if (lower.includes("ipfs") || lower.includes("pinata")) {
    console.log("[Reader Debug] IPFS/Pinata link detected without extension, defaulting to EPUB");
    return "epub";
  }

  return "unknown";
}

export default function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const bookId = parseInt(id);
  const router = useRouter();

  const { books, fetchBooks, isOwned, getOwnedBook, checkOnChainOwnership, walletAddress, currentPage, setCurrentPage } = useStore();
  const [aiOpen, setAiOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  // State for file-based readers
  const [fileReaderProgress, setFileReaderProgress] = useState({ current: 0, total: 1 });

  useEffect(() => {
    fetchBooks().then(() => setLoaded(true));
  }, [fetchBooks]);

  const book = useMemo(() => books.find((b) => b.id === bookId), [books, bookId]);
  const ownedBook = getOwnedBook(bookId);
  const owned = isOwned(bookId);

  // Determine file type and whether to use file reader
  const fileType = useMemo(() => {
    const type = book?.bookUri ? getFileType(book.bookUri) : "unknown";
    console.log(`[Reader Debug] Book ID: ${bookId}, Book URI: ${book?.bookUri}, Detected Type: ${type}`);
    return type;
  }, [book?.bookUri]);

  const useFileReader = fileType === "epub" || fileType === "pdf";
  console.log(`[Reader Debug] useFileReader: ${useFileReader}`);

  // On-chain ownership verification — the contract is the source of truth
  useEffect(() => {
    if (!loaded || !walletAddress || !book) return;
    if (!owned) {
      setVerified(false);
      return;
    }
    // Author bypass — no need to check contract
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

  // Flatten all pages (for chapter-based fallback)
  const allPages = useMemo(() => {
    if (!book || useFileReader) return [];
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
  }, [book, useFileReader]);

  const pageIdx = currentPage[bookId] || 0;
  const totalPages = useFileReader ? fileReaderProgress.total : allPages.length;
  const currentDisplayPage = useFileReader ? fileReaderProgress.current : pageIdx + 1;

  const goNext = useCallback(() => {
    if (!useFileReader && pageIdx < allPages.length - 1) {
      setDirection(1);
      setCurrentPage(bookId, pageIdx + 1);
    }
  }, [pageIdx, allPages.length, bookId, setCurrentPage, useFileReader]);

  const goPrev = useCallback(() => {
    if (!useFileReader && pageIdx > 0) {
      setDirection(-1);
      setCurrentPage(bookId, pageIdx - 1);
    }
  }, [pageIdx, bookId, setCurrentPage, useFileReader]);

  // Keyboard navigation (only for chapter-based reader)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setAiOpen((prev) => !prev);
        return;
      }
      // Only handle navigation for chapter-based reader
      if (!useFileReader) {
        if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          goNext();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goPrev();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, useFileReader]);

  // Handle page change from file readers
  const handleFilePageChange = useCallback((current: number, total: number) => {
    setFileReaderProgress({ current, total });
  }, []);

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

  // No content check (only for chapter-based books)
  if (!useFileReader && allPages.length === 0) {
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

  const progress = totalPages > 1 ? currentDisplayPage / totalPages : 1;
  const isLastPage = !useFileReader && pageIdx === allPages.length - 1;
  const currentPageData = !useFileReader ? allPages[pageIdx] : null;

  return (
    <div className="fixed inset-0 bg-[#0A0A08] flex flex-col">
      <DrmWrapper walletAddress={walletAddress || ""}>
        <ReaderTopBar
          book={book}
          ownedBook={ownedBook}
          currentPage={useFileReader ? fileReaderProgress.current - 1 : pageIdx}
          totalPages={totalPages}
          onToggleAi={() => setAiOpen(!aiOpen)}
          aiOpen={aiOpen}
        />

        <div className="flex-1 flex relative overflow-hidden pt-16">
          {/* File-based readers */}
          {fileType === "epub" && (
            <EpubReader
              bookUri={book.bookUri}
              onPageChange={handleFilePageChange}
            />
          )}

          {fileType === "pdf" && (
            <PdfReader
              bookUri={book.bookUri}
              onPageChange={handleFilePageChange}
            />
          )}

          {/* Chapter-based fallback reader */}
          {!useFileReader && currentPageData && (
            <>
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
            </>
          )}
        </div>

        {/* End of book state (chapter-based only) */}
        {!useFileReader && isLastPage && (
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

"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import dynamic from "next/dynamic";
import OwnedBookCard from "@/components/owned-book-card";
import ShelfModeToggle from "@/components/library/shelf-mode-toggle";

const ThemeShelf = dynamic(() => import("@/components/library/theme-shelf"));
const EmotionalShelf = dynamic(() => import("@/components/library/emotional-shelf"));
const KindleComparisonModal = dynamic(() => import("@/components/modals/kindle-comparison-modal"), { ssr: false });

export default function LibraryPage() {
  const { ownedBooks, books, walletAddress, fetchBooks, syncOwnedBooks, shelfMode, setShelfMode } = useStore();
  const [syncing, setSyncing] = useState(false);
  const [showKindleModal, setShowKindleModal] = useState(false);
  const syncedRef = useRef<string | null>(null);

  // Only show books belonging to the connected wallet
  const myBooks = useMemo(
    () => ownedBooks.filter((b) => b.ownerAddress === walletAddress),
    [ownedBooks, walletAddress]
  );

  const myBooksWithData = useMemo(() => {
    const bookMap = new Map<number, typeof books[0]>();
    for (const b of books) bookMap.set(b.id, b);
    return myBooks
      .map((owned) => ({ owned, book: bookMap.get(owned.bookId) }))
      .filter((item): item is { owned: typeof myBooks[0]; book: typeof books[0] } => !!item.book);
  }, [myBooks, books]);

  useEffect(() => {
    const load = async () => {
      await fetchBooks();
      // Only sync once per wallet address
      if (walletAddress && syncedRef.current !== walletAddress) {
        syncedRef.current = walletAddress;
        setSyncing(true);
        await syncOwnedBooks();
        setSyncing(false);
      }
    };
    load();
  }, [fetchBooks, walletAddress, syncOwnedBooks]);

  if (!walletAddress) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <p className="font-display text-2xl text-text-secondary mb-3">
          Connect your wallet to view your library.
        </p>
      </div>
    );
  }

  if (syncing && myBooks.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-text-secondary text-sm">
          Checking your library shelves...
        </p>
      </div>
    );
  }

  if (myBooks.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <p className="font-display text-2xl text-text-secondary mb-3">
          Nothing here yet.
        </p>
        <Link
          href="/marketplace"
          className="text-accent text-sm hover:underline"
        >
          Browse the marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl text-text-primary">
          Your Library
        </h1>
        <button
          onClick={() => setShowKindleModal(true)}
          className="font-body text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          How is this different from Kindle?
        </button>
      </div>
      <p className="text-text-secondary text-sm mb-6">
        {myBooks.length} edition{myBooks.length !== 1 ? "s" : ""}
      </p>

      <div className="mb-8">
        <ShelfModeToggle current={shelfMode} onChange={setShelfMode} />
      </div>

      {shelfMode === "chronological" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myBooksWithData.map(({ book, owned }) => (
            <OwnedBookCard
              key={owned.bookId}
              book={book}
              ownedBook={owned}
            />
          ))}
        </div>
      )}

      {shelfMode === "theme" && (
        <ThemeShelf
          books={myBooksWithData.map((d) => d.book)}
          ownedBooks={myBooks}
        />
      )}

      {shelfMode === "emotional" && (
        <EmotionalShelf
          books={myBooksWithData.map((d) => d.book)}
          ownedBooks={myBooks}
        />
      )}

      <KindleComparisonModal
        open={showKindleModal}
        onClose={() => setShowKindleModal(false)}
      />
    </div>
  );
}

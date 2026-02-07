"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import OwnedBookCard from "@/components/owned-book-card";

export default function LibraryPage() {
  const { ownedBooks, books, walletAddress, fetchBooks, syncOwnedBooks } = useStore();
  const [syncing, setSyncing] = useState(false);
  const syncedRef = useRef<string | null>(null);

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

  if (syncing && ownedBooks.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-text-secondary text-sm">
          Checking your library shelves...
        </p>
      </div>
    );
  }

  if (ownedBooks.length === 0) {
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
      <h1 className="font-display text-3xl text-text-primary mb-1">
        Your Library
      </h1>
      <p className="text-text-secondary text-sm mb-10">
        {ownedBooks.length} edition{ownedBooks.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ownedBooks.map((owned) => {
          const book = books.find((b) => b.id === owned.bookId);
          if (!book) return null;
          return (
            <OwnedBookCard
              key={owned.bookId}
              book={book}
              ownedBook={owned}
            />
          );
        })}
      </div>
    </div>
  );
}

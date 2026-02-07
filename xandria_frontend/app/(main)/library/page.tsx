"use client";

import Link from "next/link";
import { useStore } from "@/stores/useStore";
import OwnedBookCard from "@/components/owned-book-card";

export default function LibraryPage() {
  const { ownedBooks, books } = useStore();

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

"use client";

import Link from "next/link";
import type { Book, OwnedBook } from "@/types";
import MintNumberOverlay from "./mint-number-overlay";

export default function OwnedBookCard({
  book,
  ownedBook,
}: {
  book: Book;
  ownedBook: OwnedBook;
}) {
  const totalPages = book.chapters.reduce((sum, ch) => sum + ch.content.length, 0);
  const progress = totalPages > 0 ? ownedBook.currentPage / totalPages : 0;

  return (
    <Link href={`/library/${book.id}/read`}>
      <div className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-[var(--shadow-cover)]">
          {book.coverUri ? (
            <img
              src={book.coverUri}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-hover flex items-center justify-center">
              <span className="font-display text-lg text-text-muted text-center px-4">
                {book.title}
              </span>
            </div>
          )}
          <MintNumberOverlay mintNumber={ownedBook.mintNumber} />
        </div>
        <div className="mt-3">
          <h3 className="font-display text-lg text-text-primary truncate">
            {book.title}
          </h3>
          <p className="font-body text-sm text-text-secondary mt-0.5">
            {book.author}
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-[2px] w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-200"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

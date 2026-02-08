"use client";

import Link from "next/link";
import type { Book, OwnedBook } from "@/types";
import { getBookMetadata } from "@/data/book-metadata";
import MintNumberOverlay from "./mint-number-overlay";
import BookCover from "@/components/book-cover";

export default function OwnedBookCard({
  book,
  ownedBook,
}: {
  book: Book;
  ownedBook: OwnedBook;
}) {
  const totalPages = book.chapters.reduce((sum, ch) => sum + ch.content.length, 0);
  const progress = totalPages > 0 ? ownedBook.currentPage / totalPages : 0;
  const metadata = getBookMetadata(book);
  const hoverText = metadata?.whyPeopleRead?.[0] || `Purchased on ${new Date(ownedBook.purchasedAt).toLocaleDateString()}`;

  return (
    <Link href={`/library/${book.id}/read`}>
      <div className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-[var(--shadow-cover)]">
          <BookCover coverUri={book.coverUri} title={book.title} />
          <MintNumberOverlay mintNumber={ownedBook.mintNumber} />

          {/* Hover overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-[#0A0A08]/80 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <p className="font-body text-xs text-text-secondary leading-snug line-clamp-2">
              {hoverText}
            </p>
          </div>
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

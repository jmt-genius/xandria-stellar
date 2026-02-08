"use client";

import Link from "next/link";
import type { CuratedCollection } from "@/data/collections";
import type { Book } from "@/types";
import { getBookMetadata } from "@/data/book-metadata";

type CollectionCardProps = {
  collection: CuratedCollection;
  books: Book[];
};

export default function CollectionCard({ collection, books }: CollectionCardProps) {
  const coverBooks = books.slice(0, 4);

  // Aggregate stats
  const totalReadingMinutes = books.reduce((sum, b) => {
    const meta = getBookMetadata(b);
    return sum + (meta?.readingTimeMinutes ?? 0);
  }, 0);
  const totalHours = Math.round(totalReadingMinutes / 60);

  // Collect unique concepts from all books in the collection
  const concepts = Array.from(
    new Set(
      books.flatMap((b) => {
        const meta = getBookMetadata(b);
        return meta?.concepts?.slice(0, 2) ?? [];
      })
    )
  ).slice(0, 4);

  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="group bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-accent/20 cursor-pointer h-full flex flex-col">
        {/* Mosaic covers */}
        <div className="relative h-52 bg-surface-hover p-5 flex items-center justify-center overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent z-[1]" />

          <div className="flex -space-x-4 relative">
            {coverBooks.map((book, i) => (
              <div
                key={book.id}
                className="w-24 h-36 rounded-lg shadow-[var(--shadow-card)] overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-1.5"
                style={{
                  zIndex: coverBooks.length - i,
                  transform: `rotate(${(i - 1.5) * 4}deg)`,
                  transitionDelay: `${i * 30}ms`,
                }}
              >
                {book.coverUri ? (
                  <img
                    src={book.coverUri}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-border flex items-center justify-center">
                    <span className="font-display text-[10px] text-text-muted text-center px-1">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Book count badge */}
          <div className="absolute top-3 right-3 z-[2] px-2 py-0.5 bg-surface/80 backdrop-blur-sm border border-border rounded-full">
            <span className="text-[10px] font-body text-text-muted">
              {books.length} {books.length === 1 ? "book" : "books"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-xl text-text-primary group-hover:text-accent transition-colors leading-tight">
            {collection.title}
          </h3>
          <p className="font-body text-sm text-text-muted mt-1.5 leading-relaxed line-clamp-2">
            {collection.subtitle}
          </p>

          {/* Concept tags */}
          {concepts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {concepts.map((concept) => (
                <span
                  key={concept}
                  className="px-2 py-0.5 text-[10px] bg-accent/[0.06] text-accent/60 border border-accent/10 rounded font-body"
                >
                  {concept}
                </span>
              ))}
            </div>
          )}

          {/* Stats bar */}
          <div className="mt-auto pt-4 flex items-center gap-3 text-[11px] font-body text-text-muted border-t border-border/50">
            {totalHours > 0 && (
              <span>{totalHours}h total reading</span>
            )}
            <span className="text-text-muted/30">&middot;</span>
            <span>{collection.curatorName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

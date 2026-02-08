"use client";

import Link from "next/link";
import type { CuratedCollection, Book } from "@/types";

type CollectionCardProps = {
  collection: CuratedCollection;
  books: Book[];
};

export default function CollectionCard({ collection, books }: CollectionCardProps) {
  const coverBooks = books.slice(0, 4);

  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="group bg-surface border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] cursor-pointer">
        {/* Mosaic covers */}
        <div className="relative h-48 bg-surface-hover p-4 flex items-center justify-center">
          <div className="flex -space-x-4">
            {coverBooks.map((book, i) => (
              <div
                key={book.id}
                className="w-24 h-36 rounded shadow-[var(--shadow-card)] overflow-hidden flex-shrink-0 transition-transform duration-200 group-hover:-translate-y-1"
                style={{
                  zIndex: coverBooks.length - i,
                  transform: `rotate(${(i - 1) * 4}deg)`,
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
        </div>
        <div className="p-4">
          <h3 className="font-display text-xl text-text-primary">{collection.title}</h3>
          <p className="font-body text-sm text-text-muted mt-1">{collection.subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

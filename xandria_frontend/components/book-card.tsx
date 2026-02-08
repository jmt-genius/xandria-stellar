"use client";

import Link from "next/link";
import type { Book } from "@/types";
import { bookMetadata } from "@/data/book-metadata";
import MetadataPills from "@/components/marketplace/metadata-pills";
import RatingDots from "@/components/rating-dots";
import BookCover from "@/components/book-cover";
import { formatPrice } from "@/lib/format";

export default function BookCard({ book }: { book: Book }) {
  const metadata = bookMetadata[book.id];

  return (
    <Link href={`/marketplace/${book.id}`}>
      <div
        className={`group cursor-pointer rounded-lg overflow-hidden bg-surface transition-all duration-200 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] ${
          book.isSpecial ? "ring-1 ring-accent/30" : ""
        }`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          {/* Spine light hover effect */}
          <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />
          <BookCover coverUri={book.coverUri} title={book.title} />
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg text-text-primary truncate leading-tight">
            {book.title}
          </h3>
          <p className="font-body text-sm text-text-secondary mt-1 truncate">
            {book.author}
          </p>
          {metadata && (
            <p className="font-body text-[11px] text-text-muted mt-1 truncate">
              {metadata.socialProof}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-sm text-accent">
              {formatPrice(book.price)}{" "}
              <span className="text-text-muted text-xs">XLM</span>
            </span>
            <RatingDots rating={book.rating} />
          </div>
          {metadata && (
            <div className="mt-2">
              <MetadataPills metadata={metadata} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

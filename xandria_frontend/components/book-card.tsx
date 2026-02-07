"use client";

import Link from "next/link";
import type { Book } from "@/types";

function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= Math.round(rating) ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

export default function BookCard({ book }: { book: Book }) {
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
          {book.coverUri ? (
            <img
              src={book.coverUri}
              alt={book.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-surface-hover flex items-center justify-center">
              <span className="font-display text-lg text-text-muted text-center px-4">
                {book.title}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg text-text-primary truncate leading-tight">
            {book.title}
          </h3>
          <p className="font-body text-sm text-text-secondary mt-1 truncate">
            {book.author}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-sm text-accent">
              {book.price % 1 === 0
                ? Math.round(book.price)
                : book.price.toFixed(2)}{" "}
              <span className="text-text-muted text-xs">XLM</span>
            </span>
            <RatingDots rating={book.rating} />
          </div>
        </div>
      </div>
    </Link>
  );
}

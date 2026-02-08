"use client";

import Link from "next/link";
import type { Book } from "@/types";
import BookCover from "@/components/book-cover";

type EditorialRowProps = {
  title: string;
  subtitle: string;
  books: Book[];
};

export default function EditorialRow({ title, subtitle, books }: EditorialRowProps) {
  if (books.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="font-display text-xl text-text-primary">{title}</h2>
      <p className="font-body text-sm text-text-muted mt-1 mb-5">{subtitle}</p>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/marketplace/${book.id}`}
            className="flex-shrink-0 snap-start group"
          >
            <div className="w-[160px]">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-[var(--shadow-card)] group-hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200">
                <BookCover coverUri={book.coverUri} title={book.title} textSize="text-sm" />
                {/* Spine light */}
                <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <p className="font-display text-sm text-text-primary mt-2 truncate">
                {book.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

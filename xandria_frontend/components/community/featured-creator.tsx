"use client";

import Link from "next/link";
import type { AuthorData } from "@/data/authors";
import type { Book } from "@/types";

type FeaturedCreatorProps = {
  author: AuthorData;
  books: Book[];
};

export default function FeaturedCreator({ author, books }: FeaturedCreatorProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface via-surface to-accent/[0.04]">
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
        {/* Author info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] font-body text-accent bg-accent/10 border border-accent/20 rounded-full">
              Featured Creator
            </span>
          </div>

          <Link href={`/author/${author.id}`}>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary hover:text-accent transition-colors cursor-pointer">
              {author.name}
            </h2>
          </Link>

          <p className="font-body text-text-secondary leading-relaxed mt-4 max-w-xl text-[15px]">
            {author.bio}
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {author.fields.map((field) => (
              <span
                key={field}
                className="px-3 py-1 text-xs bg-surface-hover text-text-muted rounded-full border border-border font-body"
              >
                {field}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm font-body">
            <div>
              <span className="text-text-primary font-medium">{books.length}</span>
              <span className="text-text-muted ml-1.5">{books.length === 1 ? "book" : "books"} on Xandria</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div>
              <span className="text-text-primary font-medium">
                {books.reduce((sum, b) => sum + b.votes, 0)}
              </span>
              <span className="text-text-muted ml-1.5">community votes</span>
            </div>
          </div>
        </div>

        {/* Book covers */}
        <div className="flex gap-3 flex-shrink-0">
          {books.slice(0, 3).map((book, i) => (
            <Link key={book.id} href={`/marketplace/${book.id}`}>
              <div
                className="w-28 h-40 md:w-32 md:h-44 rounded-lg overflow-hidden shadow-[var(--shadow-cover)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                style={{ transform: `rotate(${(i - 1) * 2}deg)` }}
              >
                {book.coverUri ? (
                  <img
                    src={book.coverUri}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-hover flex items-center justify-center p-2">
                    <span className="font-display text-xs text-text-muted text-center">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </div>
  );
}

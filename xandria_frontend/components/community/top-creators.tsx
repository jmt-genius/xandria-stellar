"use client";

import Link from "next/link";
import type { AuthorData } from "@/data/authors";
import type { Book } from "@/types";
import { normalizeTitle } from "@/lib/book-helpers";

type CreatorWithBooks = {
  author: AuthorData;
  books: Book[];
  totalVotes: number;
  avgRating: number;
};

type TopCreatorsProps = {
  authors: AuthorData[];
  books: Book[];
};

function resolveAuthorBooks(author: AuthorData, books: Book[]): Book[] {
  return author.bookTitles
    .map((t) =>
      books.find(
        (b) =>
          normalizeTitle(b.title) === normalizeTitle(t) ||
          normalizeTitle(b.title).startsWith(normalizeTitle(t)) ||
          normalizeTitle(t).startsWith(normalizeTitle(b.title))
      )
    )
    .filter(Boolean) as Book[];
}

export default function TopCreators({ authors, books }: TopCreatorsProps) {
  const creatorsWithBooks: CreatorWithBooks[] = authors
    .map((author) => {
      const authorBooks = resolveAuthorBooks(author, books);
      return {
        author,
        books: authorBooks,
        totalVotes: authorBooks.reduce((sum, b) => sum + b.votes, 0),
        avgRating: authorBooks.length
          ? authorBooks.reduce((sum, b) => sum + b.rating, 0) / authorBooks.length
          : 0,
      };
    })
    .filter((c) => c.books.length > 0)
    .sort((a, b) => b.totalVotes - a.totalVotes);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-text-primary">Top Creators</h2>
          <p className="text-text-muted text-sm mt-1 font-body">
            Authors whose work defines our shelves
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creatorsWithBooks.slice(0, 9).map((creator, index) => (
          <Link
            key={creator.author.id}
            href={`/author/${creator.author.id}`}
            className="group"
          >
            <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors duration-200">
              {/* Rank indicator */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-body">
                {index < 3 ? (
                  <span className="text-accent font-medium">
                    {index === 0 ? "I" : index === 1 ? "II" : "III"}
                  </span>
                ) : (
                  <span className="text-text-muted">{index + 1}</span>
                )}
              </div>

              {/* Author info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-text-primary group-hover:text-accent transition-colors truncate">
                  {creator.author.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {creator.author.fields.slice(0, 2).map((field) => (
                    <span
                      key={field}
                      className="text-[10px] text-text-muted font-body"
                    >
                      {field}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2.5 text-xs font-body text-text-muted">
                  <span>
                    {creator.books.length} {creator.books.length === 1 ? "book" : "books"}
                  </span>
                  <span>{creator.totalVotes} votes</span>
                  <span>{creator.avgRating.toFixed(1)} avg</span>
                </div>
              </div>

              {/* Tiny cover preview */}
              {creator.books[0]?.coverUri && (
                <div className="flex-shrink-0 w-10 h-14 rounded overflow-hidden shadow-[var(--shadow-card)]">
                  <img
                    src={creator.books[0].coverUri}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

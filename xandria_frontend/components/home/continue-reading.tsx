"use client";

import Link from "next/link";
import type { Book, ReadingSession } from "@/types";

type ContinueReadingProps = {
  book: Book;
  lastSession: ReadingSession;
  progress: number;
};

export default function ContinueReading({ book, lastSession, progress }: ContinueReadingProps) {
  const lastIdea = lastSession.ideasExtracted[lastSession.ideasExtracted.length - 1];

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="font-body text-xs tracking-[0.08em] uppercase text-text-muted mb-4">
        Continue reading
      </h3>
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-20 h-[120px] rounded overflow-hidden shadow-[var(--shadow-card)]">
          {book.coverUri ? (
            <img
              src={book.coverUri}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-hover flex items-center justify-center">
              <span className="font-display text-xs text-text-muted text-center px-2">
                {book.title}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-lg text-text-primary truncate">{book.title}</h4>
          <p className="font-body text-sm text-text-secondary mt-0.5">{book.author}</p>
          {lastIdea && (
            <p className="font-body text-xs text-text-muted mt-2">
              Last idea: <span className="italic text-text-secondary">{lastIdea}</span>
            </p>
          )}
          <div className="flex items-center gap-3 mt-3">
            <Link
              href={`/library/${book.id}/read`}
              className="text-accent text-sm font-body hover:underline"
            >
              Continue
            </Link>
            <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${Math.min(progress * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

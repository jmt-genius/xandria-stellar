"use client";

import Link from "next/link";
import type { Book } from "@/types";

type ReadingChallengeProps = {
  books: Book[];
};

export default function ReadingChallenge({ books }: ReadingChallengeProps) {
  // Pick a mix of books for the challenge
  const challengeBooks = books
    .filter((b) => b.coverUri)
    .slice(0, 5);

  return (
    <section className="relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/[0.04] via-surface to-surface">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/[0.02] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] font-body text-accent bg-accent/10 border border-accent/20 rounded-full">
                Community Challenge
              </span>
              <span className="text-[10px] text-text-muted font-body">Q1 2026</span>
            </div>

            <h2 className="font-display text-3xl text-text-primary">
              The Five-Book Quarter
            </h2>
            <p className="font-body text-text-secondary mt-3 max-w-lg text-[15px] leading-relaxed">
              Read five books before spring. No speed targets, no page counts &mdash;
              just five books that move you. Track your progress on-chain.
              Completers earn a soul-bound &ldquo;Reader&rdquo; badge.
            </p>

            <div className="flex items-center gap-8 mt-6">
              <div>
                <span className="font-display text-2xl text-accent">247</span>
                <p className="text-[11px] text-text-muted font-body mt-0.5">readers joined</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <span className="font-display text-2xl text-text-primary">1,089</span>
                <p className="text-[11px] text-text-muted font-body mt-0.5">books finished</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <span className="font-display text-2xl text-text-primary">62</span>
                <p className="text-[11px] text-text-muted font-body mt-0.5">days remaining</p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background text-sm font-body font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                Browse books to start
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Challenge book covers */}
          <div className="flex -space-x-3 flex-shrink-0">
            {challengeBooks.map((book, i) => (
              <div
                key={book.id}
                className="w-20 h-28 rounded-lg overflow-hidden shadow-[var(--shadow-card)] border border-border/30 flex-shrink-0"
                style={{
                  zIndex: challengeBooks.length - i,
                  transform: `rotate(${(i - 2) * 3}deg)`,
                }}
              >
                <img
                  src={book.coverUri}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

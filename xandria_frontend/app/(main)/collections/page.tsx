"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { collections, resolveCollectionBooks } from "@/data/collections";
import { authors } from "@/data/authors";
import { getReviewsForBook } from "@/data/reviews";
import { getBookMetadata } from "@/data/book-metadata";
import { normalizeTitle } from "@/lib/book-helpers";
import CollectionCard from "@/components/community/collection-card";
import FeaturedCreator from "@/components/community/featured-creator";
import TopCreators from "@/components/community/top-creators";
import CommunityReviews from "@/components/community/community-reviews";
import ReadingChallenge from "@/components/community/reading-challenge";
import FriendsActivity from "@/components/community/friends-activity";
import PublicGoodCta from "@/components/community/public-good-cta";

export default function CollectionsPage() {
  const { books, fetchBooks } = useStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const collectionsWithBooks = useMemo(() => {
    return collections.map((collection) => ({
      collection,
      books: resolveCollectionBooks(collection, books),
    }));
  }, [books]);

  // Featured creator: Dostoevsky (has 2 books)
  const featuredAuthor = useMemo(() => {
    const author = authors.find((a) => a.id === "author-dostoevsky");
    if (!author) return null;
    const authorBooks = author.bookTitles
      .map((t) =>
        books.find(
          (b) =>
            normalizeTitle(b.title) === normalizeTitle(t) ||
            normalizeTitle(b.title).startsWith(normalizeTitle(t)) ||
            normalizeTitle(t).startsWith(normalizeTitle(b.title))
        )
      )
      .filter(Boolean) as typeof books;
    return authorBooks.length > 0 ? { author, books: authorBooks } : null;
  }, [books]);

  // Special edition books
  const specialBooks = useMemo(() => {
    return books.filter((b) => b.isSpecial);
  }, [books]);

  // Collect reviews from all books, enriched with book info
  const allReviews = useMemo(() => {
    return books
      .flatMap((book) =>
        getReviewsForBook(book).map((r) => ({
          ...r,
          bookTitle: book.title,
          bookCover: book.coverUri,
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [books]);

  // Popular highlights across all books
  const topHighlights = useMemo(() => {
    return books
      .flatMap((b) => {
        const meta = getBookMetadata(b);
        return (meta?.commonHighlights ?? []).map((h) => ({
          ...h,
          bookTitle: b.title,
          author: b.author,
        }));
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [books]);

  // Platform stats
  const platformStats = useMemo(() => {
    const totalVotes = books.reduce((s, b) => s + b.votes, 0);
    const totalReadingHours = books.reduce((s, b) => {
      const meta = getBookMetadata(b);
      return s + (meta?.readingTimeMinutes ?? 0);
    }, 0);
    const uniqueGenres = new Set(books.map((b) => b.genre).filter(Boolean));
    return {
      totalBooks: books.length,
      totalVotes,
      totalReadingHours: Math.round(totalReadingHours / 60),
      totalAuthors: authors.length,
      totalCollections: collections.length,
      totalGenres: uniqueGenres.size,
    };
  }, [books]);

  const hasBooks = books.length > 0;

  return (
    <div>
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-accent/[0.015] rounded-full -translate-x-1/2 -translate-y-3/4 blur-3xl" />

        <div className="relative container mx-auto px-6 pt-14 pb-12">
          <h1 className="font-display text-5xl md:text-6xl text-text-primary leading-tight">
            Community
          </h1>
          <p className="text-text-secondary text-[15px] mt-3 font-body max-w-xl leading-relaxed">
            Creators, curated paths, reading challenges, and the voices of readers
            who take books seriously. Browse collections built with intention, not algorithms.
          </p>

          {/* Platform stats strip */}
          {hasBooks && (
            <div className="flex items-center gap-8 mt-8 flex-wrap">
              <div>
                <span className="font-display text-2xl text-accent">{platformStats.totalBooks}</span>
                <p className="text-[11px] text-text-muted font-body mt-0.5">books on-chain</p>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div>
                <span className="font-display text-2xl text-text-primary">{platformStats.totalAuthors}</span>
                <p className="text-[11px] text-text-muted font-body mt-0.5">authors</p>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div>
                <span className="font-display text-2xl text-text-primary">{platformStats.totalCollections}</span>
                <p className="text-[11px] text-text-muted font-body mt-0.5">curated collections</p>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div>
                <span className="font-display text-2xl text-text-primary">{platformStats.totalReadingHours}h</span>
                <p className="text-[11px] text-text-muted font-body mt-0.5">of reading available</p>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div>
                <span className="font-display text-2xl text-text-primary">{platformStats.totalVotes.toLocaleString()}</span>
                <p className="text-[11px] text-text-muted font-body mt-0.5">community votes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Special Editions */}
        {specialBooks.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-2xl text-text-primary">Special Editions</h2>
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-body text-accent bg-accent/10 border border-accent/20 rounded-full">
                    Limited
                  </span>
                </div>
                <p className="text-text-muted text-sm font-body">
                  Hand-picked titles with limited on-chain supply
                </p>
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2">
              {specialBooks.map((book) => {
                const meta = getBookMetadata(book);
                return (
                  <Link key={book.id} href={`/marketplace/${book.id}`} className="group flex-shrink-0">
                    <div className="w-64 rounded-xl border border-accent/20 bg-gradient-to-b from-accent/[0.04] to-surface overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-accent/30">
                      <div className="relative h-80 overflow-hidden">
                        {book.coverUri ? (
                          <img
                            src={book.coverUri}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-hover flex items-center justify-center">
                            <span className="font-display text-lg text-text-muted">{book.title}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] font-body text-accent bg-background/80 backdrop-blur-sm border border-accent/30 rounded-full">
                            {book.remainingSupply}/{book.totalSupply} remaining
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display text-lg text-text-primary group-hover:text-accent transition-colors leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-sm text-text-muted font-body mt-1">{book.author}</p>
                        {meta && (
                          <p className="text-[11px] text-text-muted font-body mt-2 italic">
                            {meta.socialProof}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured Creator */}
        {featuredAuthor && hasBooks && (
          <div className="mb-14">
            <FeaturedCreator
              author={featuredAuthor.author}
              books={featuredAuthor.books}
            />
          </div>
        )}

        {/* Reading Challenge */}
        {hasBooks && (
          <div className="mb-14">
            <ReadingChallenge books={books} />
          </div>
        )}

        {/* Curated Collections */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl text-text-primary">Curated Collections</h2>
              <p className="text-text-muted text-sm mt-1 font-body">
                Paths through the library, each with a reason to exist
              </p>
            </div>
            <span className="text-xs text-text-muted font-body">{collections.length} collections</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionsWithBooks.map(({ collection, books: collectionBooks }) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                books={collectionBooks}
              />
            ))}
          </div>
        </section>

        {/* Popular Highlights */}
        {topHighlights.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display text-2xl text-text-primary mb-2">Most Highlighted</h2>
            <p className="text-text-muted text-sm font-body mb-6">
              The passages readers return to
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topHighlights.map((h, i) => (
                <div
                  key={i}
                  className="relative p-5 rounded-lg border border-border bg-surface"
                >
                  <div className="absolute top-4 right-4 text-[10px] text-accent/50 font-body">
                    {h.count.toLocaleString()} highlights
                  </div>
                  <p className="font-body text-text-secondary italic text-[14px] leading-relaxed pr-16">
                    &ldquo;{h.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                    <span className="text-xs text-text-muted font-body">{h.bookTitle}</span>
                    <span className="text-text-muted/30">&middot;</span>
                    <span className="text-xs text-text-muted font-body">{h.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-column: Top Creators + Friends Activity */}
        {hasBooks && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">
            <div className="lg:col-span-3">
              <TopCreators authors={authors} books={books} />
            </div>
            <div className="lg:col-span-2">
              <FriendsActivity books={books} />
            </div>
          </div>
        )}

        {/* Community Reviews */}
        {allReviews.length > 0 && (
          <div className="mb-14">
            <CommunityReviews reviews={allReviews} />
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-14" />

        {/* Request Book + Public Good Worker */}
        <PublicGoodCta />

        {/* Bottom spacer */}
        <div className="h-12" />
      </div>
    </div>
  );
}

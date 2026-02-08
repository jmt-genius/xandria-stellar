"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { collections, resolveCollectionBooks } from "@/data/collections";
import { getBookMetadata } from "@/data/book-metadata";
import { getReviewsForBook } from "@/data/reviews";
import { getAuthorForBook } from "@/data/authors";
import BookCard from "@/components/book-card";

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { books, fetchBooks } = useStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const collection = useMemo(() => collections.find((c) => c.id === id), [id]);

  const collectionBooks = useMemo(() => {
    if (!collection) return [];
    return resolveCollectionBooks(collection, books);
  }, [collection, books]);

  // Aggregate metadata
  const stats = useMemo(() => {
    let totalMinutes = 0;
    let totalWords = 0;
    const difficulties: string[] = [];
    const allConcepts: string[] = [];
    const tones: string[] = [];

    collectionBooks.forEach((b) => {
      const meta = getBookMetadata(b);
      if (meta) {
        totalMinutes += meta.readingTimeMinutes;
        totalWords += meta.wordCount;
        difficulties.push(meta.difficulty);
        allConcepts.push(...meta.concepts);
        tones.push(meta.tone);
      }
    });

    const uniqueConcepts = Array.from(new Set(allConcepts));
    const uniqueTones = Array.from(new Set(tones));
    const avgDifficulty =
      difficulties.length > 0
        ? (() => {
            const map: Record<string, number> = { Accessible: 1, Moderate: 2, Challenging: 3 };
            const avg =
              difficulties.reduce((s, d) => s + (map[d] ?? 2), 0) / difficulties.length;
            return avg <= 1.5 ? "Accessible" : avg <= 2.5 ? "Moderate" : "Challenging";
          })()
        : "Moderate";

    return {
      totalHours: Math.round(totalMinutes / 60),
      totalWords,
      avgDifficulty,
      concepts: uniqueConcepts,
      tones: uniqueTones,
    };
  }, [collectionBooks]);

  // Reviews from books in this collection
  const collectionReviews = useMemo(() => {
    return collectionBooks
      .flatMap((book) =>
        getReviewsForBook(book).map((r) => ({
          ...r,
          bookTitle: book.title,
          bookCover: book.coverUri,
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 4);
  }, [collectionBooks]);

  // Highlights from books in the collection
  const collectionHighlights = useMemo(() => {
    return collectionBooks
      .flatMap((b) => {
        const meta = getBookMetadata(b);
        return (meta?.commonHighlights ?? []).map((h) => ({
          ...h,
          bookTitle: b.title,
          author: b.author,
        }));
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [collectionBooks]);

  // Authors in this collection
  const collectionAuthors = useMemo(() => {
    const seen = new Set<string>();
    return collectionBooks
      .map((b) => {
        const author = getAuthorForBook(b);
        if (!author || seen.has(author.id)) return null;
        seen.add(author.id);
        return author;
      })
      .filter(Boolean) as NonNullable<ReturnType<typeof getAuthorForBook>>[];
  }, [collectionBooks]);

  // Related collections (share at least 2 books)
  const relatedCollections = useMemo(() => {
    if (!collection) return [];
    const currentTitles = new Set(collection.bookTitles);
    return collections
      .filter((c) => c.id !== collection.id)
      .map((c) => ({
        collection: c,
        overlap: c.bookTitles.filter((t) => currentTitles.has(t)).length,
      }))
      .filter((c) => c.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 3)
      .map((c) => c.collection);
  }, [collection]);

  if (!collection) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="font-display text-xl text-text-secondary mb-4">Collection not found</p>
        <Link href="/collections" className="text-accent text-sm hover:underline">
          Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/[0.02] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />

        <div className="relative container mx-auto px-6 py-14">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors font-body mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Collections
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] font-body text-accent bg-accent/10 border border-accent/20 rounded-full">
                Collection
              </span>
              <span className="text-[11px] text-text-muted font-body">
                {collectionBooks.length} {collectionBooks.length === 1 ? "book" : "books"}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight">
              {collection.title}
            </h1>
            <p className="font-body text-text-secondary text-[15px] leading-relaxed mt-4 max-w-2xl">
              {collection.description}
            </p>

            <p className="font-body text-xs text-text-muted mt-5">
              Curated by <span className="text-text-secondary">{collection.curatorName}</span>
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-8 pb-2">
            <div>
              <span className="font-display text-2xl text-accent">{stats.totalHours}</span>
              <p className="text-[11px] text-text-muted font-body mt-0.5">hours of reading</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="font-display text-2xl text-text-primary">{collectionBooks.length}</span>
              <p className="text-[11px] text-text-muted font-body mt-0.5">books</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="font-display text-2xl text-text-primary">{stats.avgDifficulty}</span>
              <p className="text-[11px] text-text-muted font-body mt-0.5">avg difficulty</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="font-display text-2xl text-text-primary">{stats.concepts.length}</span>
              <p className="text-[11px] text-text-muted font-body mt-0.5">concepts covered</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Concept cloud */}
        {stats.concepts.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-lg text-text-secondary mb-3">Concepts you&apos;ll encounter</h2>
            <div className="flex flex-wrap gap-2">
              {stats.concepts.map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 text-xs bg-accent/[0.06] text-accent/70 border border-accent/15 rounded-full font-body"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Book grid */}
        <section className="mb-14">
          <h2 className="font-display text-2xl text-text-primary mb-6">The Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Popular highlights from this collection */}
        {collectionHighlights.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display text-2xl text-text-primary mb-2">Popular Highlights</h2>
            <p className="text-text-muted text-sm font-body mb-6">
              The most-highlighted passages from books in this collection
            </p>
            <div className="space-y-4">
              {collectionHighlights.map((highlight, i) => (
                <div
                  key={i}
                  className="relative pl-6 py-4 border-l-2 border-accent/30"
                >
                  <p className="font-body text-text-secondary italic text-[15px] leading-relaxed">
                    &ldquo;{highlight.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-text-muted font-body">
                      {highlight.bookTitle}
                    </span>
                    <span className="text-text-muted/30">&middot;</span>
                    <span className="text-xs text-text-muted font-body">
                      {highlight.author}
                    </span>
                    <span className="text-text-muted/30">&middot;</span>
                    <span className="text-[10px] text-accent/60 font-body">
                      {highlight.count.toLocaleString()} highlights
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {collectionReviews.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display text-2xl text-text-primary mb-2">What Readers Say</h2>
            <p className="text-text-muted text-sm font-body mb-6">
              Reviews from readers of books in this collection
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collectionReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-5 rounded-lg border border-border bg-surface"
                >
                  <p className="font-body text-text-secondary text-[14px] leading-relaxed italic">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <span className="text-xs font-body text-text-muted">
                      {review.reviewerName}
                    </span>
                    <span className="text-xs font-body text-text-muted truncate max-w-[160px]">
                      on {review.bookTitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Authors in this collection */}
        {collectionAuthors.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display text-2xl text-text-primary mb-2">The Authors</h2>
            <p className="text-text-muted text-sm font-body mb-6">
              The minds behind this collection
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collectionAuthors.map((author) => (
                <Link key={author.id} href={`/author/${author.id}`} className="group">
                  <div className="p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors">
                    <h3 className="font-display text-lg text-text-primary group-hover:text-accent transition-colors">
                      {author.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {author.fields.slice(0, 3).map((field) => (
                        <span
                          key={field}
                          className="text-[10px] text-text-muted font-body"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                    <p className="font-body text-xs text-text-muted mt-2 line-clamp-2">
                      {author.bio}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tones */}
        {stats.tones.length > 0 && (
          <section className="mb-14 p-6 rounded-xl border border-border bg-surface">
            <h3 className="font-display text-lg text-text-secondary mb-3">Reading tones in this collection</h3>
            <div className="flex flex-wrap gap-3">
              {stats.tones.map((tone) => (
                <div
                  key={tone}
                  className="px-4 py-2 rounded-lg bg-surface-hover border border-border"
                >
                  <span className="font-display text-sm text-text-primary">{tone}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related collections */}
        {relatedCollections.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-2xl text-text-primary mb-2">Related Collections</h2>
            <p className="text-text-muted text-sm font-body mb-6">
              Collections with overlapping books or themes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCollections.map((rc) => (
                <Link key={rc.id} href={`/collections/${rc.id}`}>
                  <div className="p-5 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-accent/20 transition-all">
                    <h3 className="font-display text-lg text-text-primary">
                      {rc.title}
                    </h3>
                    <p className="font-body text-sm text-text-muted mt-1 line-clamp-2">
                      {rc.subtitle}
                    </p>
                    <span className="inline-block mt-3 text-xs text-accent font-body">
                      View collection &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

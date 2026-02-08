"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/useStore";
import ReadingDigest from "@/components/home/reading-digest";
import ContinueReading from "@/components/home/continue-reading";
import IdeasAbsorbed from "@/components/home/ideas-absorbed";
import CommunityActivity from "@/components/home/community-activity";
import OwnedBookCard from "@/components/owned-book-card";
import BookCard from "@/components/book-card";

export default function HomePage() {
  const { walletAddress, ownedBooks, books, fetchBooks, readingSessions, getReadingProfile, isOwned } = useStore();
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const myBooks = useMemo(
    () => ownedBooks.filter((b) => b.ownerAddress === walletAddress),
    [ownedBooks, walletAddress]
  );

  // Redirect if not eligible
  useEffect(() => {
    if (!walletAddress || myBooks.length === 0) {
      router.replace("/marketplace");
    }
  }, [walletAddress, myBooks.length, router]);

  const profile = getReadingProfile();

  // Find most recent session for continue reading
  const recentSession = useMemo(() => {
    const completed = readingSessions
      .filter((s) => s.endedAt)
      .toSorted((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    return completed[0] ?? null;
  }, [readingSessions]);

  // Build book lookup map for O(1) access
  const bookById = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  const continueBook = recentSession ? bookById.get(recentSession.bookId) ?? null : null;
  const continueOwned = recentSession ? myBooks.find((o) => o.bookId === recentSession.bookId) : null;

  const continueProgress = useMemo(() => {
    if (!continueBook || !continueOwned) return 0;
    const totalPages = continueBook.chapters.reduce((sum, ch) => sum + ch.content.length, 0);
    return totalPages > 0 ? continueOwned.currentPage / totalPages : 0;
  }, [continueBook, continueOwned]);

  // === MOST FREQUENTLY READ BOOKS ===
  // Rank owned books by total reading session time
  const frequentlyRead = useMemo(() => {
    if (myBooks.length === 0 || books.length === 0) return [];

    // Aggregate session time per book
    const timeByBook: Record<number, number> = {};
    for (const s of readingSessions) {
      if (s.endedAt) {
        timeByBook[s.bookId] = (timeByBook[s.bookId] || 0) + s.durationMinutes;
      }
    }

    return myBooks
      .toSorted((a, b) => (timeByBook[b.bookId] || 0) - (timeByBook[a.bookId] || 0))
      .slice(0, 4)
      .reduce<Array<{ owned: typeof myBooks[0]; book: (typeof books)[0] }>>((acc, ob) => {
        const book = bookById.get(ob.bookId);
        if (book) acc.push({ owned: ob, book });
        return acc;
      }, []);
  }, [myBooks, bookById, readingSessions]);

  // === PERSONALIZED RECOMMENDATIONS ===
  // Recommend marketplace books the user doesn't own, matching their top genres
  const recommendations = useMemo(() => {
    if (books.length === 0) return [];

    const topGenres = profile.topGenres;
    const ownedIds = new Set(myBooks.map((b) => b.bookId));

    // Score unowned books: genre match gets priority, then rating
    const scored = books
      .filter((b) => !ownedIds.has(b.id))
      .map((b) => {
        const genreIndex = topGenres.indexOf(b.genre);
        // Lower genreScore = better match. Books matching top genre get highest priority.
        const genreScore = genreIndex >= 0 ? genreIndex : topGenres.length;
        return { book: b, genreScore, rating: b.rating };
      })
      .toSorted((a, b) => {
        // Primary: genre relevance. Secondary: rating.
        if (a.genreScore !== b.genreScore) return a.genreScore - b.genreScore;
        return b.rating - a.rating;
      });

    return scored.slice(0, 4).map((s) => s.book);
  }, [books, myBooks, profile.topGenres]);

  if (!walletAddress || myBooks.length === 0) return null;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-text-primary mb-1">Home</h1>
      <p className="text-text-secondary text-sm mb-10">Your reading life at a glance</p>

      <div className="space-y-12">
        <ReadingDigest profile={profile} />

        {continueBook && recentSession && (
          <ContinueReading
            book={continueBook}
            lastSession={recentSession}
            progress={continueProgress}
          />
        )}

        {/* Most frequently read books from library */}
        {frequentlyRead.length > 0 && (
          <section>
            <h2 className="font-display text-xl text-text-primary mb-1">
              Your most read
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              The books you keep returning to
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {frequentlyRead.map(({ book, owned }) => (
                <OwnedBookCard key={owned.bookId} book={book} ownedBook={owned} />
              ))}
            </div>
          </section>
        )}

        {/* Personalized recommendations from marketplace */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="font-display text-xl text-text-primary mb-1">
              Recommended for you
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Based on what you read most
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendations.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IdeasAbsorbed concepts={profile.topConcepts} />
          <CommunityActivity />
        </div>
      </div>
    </div>
  );
}

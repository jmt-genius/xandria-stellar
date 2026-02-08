"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/useStore";
import ReadingDigest from "@/components/home/reading-digest";
import ContinueReading from "@/components/home/continue-reading";
import IdeasAbsorbed from "@/components/home/ideas-absorbed";
import CommunityActivity from "@/components/home/community-activity";

export default function HomePage() {
  const { walletAddress, ownedBooks, books, fetchBooks, readingSessions, getReadingProfile } = useStore();
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

  const continueBook = recentSession ? books.find((b) => b.id === recentSession.bookId) : null;
  const continueOwned = recentSession ? myBooks.find((o) => o.bookId === recentSession.bookId) : null;

  const continueProgress = useMemo(() => {
    if (!continueBook || !continueOwned) return 0;
    const totalPages = continueBook.chapters.reduce((sum, ch) => sum + ch.content.length, 0);
    return totalPages > 0 ? continueOwned.currentPage / totalPages : 0;
  }, [continueBook, continueOwned]);

  if (!walletAddress || myBooks.length === 0) return null;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-text-primary mb-1">Home</h1>
      <p className="text-text-secondary text-sm mb-10">Your reading life at a glance</p>

      <div className="space-y-8">
        <ReadingDigest profile={profile} />

        {continueBook && recentSession && (
          <ContinueReading
            book={continueBook}
            lastSession={recentSession}
            progress={continueProgress}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IdeasAbsorbed concepts={profile.topConcepts} />
          <CommunityActivity />
        </div>
      </div>
    </div>
  );
}

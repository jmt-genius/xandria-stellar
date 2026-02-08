"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { getAuthorById } from "@/data/authors";
import { normalizeTitle } from "@/lib/book-helpers";
import AuthorHeader from "@/components/community/author-header";
import BookCard from "@/components/book-card";

export default function AuthorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { books, fetchBooks } = useStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const author = useMemo(() => getAuthorById(id), [id]);

  const authorBooks = useMemo(() => {
    if (!author) return [];
    return books.filter((b) =>
      author.bookTitles.some(
        (t) =>
          normalizeTitle(t) === normalizeTitle(b.title) ||
          normalizeTitle(b.title).startsWith(normalizeTitle(t)) ||
          normalizeTitle(t).startsWith(normalizeTitle(b.title)),
      ),
    );
  }, [author, books]);

  if (!author) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="font-display text-xl text-text-secondary mb-4">Author not found</p>
        <Link href="/marketplace" className="text-accent text-sm hover:underline">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <AuthorHeader author={author} />

        {authorBooks.length > 0 && (
          <div>
            <h2 className="font-body text-xs tracking-[0.08em] uppercase text-text-muted mb-4">
              Published on Xandria
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {authorBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { collections } from "@/data/collections";
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
    const bookMap = new Map<number, typeof books[0]>();
    for (const b of books) bookMap.set(b.id, b);
    return collection.bookIds
      .map((bookId) => bookMap.get(bookId))
      .filter(Boolean) as typeof books;
  }, [collection, books]);

  if (!collection) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="font-display text-xl text-text-secondary mb-4">Collection not found</p>
        <Link href="/collections" className="text-accent text-sm hover:underline">
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl text-text-primary">{collection.title}</h1>
        <p className="font-body text-sm text-text-muted mt-1 mb-4">{collection.subtitle}</p>
        <p className="font-body text-text-secondary leading-relaxed max-w-2xl mb-10">
          {collection.description}
        </p>
        <p className="font-body text-xs text-text-muted mb-6">
          Curated by {collection.curatorName}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { useStore } from "@/stores/useStore";
import { collections } from "@/data/collections";
import CollectionCard from "@/components/community/collection-card";

export default function CollectionsPage() {
  const { books, fetchBooks } = useStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Build book lookup map once
  const bookMap = useMemo(() => {
    const map = new Map<number, typeof books[0]>();
    for (const b of books) map.set(b.id, b);
    return map;
  }, [books]);

  const collectionsWithBooks = useMemo(() => {
    return collections.map((collection) => ({
      collection,
      books: collection.bookIds
        .map((id) => bookMap.get(id))
        .filter(Boolean) as typeof books,
    }));
  }, [bookMap]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-text-primary mb-1">Collections</h1>
      <p className="text-text-secondary text-sm mb-10">Curated paths through the library</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionsWithBooks.map(({ collection, books: collectionBooks }) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            books={collectionBooks}
          />
        ))}
      </div>
    </div>
  );
}

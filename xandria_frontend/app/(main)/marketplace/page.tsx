"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/stores/useStore";
import BookCard from "@/components/book-card";
import { allGenres } from "@/data/books";
import { editorialRows } from "@/data/editorial";

const CircularGallery = dynamic(() => import("@/components/circular-gallery"), {
  ssr: false,
  loading: () => null,
});
const EditorialRow = dynamic(() => import("@/components/marketplace/editorial-row"));

function BookCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-surface animate-pulse">
      <div className="aspect-[2/3] bg-surface-hover" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-surface-hover rounded w-3/4" />
        <div className="h-4 bg-surface-hover rounded w-1/2" />
        <div className="h-4 bg-surface-hover rounded w-1/3" />
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const { books, booksLoading, booksError, fetchBooks } = useStore();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const galleryItems = useMemo(
    () =>
      books
        .filter((b) => b.coverUri)
        .slice(0, 8)
        .map((b) => ({ image: b.coverUri, text: b.title })),
    [books]
  );

  const filteredBooks = useMemo(() => {
    let result = books;

    if (selectedGenre !== "All") {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }

    const sortFn = (a: typeof books[0], b: typeof books[0]) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "newest": return b.id - a.id;
        default: return b.rating - a.rating;
      }
    };

    return result.toSorted(sortFn);
  }, [books, selectedGenre, sortBy, search]);

  // Build book index Map for O(1) lookups
  const bookMap = useMemo(() => {
    const map = new Map<number, typeof books[0]>();
    for (const book of books) map.set(book.id, book);
    return map;
  }, [books]);

  // Build editorial rows with real book data
  const editorialRowsWithBooks = useMemo(() => {
    return editorialRows.map((row) => ({
      ...row,
      books: row.bookIds
        .map((id) => bookMap.get(id))
        .filter(Boolean) as typeof books,
    }));
  }, [bookMap]);

  return (
    <div>
      {/* Hero - CircularGallery (only if enough books with covers) */}
      {galleryItems.length >= 3 && (
        <div className="h-[420px] w-full">
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#E8E0D4"
            borderRadius={0.05}
            font="bold 28px 'Cormorant Garamond'"
          />
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* Editorial Rows */}
        {!booksLoading && books.length > 0 && (
          <div className="mb-12">
            {editorialRowsWithBooks.map((row) => (
              <EditorialRow
                key={row.id}
                title={row.title}
                subtitle={row.subtitle}
                books={row.books}
              />
            ))}
          </div>
        )}

        {/* Search */}
        <div className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm bg-surface border border-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 font-body"
          />

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 text-xs font-body whitespace-nowrap rounded transition-colors ${
                    selectedGenre === genre
                      ? "bg-accent text-background"
                      : "bg-surface border border-border text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm text-text-secondary font-body focus:outline-none"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Error state */}
        {booksError && (
          <div className="text-center py-8 mb-6">
            <p className="text-error text-sm mb-2">
              Failed to load books from contract
            </p>
            <p className="text-text-muted text-xs mb-4">{booksError}</p>
            <button
              onClick={() => {
                // Clear error and retry
                useStore.setState({ booksError: null, books: [] });
                fetchBooks();
              }}
              className="text-accent text-sm hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Book Grid */}
        {booksLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary text-sm">
              No books match your filters
            </p>
            <button
              onClick={() => {
                setSelectedGenre("All");
                setSearch("");
              }}
              className="text-accent text-sm mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : !booksError ? (
          <div className="text-center py-16">
            <p className="font-display text-xl text-text-secondary">
              No books published yet
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

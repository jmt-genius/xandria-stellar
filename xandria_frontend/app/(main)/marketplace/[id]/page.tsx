"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { getContractClient, stroopsToXlm } from "@/lib/stellar";
import { bookEnrichment } from "@/data/books";
import PurchaseModal from "@/components/purchase-modal";
import MintNumberOverlay from "@/components/mint-number-overlay";
import type { Book } from "@/types";

function RatingDots({ rating, votes }: { rating: number; votes: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= Math.round(rating) ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="text-text-muted text-xs">({votes})</span>
    </div>
  );
}

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const bookId = parseInt(id);

  const { books, fetchBooks, isOwned, getOwnedBook, walletAddress, checkOnChainOwnership, purchaseBook } = useStore();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [onChainOwned, setOnChainOwned] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      // Try from store first
      await fetchBooks();
      const storeBook = useStore.getState().getBookById(bookId);
      if (storeBook) {
        setBook(storeBook);
        setLoading(false);

        // Check on-chain ownership
        if (walletAddress && !useStore.getState().isOwned(bookId)) {
          // Check if author
          if (storeBook.authorAddress === walletAddress) {
            purchaseBook(bookId, 0, "author");
            setOnChainOwned(true);
          } else {
            const owned = await checkOnChainOwnership(bookId);
            if (owned) {
              purchaseBook(bookId, 0, "on-chain");
              setOnChainOwned(true);
            }
          }
        }
        return;
      }

      // Fallback: fetch directly
      try {
        const client = getContractClient();
        const result = await client.get_book({ book_id: bookId });
        if (result.result) {
          const cb = result.result;
          let coverUri = cb.cover_uri || "";
          let bookUri = cb.book_uri || "";
          if ((!coverUri || !bookUri) && (cb as any).metadata_uri) {
            try {
              const res = await fetch((cb as any).metadata_uri);
              const metadata = await res.json();
              coverUri = coverUri || metadata.cover_uri || "";
              bookUri = bookUri || metadata.book_uri || "";
            } catch {}
          }
          const enrichment = bookEnrichment[bookId] || {};
          const remainingSupply = Number(cb.remaining_supply);
          setBook({
            id: bookId,
            title: cb.title,
            author: cb.author,
            price: stroopsToXlm(cb.price),
            coverUri,
            bookUri,
            isSpecial: cb.is_special,
            totalSupply: Number(cb.total_supply),
            remainingSupply: remainingSupply >= 4294967295 ? -1 : remainingSupply,
            authorAddress: cb.author_address,
            description: enrichment.description || "",
            rating: enrichment.rating || 4,
            votes: enrichment.votes || 0,
            genre: enrichment.genre || "Literature",
            chapters: enrichment.chapters || [],
            aiSummary: enrichment.aiSummary || "",
          });
        }
      } catch (e) {
        console.error("Error fetching book:", e);
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [bookId, fetchBooks, walletAddress, checkOnChainOwnership, purchaseBook]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="md:w-[40%]">
            <div className="aspect-[2/3] bg-surface rounded-lg animate-pulse" />
          </div>
          <div className="md:w-[60%] space-y-4">
            <div className="h-4 bg-surface rounded w-24 animate-pulse" />
            <div className="h-10 bg-surface rounded w-3/4 animate-pulse" />
            <div className="h-5 bg-surface rounded w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="font-display text-xl text-text-secondary mb-4">
          Book not found
        </p>
        <Link href="/marketplace" className="text-accent text-sm hover:underline">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const owned = isOwned(bookId);
  const ownedBook = getOwnedBook(bookId);
  const isSoldOut = book.isSpecial && book.remainingSupply === 0;
  const editionCount =
    book.remainingSupply === -1
      ? "Unlimited editions"
      : `${book.totalSupply - book.remainingSupply} editions minted`;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left: Cover */}
        <div className="md:w-[40%]">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-[var(--shadow-cover)]">
            {book.coverUri ? (
              <img
                src={book.coverUri}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-hover flex items-center justify-center">
                <span className="font-display text-2xl text-text-muted text-center px-6">
                  {book.title}
                </span>
              </div>
            )}
            {owned && ownedBook && (
              <MintNumberOverlay mintNumber={ownedBook.mintNumber} />
            )}
          </div>
          <p className="font-mono text-xs text-text-muted mt-3">
            {editionCount}
          </p>
          {owned && ownedBook && (
            <p className="text-accent text-sm mt-1">
              Edition {String(ownedBook.mintNumber).padStart(4, "0")} — Yours
            </p>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-[60%]">
          <p className="font-body text-xs tracking-[0.08em] uppercase text-text-muted mb-3">
            {book.genre}
          </p>
          <h1 className="font-display text-4xl text-text-primary leading-tight">
            {book.title}
          </h1>
          <div className="border-t border-border mt-3 pt-3 mb-4">
            <p className="font-body text-text-secondary">{book.author}</p>
          </div>
          <div className="mb-6">
            <RatingDots rating={book.rating} votes={book.votes} />
          </div>
          <p className="font-mono text-3xl text-accent mb-6">
            {book.price % 1 === 0
              ? Math.round(book.price)
              : book.price.toFixed(2)}{" "}
            XLM
          </p>

          {book.description && (
            <p className="font-body text-text-secondary leading-[1.75] max-w-[480px] mb-6">
              {book.description}
            </p>
          )}

          {book.aiSummary && (
            <div className="mb-8">
              <button
                onClick={() => setShowAiSummary(!showAiSummary)}
                className="text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                {showAiSummary ? "Hide" : "Show"} AI Summary
              </button>
              {showAiSummary && (
                <div className="mt-3 pl-4 border-l-2 border-accent/30">
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {book.aiSummary}
                  </p>
                </div>
              )}
            </div>
          )}

          {owned ? (
            <Link
              href={`/library/${book.id}/read`}
              className="inline-block py-3.5 px-10 bg-background border border-accent text-accent font-body font-medium text-sm transition-colors hover:bg-accent hover:text-background"
            >
              Read
            </Link>
          ) : isSoldOut ? (
            <button
              disabled
              className="py-3.5 px-10 bg-surface text-text-muted font-body font-medium text-sm cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="py-3.5 px-10 bg-accent text-background font-body font-medium text-sm transition-opacity hover:opacity-90"
            >
              Own This Book
            </button>
          )}
        </div>
      </div>

      {showPurchaseModal && book && (
        <PurchaseModal book={book} onClose={() => setShowPurchaseModal(false)} />
      )}
    </div>
  );
}

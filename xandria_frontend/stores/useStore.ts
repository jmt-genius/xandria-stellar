"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book, OwnedBook, AiMessage, Notification } from "@/types";
import { getContractClient, stroopsToXlm } from "@/lib/stellar";
import { XLM_TOKEN_ADDRESS, NETWORK_PASSPHRASE } from "@/lib/constants";
import { bookEnrichment } from "@/data/books";
import { getAiResponse } from "@/data/ai-responses";

interface AppStore {
  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // Wallet (not persisted — managed by wallet-indicator directly)
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;

  // Books
  books: Book[];
  booksLoading: boolean;
  booksError: string | null;
  fetchBooks: () => Promise<void>;
  getBookById: (id: number) => Book | undefined;

  // Owned books (persisted + on-chain check)
  ownedBooks: OwnedBook[];
  purchaseBook: (bookId: number, mintNumber: number, txHash: string) => void;
  buyBookOnChain: (bookId: number) => Promise<void>;
  checkOnChainOwnership: (bookId: number) => Promise<boolean>;
  syncOwnedBooks: () => Promise<void>;
  isOwned: (bookId: number) => boolean;
  getOwnedBook: (bookId: number) => OwnedBook | undefined;

  // Reading progress (persisted)
  currentPage: Record<number, number>;
  setCurrentPage: (bookId: number, page: number) => void;

  // AI
  aiMessages: Record<number, AiMessage[]>;
  sendAiMessage: (bookId: number, message: string) => Promise<void>;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  dismissNotification: (id: string) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Hydration
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      // Wallet — simple, not persisted
      walletAddress: null,
      setWalletAddress: (address) => set({ walletAddress: address }),

      // Books
      books: [],
      booksLoading: false,
      booksError: null,

      fetchBooks: async () => {
        // Allow refetch if previous attempt failed
        if (get().booksLoading) return;
        if (get().books.length > 0 && !get().booksError) return;

        set({ booksLoading: true, booksError: null });
        try {
          const client = getContractClient();
          const loadedBooks: Book[] = [];
          let id = 1;
          let consecutiveErrors = 0;

          while (id < 50 && consecutiveErrors < 3) {
            try {
              const result = await client.get_book({ book_id: id });
              if (result.result) {
                const cb = result.result;
                let coverUri = cb.cover_uri || "";
                let bookUri = cb.book_uri || "";

                // Fallback to metadata_uri for older books
                if ((!coverUri || !bookUri) && (cb as any).metadata_uri) {
                  try {
                    const res = await fetch((cb as any).metadata_uri);
                    const metadata = await res.json();
                    coverUri = coverUri || metadata.cover_uri || "";
                    bookUri = bookUri || metadata.book_uri || "";
                  } catch {
                    // metadata fetch failed, continue with what we have
                  }
                }

                const enrichment = bookEnrichment[id] || {};
                const remainingSupply = Number(cb.remaining_supply);

                loadedBooks.push({
                  id,
                  title: cb.title,
                  author: cb.author,
                  price: stroopsToXlm(cb.price),
                  coverUri,
                  bookUri,
                  isSpecial: cb.is_special,
                  totalSupply: Number(cb.total_supply),
                  remainingSupply:
                    remainingSupply >= 4294967295 ? -1 : remainingSupply,
                  authorAddress: cb.author_address,
                  description: enrichment.description || "",
                  rating: enrichment.rating || 4,
                  votes: enrichment.votes || 0,
                  genre: enrichment.genre || "Literature",
                  chapters: enrichment.chapters || [],
                  aiSummary: enrichment.aiSummary || "",
                });
                id++;
                consecutiveErrors = 0;
              } else {
                // No result for this ID — we've reached the end
                break;
              }
            } catch (err) {
              console.warn(`Failed to fetch book ${id}:`, err);
              consecutiveErrors++;
              id++;
            }
          }

          set({ books: loadedBooks, booksLoading: false, booksError: null });
        } catch (error) {
          console.error("Failed to fetch books:", error);
          set({
            booksLoading: false,
            booksError:
              error instanceof Error ? error.message : "Failed to load books",
          });
        }
      },

      getBookById: (id) => get().books.find((b) => b.id === id),

      // Owned books
      ownedBooks: [],

      purchaseBook: (bookId, mintNumber, txHash) => {
        const book = get().getBookById(bookId);
        if (!book) return;
        set({
          ownedBooks: [
            ...get().ownedBooks,
            {
              bookId,
              mintNumber,
              editionCover: book.coverUri,
              purchasedAt: new Date().toISOString(),
              txHash,
              currentPage: 0,
            },
          ],
        });
      },

      buyBookOnChain: async (bookId) => {
        const address = get().walletAddress;
        if (!address) throw new Error("Wallet not connected");

        const { signTransaction } = await import("@stellar/freighter-api");
        const client = getContractClient(address);

        const tx = await client.buy_book({
          buyer: address,
          book_id: bookId,
          token_address: XLM_TOKEN_ADDRESS,
        });

        const { result } = await tx.signAndSend({
          signTransaction: async (xdr: string) => {
            const { signedTxXdr } = await signTransaction(xdr, {
              networkPassphrase: NETWORK_PASSPHRASE,
            });
            return { signedTxXdr };
          },
        });

        // Record locally after successful on-chain purchase
        const book = get().getBookById(bookId);
        const mintNumber = book?.isSpecial && book.remainingSupply > 0
          ? book.totalSupply - book.remainingSupply + 1
          : Math.floor(Math.random() * 200) + 1;
        get().purchaseBook(bookId, mintNumber, `tx_${Date.now()}_${bookId}`);
      },

      checkOnChainOwnership: async (bookId) => {
        const address = get().walletAddress;
        if (!address) return false;
        try {
          const client = getContractClient();
          const result = await client.has_purchased({
            buyer: address,
            book_id: bookId,
          });
          return !!result.result;
        } catch {
          return false;
        }
      },

      syncOwnedBooks: async () => {
        const address = get().walletAddress;
        if (!address) return;
        const books = get().books;
        const client = getContractClient();

        for (const book of books) {
          if (get().isOwned(book.id)) continue;
          // Check if author
          if (book.authorAddress === address) {
            get().purchaseBook(book.id, 0, "author");
            continue;
          }
          try {
            const result = await client.has_purchased({
              buyer: address,
              book_id: book.id,
            });
            if (result.result) {
              get().purchaseBook(book.id, 0, "on-chain");
            }
          } catch {
            // skip
          }
        }
      },

      isOwned: (bookId) => get().ownedBooks.some((b) => b.bookId === bookId),
      getOwnedBook: (bookId) =>
        get().ownedBooks.find((b) => b.bookId === bookId),

      // Reading
      currentPage: {},
      setCurrentPage: (bookId, page) => {
        set({ currentPage: { ...get().currentPage, [bookId]: page } });
        set({
          ownedBooks: get().ownedBooks.map((b) =>
            b.bookId === bookId ? { ...b, currentPage: page } : b
          ),
        });
      },

      // AI
      aiMessages: {},
      sendAiMessage: async (bookId, message) => {
        const existing = get().aiMessages[bookId] || [];
        const userMsg: AiMessage = {
          id: crypto.randomUUID(),
          role: "user",
          content: message,
          timestamp: new Date().toISOString(),
        };
        set({
          aiMessages: {
            ...get().aiMessages,
            [bookId]: [...existing, userMsg],
          },
        });

        await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

        const response = getAiResponse(bookId, message);
        const aiMsg: AiMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          timestamp: new Date().toISOString(),
        };
        set({
          aiMessages: {
            ...get().aiMessages,
            [bookId]: [...(get().aiMessages[bookId] || []), aiMsg],
          },
        });
      },

      // Notifications
      notifications: [],
      addNotification: (notification) => {
        set({ notifications: [...get().notifications, notification] });
        setTimeout(() => get().dismissNotification(notification.id), 4000);
      },
      dismissNotification: (id) => {
        set({ notifications: get().notifications.filter((n) => n.id !== id) });
      },
    }),
    {
      name: "xandria-store",
      partialize: (state) => ({
        ownedBooks: state.ownedBooks,
        currentPage: state.currentPage,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

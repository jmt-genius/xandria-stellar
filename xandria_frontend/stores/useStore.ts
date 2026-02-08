"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book, OwnedBook, AiMessage, Notification, ReadingSession, ReadingProfile, ShelfMode, AiPaneMode, InfoModalType, Highlight } from "@/types";
import { getContractClient, stroopsToXlm } from "@/lib/stellar";
import { XLM_TOKEN_ADDRESS, NETWORK_PASSPHRASE } from "@/lib/constants";
import { bookEnrichment } from "@/data/books";
import { mockSessions } from "@/data/mock-sessions";
import { bookMetadata } from "@/data/book-metadata";
import { uuid } from "@/lib/utils";

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
  clearOwnedBooks: () => void; // Clear all owned books (useful when contract changes)
  isOwned: (bookId: number) => boolean;
  getOwnedBook: (bookId: number) => OwnedBook | undefined;

  // Reading progress (persisted)
  currentPage: Record<number, number>;
  setCurrentPage: (bookId: number, page: number) => void;

  // AI
  aiMessages: Record<number, AiMessage[]>;
  sendAiMessage: (bookId: number, message: string, selectedText?: string | null) => Promise<void>;

  // Selected text context (transient, not persisted)
  selectedText: string | null;
  setSelectedText: (text: string | null) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  dismissNotification: (id: string) => void;

  // Reading sessions (persisted)
  readingSessions: ReadingSession[];
  startReadingSession: (bookId: number) => string;
  endReadingSession: (sessionId: string, ideasExtracted: string[]) => void;
  getReadingProfile: () => ReadingProfile;

  // Shelf mode (persisted)
  shelfMode: ShelfMode;
  setShelfMode: (mode: ShelfMode) => void;

  // AI pane mode
  aiPaneMode: AiPaneMode;
  setAiPaneMode: (mode: AiPaneMode) => void;

  // Info modals
  activeInfoModal: InfoModalType | null;
  setActiveInfoModal: (modal: InfoModalType | null) => void;

  // Highlights (persisted)
  highlights: Highlight[];
  addHighlight: (h: Highlight) => void;
  removeHighlight: (id: string) => void;
  getHighlightsForPage: (bookId: number, chapterIndex: number, pageInChapter: number) => Highlight[];

  // Sound preference (persisted)
  soundEnabled: boolean;
  toggleSound: () => void;
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

                if (id === 1 || id === 2) {
                  console.log(`[Debug] Book ${id} Raw Contract Data:`, cb);
                  console.log(`[Debug] Book ${id} Resolved URIs:`, { coverUri, bookUri });
                }

                const enrichment = bookEnrichment[id] || {};
                const remainingSupply = Number(cb.remaining_supply);

                // If we have a valid bookUri (EPUB/PDF), we should NOT use hardcoded chapters from enrichment
                // This prevents "1984" content appearing for user uploads that have ID 2 but are different books
                const chapters = bookUri ? [] : (enrichment.chapters || []);

                if (bookUri && enrichment.chapters?.length) {
                  console.log(`[Debug] Book ${id} has bookUri, ignoring hardcoded chapters.`);
                }

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
                  chapters: chapters,
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

      getBookById: (id) => {
        const books = get().books;
        // For small arrays (< 50 books), linear search is fine.
        // Avoids building a Map on every call.
        return books.find((b) => b.id === id);
      },

      // Owned books
      ownedBooks: [],

      purchaseBook: (bookId, mintNumber, txHash) => {
        const address = get().walletAddress;
        if (!address) return;
        const book = get().getBookById(bookId);
        if (!book) return;
        // Don't add duplicates for the same wallet
        if (get().ownedBooks.some((b) => b.bookId === bookId && b.ownerAddress === address)) return;
        set({
          ownedBooks: [
            ...get().ownedBooks,
            {
              bookId,
              ownerAddress: address,
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

        // Dynamic import is intentional here — this only runs on user click,
        // never during SSR or initial render. Keeps freighter out of the store module scope.
        const freighter = await import("@stellar/freighter-api");
        const client = getContractClient(address);

        const tx = await client.buy_book({
          buyer: address,
          book_id: bookId,
          token_address: XLM_TOKEN_ADDRESS,
        });

        await tx.signAndSend({
          signTransaction: async (xdr: string) => {
            const { signedTxXdr } = await freighter.signTransaction(xdr, {
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
        if (books.length === 0) return;
        const client = getContractClient();

        for (const book of books) {
          // Re-check isOwned each iteration since purchaseBook mutates state
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
            if (result.result && !get().isOwned(book.id)) {
              get().purchaseBook(book.id, 0, "on-chain");
            }
          } catch {
            // skip — contract call failed for this book
          }
        }
      },

      isOwned: (bookId) => {
        const address = get().walletAddress;
        if (!address) return false;
        return get().ownedBooks.some((b) => b.bookId === bookId && b.ownerAddress === address);
      },
      getOwnedBook: (bookId) => {
        const address = get().walletAddress;
        if (!address) return undefined;
        return get().ownedBooks.find((b) => b.bookId === bookId && b.ownerAddress === address);
      },

      clearOwnedBooks: () => {
        set({ ownedBooks: [] });
      },

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

      // Selected text context
      selectedText: null,
      setSelectedText: (text) => set({ selectedText: text }),

      sendAiMessage: async (bookId, message, selectedText) => {
        const existing = get().aiMessages[bookId] || [];
        const displayContent = selectedText
          ? `${message}\n\n> ${selectedText.length > 200 ? selectedText.slice(0, 200) + "..." : selectedText}`
          : message;
        const userMsg: AiMessage = {
          id: uuid(),
          role: "user",
          content: displayContent,
          timestamp: new Date().toISOString(),
        };
        set({
          aiMessages: {
            ...get().aiMessages,
            [bookId]: [...existing, userMsg],
          },
        });

        const book = get().getBookById(bookId);
        const mode = get().aiPaneMode;

        // Build conversation history for the API (role + content only)
        const history = [...existing, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const aiMsgId = uuid();

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: history,
              bookTitle: book?.title || "Unknown",
              bookAuthor: book?.author || "Unknown",
              mode,
              ...(selectedText ? { selectedText } : {}),
            }),
          });

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) throw new Error("No response body");

          const decoder = new TextDecoder();
          let accumulated = "";
          let created = false;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            accumulated += decoder.decode(value, { stream: true });

            if (!created) {
              // First chunk — create the assistant message
              set({
                aiMessages: {
                  ...get().aiMessages,
                  [bookId]: [
                    ...(get().aiMessages[bookId] || []),
                    {
                      id: aiMsgId,
                      role: "assistant" as const,
                      content: accumulated,
                      timestamp: new Date().toISOString(),
                    },
                  ],
                },
              });
              created = true;
            } else {
              // Update the streaming message
              set({
                aiMessages: {
                  ...get().aiMessages,
                  [bookId]: (get().aiMessages[bookId] || []).map((m) =>
                    m.id === aiMsgId ? { ...m, content: accumulated } : m
                  ),
                },
              });
            }
          }

          if (!created) {
            // Stream returned nothing
            set({
              aiMessages: {
                ...get().aiMessages,
                [bookId]: [
                  ...(get().aiMessages[bookId] || []),
                  {
                    id: aiMsgId,
                    role: "assistant" as const,
                    content:
                      "I didn't receive a response. Please try again.",
                    timestamp: new Date().toISOString(),
                  },
                ],
              },
            });
          }
        } catch {
          set({
            aiMessages: {
              ...get().aiMessages,
              [bookId]: [
                ...(get().aiMessages[bookId] || []),
                {
                  id: aiMsgId,
                  role: "assistant" as const,
                  content:
                    "Sorry, I couldn't process your request. Please try again.",
                  timestamp: new Date().toISOString(),
                },
              ],
            },
          });
        }
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

      // Reading sessions
      readingSessions: mockSessions,
      startReadingSession: (bookId) => {
        const id = `session-${Date.now()}`;
        const session: ReadingSession = {
          id,
          bookId,
          startedAt: new Date().toISOString(),
          endedAt: null,
          pagesRead: 0,
          durationMinutes: 0,
          ideasExtracted: [],
        };
        set({ readingSessions: [...get().readingSessions, session] });
        return id;
      },
      endReadingSession: (sessionId, ideasExtracted) => {
        set({
          readingSessions: get().readingSessions.map((s) => {
            if (s.id !== sessionId) return s;
            const startTime = new Date(s.startedAt).getTime();
            const endTime = Date.now();
            return {
              ...s,
              endedAt: new Date(endTime).toISOString(),
              durationMinutes: Math.round((endTime - startTime) / 60000),
              ideasExtracted,
            };
          }),
        });
      },
      getReadingProfile: () => {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const books = get().books;
        // Build book lookup map for O(1) genre lookups
        const bookGenreMap = new Map<number, string>();
        for (const b of books) bookGenreMap.set(b.id, b.genre);

        // Single pass: compute all aggregates at once
        let totalMinutes = 0;
        let weeklyMinutes = 0;
        const conceptCounts: Record<string, number> = {};
        const genreCounts: Record<string, number> = {};
        const bookIdsSeen = new Set<number>();

        const completedSessions = get().readingSessions.filter((s) => s.endedAt);

        for (const s of completedSessions) {
          totalMinutes += s.durationMinutes;
          if (new Date(s.startedAt).getTime() > weekAgo) {
            weeklyMinutes += s.durationMinutes;
          }
          for (const c of s.ideasExtracted) {
            conceptCounts[c] = (conceptCounts[c] || 0) + 1;
          }
          if (!bookIdsSeen.has(s.bookId)) {
            bookIdsSeen.add(s.bookId);
            const genre = bookGenreMap.get(s.bookId);
            if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          }
        }

        const topConcepts = Object.entries(conceptCounts)
          .toSorted(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([c]) => c);

        const topGenres = Object.entries(genreCounts)
          .toSorted(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([g]) => g);

        const recentIdeas = completedSessions
          .toSorted((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .slice(0, 3)
          .flatMap((s) => s.ideasExtracted)
          .slice(0, 6);

        return {
          totalReadingTimeMinutes: totalMinutes,
          weeklyReadingTimeMinutes: weeklyMinutes,
          topGenres,
          topConcepts,
          recentIdeas,
        };
      },

      // Shelf mode
      shelfMode: "chronological" as ShelfMode,
      setShelfMode: (mode) => set({ shelfMode: mode }),

      // AI pane mode
      aiPaneMode: "explain" as AiPaneMode,
      setAiPaneMode: (mode) => set({ aiPaneMode: mode }),

      // Info modals
      activeInfoModal: null,
      setActiveInfoModal: (modal) => set({ activeInfoModal: modal }),

      // Highlights
      highlights: [],
      addHighlight: (h) => set({ highlights: [...get().highlights, h] }),
      removeHighlight: (id) => set({ highlights: get().highlights.filter((h) => h.id !== id) }),
      getHighlightsForPage: (bookId, chapterIndex, pageInChapter) => {
        const address = get().walletAddress;
        if (!address) return [];
        return get().highlights.filter(
          (h) =>
            h.bookId === bookId &&
            h.ownerAddress === address &&
            h.chapterIndex === chapterIndex &&
            h.pageInChapter === pageInChapter
        );
      },

      // Sound preference
      soundEnabled: true,
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
    }),
    {
      name: "xandria-store",
      partialize: (state) => ({
        ownedBooks: state.ownedBooks,
        currentPage: state.currentPage,
        readingSessions: state.readingSessions,
        shelfMode: state.shelfMode,
        highlights: state.highlights,
        soundEnabled: state.soundEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

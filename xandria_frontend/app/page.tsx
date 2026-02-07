"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";
import { Client, Book } from "hello-world-contract";

export default function Home() {
  const [books, setBooks] = useState<{ id: number; data: Book }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const client = new Client({
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
        contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
      });

      const loadedBooks: { id: number; data: Book }[] = [];
      let id = 1;
      let hasMore = true;

      // Limit to avoid infinite loop if contract has gaps or issues, though usually sequential.
      // In production, we'd use a better indexer or event system.
      while (hasMore && id < 50) {
        try {
          const result = await client.get_book({ book_id: id });
          if (result.result) {
            loadedBooks.push({
              id,
              data: result.result
            });
            id++;
          } else {
            hasMore = false;
          }
        } catch (e) {
          // console.log("Stopped fetching at ID:", id); // Expected when we run out of books
          hasMore = false;
        }
      }
      setBooks(loadedBooks);
      setLoading(false);
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Xandria Marketplace
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/upload-book" className="text-gray-300 hover:text-white transition-colors">
            Publish
          </Link>
          <WalletConnect />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
          Browse Books
        </h1>

        {loading ? (
          <div className="text-center text-gray-400">Loading library...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <Link href={`/book/${book.id}`} key={book.id}>
                <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={book.data.cover_uri}
                      alt={book.data.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {book.data.is_special && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        SPECIAL EDITION
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold mb-2 truncate">{book.data.title}</h2>
                    <p className="text-gray-400 text-sm mb-4">{book.data.author}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-400">
                        {(Number(book.data.price) / 10000000).toFixed(2)} XLM
                      </span>
                      {book.data.is_special && (
                        <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
                          {book.data.remaining_supply} / {book.data.total_supply} Left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

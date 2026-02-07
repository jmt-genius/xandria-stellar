"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Client, Book } from "hello-world-contract";
import { requestAccess } from "@stellar/freighter-api";

export default function BookLibraryPage() {
    const [books, setBooks] = useState<{ id: number; data: Book }[]>([]);
    const [loading, setLoading] = useState(true);
    const [userAddress, setUserAddress] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { address } = await requestAccess();
                if (address) setUserAddress(address);
                else setUserAddress(null);
            } catch (e) {
                console.error("Error fetching user:", e);
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!userAddress) return;

            const client = new Client({
                networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
                contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!,
                rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
            });

            const loadedBooks: { id: number; data: Book }[] = [];
            let id = 1;
            let hasMore = true;

            // This is inefficient (scanning all), but robust for prototype without indexer
            while (hasMore && id < 50) {
                try {
                    // 1. Check if book exists
                    const result = await client.get_book({ book_id: id });
                    if (result.result) {
                        try {
                            // 2. Check if purchased
                            const purchased = await client.has_purchased({
                                buyer: userAddress,
                                book_id: id
                            });

                            if (purchased.result) {
                                loadedBooks.push({
                                    id,
                                    data: result.result
                                });
                            }
                        } catch (err) {
                            console.error(`Error checking purchase for ${id}`, err);
                        }
                        id++;
                    } else {
                        hasMore = false;
                    }
                } catch (e) {
                    hasMore = false;
                }
            }

            setBooks(loadedBooks);
            setLoading(false);
        };

        if (userAddress) {
            setLoading(true);
            fetchBooks();
        }
    }, [userAddress]);

    return (
        <main className="min-h-screen bg-gray-900 text-white font-sans container mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                My Library
            </h1>

            {!userAddress ? (
                <div className="text-center text-gray-400">
                    Please connect your wallet to view your library.
                </div>
            ) : loading ? (
                <div className="text-center text-gray-400">Checking your library shelves...</div>
            ) : books.length === 0 ? (
                <div className="text-center text-gray-400">
                    Your library is empty. <Link href="/" className="text-blue-400 hover:underline">Browse books to buy!</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book) => (
                        <Link href={`/book/${book.id}`} key={book.id}>
                            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500/50 hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={book.data.cover_uri}
                                        alt={book.data.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-green-600 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        OWNED
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold mb-2 truncate">{book.data.title}</h2>
                                    <p className="text-gray-400 text-sm mb-4">{book.data.author}</p>
                                    <button className="mt-auto w-full py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors font-bold">
                                        Read Now
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}

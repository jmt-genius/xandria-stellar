"use client";

import { useEffect, useState, use } from "react";
import WalletConnect from "@/components/WalletConnect";
import { Client } from "hello-world-contract";
import { requestAccess, signTransaction } from "@stellar/freighter-api";

type Book = {
    title: string;
    author: string;
    price: number;
    cover_uri: string;
    book_uri: string;
    is_special: boolean;
    total_supply: number;
    remaining_supply: number;
    author_address: string;
    metadata_uri: string;
};

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const bookId = parseInt(id);

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { address } = await requestAccess();
                if (address) setUserAddress(address);
            } catch (e) {
                // Not connected
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        const fetchBook = async () => {
            const client = new Client({
                networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
                contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!,
                rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
            });

            try {
                const result = await client.get_book({ book_id: bookId });
                if (result.result) {
                    const contractBook = result.result;

                    setBook({
                        title: contractBook.title,
                        author: contractBook.author,
                        price: Number(contractBook.price),
                        cover_uri: contractBook.cover_uri,
                        book_uri: contractBook.book_uri,
                        is_special: contractBook.is_special,
                        total_supply: contractBook.total_supply,
                        remaining_supply: contractBook.remaining_supply,
                        author_address: contractBook.author_address,
                        metadata_uri: "",
                    });

                    if (userAddress) {
                        if (contractBook.author_address === userAddress) {
                            setIsAuthor(true);
                            setIsOwner(true); // Author owns their book
                        } else {
                            try {
                                const purchased = await client.has_purchased({
                                    buyer: userAddress,
                                    book_id: bookId
                                });
                                if (purchased.result) setIsOwner(true);
                            } catch (e) {
                                console.error("Error checking purchase:", e);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Error fetching book:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId, userAddress]);

    const handleBuy = async () => {
        if (!userAddress) {
            alert("Please connect your wallet first.");
            return;
        }

        setBuying(true);
        try {
            const client = new Client({
                networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
                contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!,
                rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
                publicKey: userAddress,
            });

            // XLM Contract ID on Testnet
            const XLM_CONTRACT_ID = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

            const tx = await client.buy_book({
                buyer: userAddress,
                book_id: bookId,
                token_address: XLM_CONTRACT_ID,
            });

            const { result } = await tx.signAndSend({
                signTransaction: async (xdr) => {
                    const { signedTxXdr } = await signTransaction(xdr, {
                        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
                    });
                    return { signedTxXdr };
                },
            });

            console.log("Purchase Result:", result);
            alert("Book purchased successfully!");
            setIsOwner(true);
            // Refresh to update supply
            window.location.reload();

        } catch (error) {
            console.error("Purchase failed:", error);
            alert("Purchase failed. See console for details. Ensure you have testnet XLM.");
        } finally {
            setBuying(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">Loading...</div>;
    if (!book) return <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">Book not found.</div>;

    const isSoldOut = book.is_special && book.remaining_supply <= 0;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Navbar handled by layout */}

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700 flex flex-col md:flex-row shadow-2xl">
                    <div className="md:w-1/3">
                        <img
                            src={book.cover_uri}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-8 md:w-2/3 flex flex-col">
                        <div className="mb-auto">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-4xl font-extrabold">{book.title}</h1>
                                {book.is_special && (
                                    <span className="bg-purple-600 text-xs font-bold px-3 py-1 rounded-full">
                                        SPECIAL EDITION
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl text-gray-400 mb-6">{book.author}</h2>

                            {book.is_special && (
                                <div className="bg-gray-700/50 rounded-lg p-4 mb-6 max-w-sm">
                                    <p className="text-sm text-gray-300 mb-1">Limited Supply</p>
                                    <p className={`text-2xl font-bold ${isSoldOut ? 'text-red-500' : 'text-white'}`}>
                                        {book.remaining_supply} <span className="text-base font-normal text-gray-500">/ {book.total_supply} remaining</span>
                                    </p>
                                </div>
                            )}

                            <div className="text-3xl font-bold text-blue-400 mb-8">
                                {(Number(book.price) / 10000000).toFixed(2)} XLM
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {isOwner ? (
                                <a
                                    href={book.book_uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-4 rounded-lg font-bold text-lg text-center bg-green-600 hover:bg-green-500 transition-all text-white shadow-lg shadow-green-900/20"
                                >
                                    Read Book
                                </a>
                            ) : isAuthor ? (
                                <div className="flex-1 py-4 rounded-lg font-bold text-lg text-center bg-gray-700 text-gray-300 cursor-default">
                                    You are the Author
                                </div>
                            ) : (
                                <button
                                    onClick={handleBuy}
                                    disabled={buying || isSoldOut}
                                    className={`flex-1 py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform ${buying || isSoldOut
                                        ? "bg-gray-600 cursor-not-allowed opacity-50"
                                        : "bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] shadow-blue-900/20"
                                        }`}
                                >
                                    {buying ? "Processing..." : isSoldOut ? "Sold Out" : "Buy Book"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

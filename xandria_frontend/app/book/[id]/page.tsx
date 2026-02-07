"use client";

import { useEffect, useState, use } from "react";
import WalletConnect from "@/components/WalletConnect";
import { isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";
import { Client } from "hello-world-contract";

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

// Testnet Native Token Contract ID (XLM)
const XLM_CONTRACT_ID = "CDLZFC3SYJYDZT7KQLSPRJ75H23KKMUPDRHPMGPTPIT4UEV2524EVUIU";

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params);
    const bookId = parseInt(id);

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            const client = new Client({
                networkPassphrase: "Test SDF Network ; September 2015",
                contractId: "CB2PQKPGTZFWS7K76KVFXO6556DYJQDOUZ4AHCAZRH6MURBCZJAC2WJE",
                rpcUrl: "https://soroban-testnet.stellar.org",
            });

            try {
                const result = await client.get_book({ book_id: bookId });
                if (result.result) {
                    const contractBook = result.result;
                    // Fetch metadata
                    let metadata: any = {};
                    try {
                        const res = await fetch(contractBook.metadata_uri);
                        metadata = await res.json();
                    } catch (err) {
                        console.error("Failed to fetch metadata:", err);
                    }

                    setBook({
                        title: contractBook.title, // Contract title takes precedence or metadata? Usually metadata has richer info.
                        author: contractBook.author,
                        price: contractBook.price,
                        cover_uri: metadata.cover_uri || "",
                        book_uri: metadata.book_uri || "",
                        is_special: metadata.is_special || false,
                        total_supply: metadata.supply || 0,
                        remaining_supply: 0, // Not available in contract currently
                        author_address: contractBook.author, // Assuming author field in contract IS the address. 'mint_book' args says 'author' is string. Code passed address.
                        metadata_uri: contractBook.metadata_uri,
                    });
                }
            } catch (e) {
                console.error("Error fetching book:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    const handleBuy = async () => {
        alert("Buying is currently disabled as the contract is being updated.");
        return;
        /*
        setBuying(true);
        try {
            const { isConnected: connected } = await isConnected();
            if (!connected) {
                alert("Please connect your wallet first.");
                return;
            }

            const { address } = await requestAccess();
            if (!address) {
                alert("Access denied.");
                return;
            }

            const client = new Client({
                networkPassphrase: "Test SDF Network ; September 2015",
                contractId: "CB2PQKPGTZFWS7K76KVFXO6556DYJQDOUZ4AHCAZRH6MURBCZJAC2WJE",
                rpcUrl: "https://soroban-testnet.stellar.org",
                publicKey: address,
            });

            // Note: In a real app, you might need to approve the transfer first 
            // depending on the token standard (Stellar Asset Contract doesn't use approve/transferFrom like ERC20, 
            // but standard transfer requires signer to be the sender). 
            // Our contract calls `token.transfer(buyer, author, price)`. 
            // The `buyer` (address) must be the one signing this transaction. 
            // Since `client.buy_book` is invoked by `address`, the auth should propagate.

            const tx = await client.buy_book({ // Wait, check if buy_book exists!
                buyer: address,
                book_id: bookId,
                token_address: XLM_CONTRACT_ID,
            });

            const { result } = await tx.signAndSend({
                signTransaction: async (xdr: string) => {
                    const { signedTxXdr } = await signTransaction(xdr, {
                        networkPassphrase: "Test SDF Network ; September 2015",
                    });
                    return { signedTxXdr };
                },
            });

            alert("Book purchased successfully!");
            window.location.reload(); // Refresh to update supply

        } catch (error) {
            console.error("Purchase failed:", error);
            alert("Percentage failed. Ensure you have enough XLM (and test tokens if on testnet). Details in console.");
        } finally {
            setBuying(false);
        }
        */
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white p-10">Loading...</div>;
    if (!book) return <div className="min-h-screen bg-gray-900 text-white p-10">Book not found.</div>;

    const isSoldOut = book.is_special && book.remaining_supply <= 0; // remaining_supply is 0 by default now, so might always show sold out if special. Logic warning.

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <nav className="flex items-center justify-between px-8 py-4 bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Xandria
                </div>
                <WalletConnect />
            </nav>

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
                            <button
                                onClick={handleBuy}
                                disabled={true}
                                className={`flex-1 py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform ${"bg-gray-600 cursor-not-allowed opacity-50"
                                    }`}
                            >
                                {"Coming Soon"}
                            </button>

                            {/* Read button (always available if you assumedly own it, but here just a link to the file) */}
                            <a
                                href={book.book_uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-4 rounded-lg font-bold text-lg text-center border border-gray-600 hover:bg-gray-800 transition-all text-gray-300"
                            >
                                Preview / Read
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

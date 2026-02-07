"use client";

import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import { isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";
import { Client } from "hello-world-contract";
import { uploadFileToPinata } from "@/utils/pinata";

export default function UploadBookPage() {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: "",
        supply: "100", // Default supply
    });
    const [isSpecial, setIsSpecial] = useState(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [bookFile, setBookFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const { name } = e.target;
            if (name === "coverImage") {
                setCoverImage(e.target.files[0]);
            } else if (name === "bookFile") {
                setBookFile(e.target.files[0]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const { isConnected: connected } = await isConnected();
            if (!connected) {
                alert("Please connect your Freighter wallet first.");
                setIsUploading(false);
                return;
            }

            const { address } = await requestAccess();
            if (!address) {
                alert("Wallet access denied.");
                setIsUploading(false);
                return;
            }

            if (!coverImage || !bookFile) {
                alert("Please upload both cover image and book file.");
                setIsUploading(false);
                return;
            }

            console.log("Uploading assets to Pinata...");
            const coverUrl = await uploadFileToPinata(coverImage);
            const bookUrl = await uploadFileToPinata(bookFile);

            console.log("Cover URL:", coverUrl);
            console.log("Book URL:", bookUrl);

            // Convert price to stroops (assuming 7 decimals from XLM)
            // Convert price to stroops (assuming 7 decimals from XLM)
            const client = new Client({
                networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
                contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!,
                rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
                publicKey: address,
            });

            console.log("Publishing book...");

            // Convert price to stroops (assuming 7 decimals from XLM)
            const priceInStroops = BigInt(Math.floor(parseFloat(formData.price) * 10000000));
            const supply = parseInt(formData.supply);

            const tx = await client.publish_book({
                author: address,
                title: formData.title,
                author_name: formData.author,
                price: priceInStroops,
                cover_uri: coverUrl,
                book_uri: bookUrl,
                is_special: isSpecial,
                supply: isSpecial ? supply : 0,
            });

            const { result } = await tx.signAndSend({
                signTransaction: async (xdr: string) => {
                    const { signedTxXdr } = await signTransaction(xdr, {
                        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
                    });
                    return { signedTxXdr };
                },
            });

            console.log("Transaction Result:", result);
            alert(`Book published successfully! ID: ${result}`);

        } catch (error) {
            console.error("Error publishing book:", error);
            alert("Failed to publish book. See console for details.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <nav className="flex items-center justify-between px-8 py-4 bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Xandria
                </div>
                <WalletConnect />
            </nav>

            <main className="container mx-auto px-4 py-12 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Publish Your Masterpiece
                </h1>

                <div className="w-full max-w-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Book Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Author Name</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Edition Type */}
                        <div>
                            <span className="block text-sm font-medium text-gray-300 mb-2">Edition Type</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!isSpecial}
                                        onChange={() => setIsSpecial(false)}
                                        className="form-radio text-blue-500"
                                    />
                                    <span>Normal Edition</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={isSpecial}
                                        onChange={() => setIsSpecial(true)}
                                        className="form-radio text-purple-500"
                                    />
                                    <span>Special Edition</span>
                                </label>
                            </div>
                        </div>

                        {/* Supply (Special Only) */}
                        {isSpecial && (
                            <div className="animate-fade-in-down">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Total Supply</label>
                                <input
                                    type="number"
                                    name="supply"
                                    value={formData.supply}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        )}

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Price (XLM)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.1"
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image</label>
                                <input
                                    type="file"
                                    name="coverImage"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Book File (PDF/EPUB)</label>
                                <input
                                    type="file"
                                    name="bookFile"
                                    accept=".pdf,.epub"
                                    onChange={handleFileChange}
                                    required
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all ${isUploading
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]"
                                }`}
                        >
                            {isUploading ? "Publishing..." : "Mint & Publish"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

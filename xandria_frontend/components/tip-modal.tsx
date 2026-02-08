"use client";

import { useState } from "react";
import { isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";
import { getContractClient, xlmToStroops } from "@/lib/stellar";
import { NETWORK_PASSPHRASE, NATIVE_TOKEN_ADDRESS } from "@/lib/constants";

interface TipModalProps {
    bookId: number;
    authorAddress: string;
    onClose: () => void;
}

export default function TipModal({ bookId, authorAddress, onClose }: TipModalProps) {
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const { isConnected: connected } = await isConnected();
            if (!connected) {
                alert("Please connect your Freighter wallet first.");
                setIsProcessing(false);
                return;
            }

            const { address } = await requestAccess();
            if (!address) {
                alert("Wallet access denied.");
                setIsProcessing(false);
                return;
            }

            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                alert("Please enter a valid tip amount.");
                setIsProcessing(false);
                return;
            }

            const client = getContractClient(address);
            const amountInStroops = xlmToStroops(parsedAmount);

            const tx = await client.tip_author({
                sender: address,
                book_id: bookId,
                amount: amountInStroops,
                message: message || "Thank you!",
                token_address: NATIVE_TOKEN_ADDRESS,
            });

            await tx.signAndSend({
                signTransaction: async (xdr: string) => {
                    const { signedTxXdr } = await signTransaction(xdr, {
                        networkPassphrase: NETWORK_PASSPHRASE,
                    });
                    return { signedTxXdr };
                },
            });

            alert(`Successfully tipped ${parsedAmount} XLM to the author!`);
            onClose();
        } catch (error) {
            console.error("Error sending tip:", error);
            alert("Failed to send tip. See console for details.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-surface border border-border rounded-xl p-8 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="font-display text-2xl text-text-primary mb-6">
                    Tip the Author
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-body text-text-secondary mb-1.5">
                            Amount (XLM)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="10"
                            className="w-full bg-background border border-border rounded-md px-4 py-3 text-text-primary font-body text-sm focus:outline-none focus:border-accent/50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-body text-text-secondary mb-1.5">
                            Message (optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            placeholder="Thanks for the amazing book!"
                            className="w-full bg-background border border-border rounded-md px-4 py-3 text-text-primary font-body text-sm focus:outline-none focus:border-accent/50"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-surface hover:bg-surface-hover text-text-secondary font-body text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`flex-1 py-3 font-body text-sm transition-opacity ${isProcessing
                                    ? "bg-surface-hover text-text-muted cursor-not-allowed"
                                    : "bg-accent text-background hover:opacity-90"
                                }`}
                        >
                            {isProcessing ? "Sending..." : "Send Tip"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

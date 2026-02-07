"use client";

import { useState, useEffect } from "react";
import {
    isConnected,
    requestAccess,
    setAllowed,
} from "@stellar/freighter-api";

export default function WalletConnect() {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function checkConnection() {
            try {
                const { isConnected: connected } = await isConnected();
                if (connected) {
                    const { address } = await requestAccess(); // Depending on version, this might just return the key if already authorized
                    if (address) {
                        setPublicKey(address);
                    }
                }
            } catch (err) {
                console.error("Error checking connection:", err);
            }
        }
        checkConnection();
    }, []);

    const handleConnect = async () => {
        setError(null);
        try {
            const { isConnected: connected } = await isConnected();
            if (!connected) {
                setError("Freighter wallet not installed or not detected.");
                return;
            }

            const response = await requestAccess();
            if (response.error) {
                setError(response.error);
                return;
            }

            if (response.address) {
                setPublicKey(response.address);
            } else {
                setError("User denied access.");
            }
        } catch (err) {
            console.error("Error connecting wallet:", err);
            setError("Failed to connect wallet.");
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            {publicKey ? (
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 font-mono text-sm">
                    Connected: {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                </div>
            ) : (
                <button
                    onClick={handleConnect}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                    Connect Freighter
                </button>
            )}
            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    );
}

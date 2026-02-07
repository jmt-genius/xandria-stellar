"use client";

import { useState, useEffect, useRef } from "react";
import { isConnected, requestAccess } from "@stellar/freighter-api";
import { useStore } from "@/stores/useStore";
import { truncateAddress } from "@/lib/stellar";

export default function WalletIndicator() {
  const setWalletAddress = useStore((s) => s.setWalletAddress);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const checkedRef = useRef(false);

  // Check existing connection on mount (once)
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    (async () => {
      try {
        const { isConnected: connected } = await isConnected();
        if (connected) {
          const { address } = await requestAccess();
          if (address) {
            setPublicKey(address);
            setWalletAddress(address);
          }
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    })();
  }, [setWalletAddress]);

  const handleConnect = async () => {
    setError(null);
    setConnecting(true);
    try {
      const { isConnected: connected } = await isConnected();
      if (!connected) {
        setError("Freighter wallet not detected");
        setConnecting(false);
        return;
      }
      const response = await requestAccess();
      if (response.error) {
        setError(response.error);
        setConnecting(false);
        return;
      }
      if (response.address) {
        setPublicKey(response.address);
        setWalletAddress(response.address);
      } else {
        setError("User denied access.");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    setWalletAddress(null);
    setShowDropdown(false);
  };

  if (!publicKey) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="font-body text-sm text-accent hover:text-text-primary transition-colors disabled:opacity-50"
        >
          {connecting ? "Connecting..." : "Connect"}
        </button>
        {error && (
          <p className="text-error text-xs max-w-[200px] text-right">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        {truncateAddress(publicKey)}
      </button>
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-surface border border-border rounded-lg p-3 min-w-[200px] shadow-[var(--shadow-card)]">
            <p className="font-mono text-xs text-text-muted mb-2 break-all">
              {publicKey}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicKey);
                setShowDropdown(false);
              }}
              className="w-full text-left text-sm text-text-secondary hover:text-text-primary py-1.5 transition-colors"
            >
              Copy address
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full text-left text-sm text-error hover:text-text-primary py-1.5 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { isConnected, getAddress, requestAccess } from "@stellar/freighter-api";
import { useStore } from "@/stores/useStore";
import { truncateAddress } from "@/lib/stellar";

const DISCONNECTED_KEY = "xandria-wallet-disconnected";

export default function WalletIndicator() {
  const setWalletAddress = useStore((s) => s.setWalletAddress);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-reconnect on mount only if the user hasn't explicitly disconnected
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Skip auto-connect if user explicitly disconnected
        if (sessionStorage.getItem(DISCONNECTED_KEY)) return;

        const { isConnected: connected } = await isConnected();
        if (!connected || cancelled) return;
        const { address, error: addrError } = await getAddress();
        if (cancelled) return;
        if (address && !addrError) {
          setPublicKey(address);
          setWalletAddress(address);
        }
      } catch {
        // Freighter not available or not authorized — silent on mount
      }
    })();
    return () => { cancelled = true; };
  }, [setWalletAddress]);

  const handleConnect = async () => {
    setError(null);
    setConnecting(true);
    try {
      // Clear the disconnected flag so auto-connect works on future loads
      sessionStorage.removeItem(DISCONNECTED_KEY);

      // requestAccess triggers the Freighter popup for user approval
      const response = await requestAccess();
      if (response.error) {
        setError(typeof response.error === "string" ? response.error : "Connection rejected.");
        setConnecting(false);
        return;
      }
      if (response.address) {
        setPublicKey(response.address);
        setWalletAddress(response.address);
      } else {
        setError("No address returned. Is Freighter installed?");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Freighter wallet not detected. Please install the extension.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    setWalletAddress(null);
    setShowDropdown(false);
    // Mark as explicitly disconnected so auto-connect is skipped until user reconnects
    sessionStorage.setItem(DISCONNECTED_KEY, "1");
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

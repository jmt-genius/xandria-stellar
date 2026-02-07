"use client";

import { useEffect, useState, useCallback } from "react";

export default function DrmWrapper({
  walletAddress,
  children,
}: {
  walletAddress: string;
  children: React.ReactNode;
}) {
  const [showMessage, setShowMessage] = useState(false);

  const showProtectionMessage = useCallback(() => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || e.key === "p" || e.key === "s" || e.key === "a")
      ) {
        e.preventDefault();
        showProtectionMessage();
      }
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      showProtectionMessage();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [showProtectionMessage]);

  const truncated = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <div
      className="relative select-none"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
      onCopy={(e) => {
        e.preventDefault();
        showProtectionMessage();
      }}
    >
      {/* Watermark */}
      <div
        className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
        style={{ opacity: 0.03 }}
        aria-hidden
      >
        <div
          className="absolute inset-[-50%] flex flex-wrap gap-32 rotate-[-30deg]"
          style={{ fontSize: "14px", color: "var(--text-primary)" }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="whitespace-nowrap">
              {truncated}
            </span>
          ))}
        </div>
      </div>

      {children}

      {/* Protection message */}
      {showMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
          <p className="text-text-muted text-xs">This content is protected</p>
        </div>
      )}

      {/* Print protection */}
      <style jsx global>{`
        @media print {
          body * {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

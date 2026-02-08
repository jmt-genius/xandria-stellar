"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export default function DrmWrapper({
  walletAddress,
  children,
  onProtectionAttempt,
}: {
  walletAddress: string;
  children: React.ReactNode;
  onProtectionAttempt?: () => void;
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [contentBlurred, setContentBlurred] = useState(false);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether meta+shift is being held (macOS screenshot combo)
  const metaShiftHeldRef = useRef(false);

  const showProtectionMessage = useCallback(() => {
    setShowMessage(true);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => setShowMessage(false), 2000);
    onProtectionAttempt?.();
  }, [onProtectionAttempt]);

  const blurContent = useCallback((durationMs = 1000) => {
    setContentBlurred(true);
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    blurTimerRef.current = setTimeout(() => setContentBlurred(false), durationMs);
  }, []);

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    };
  }, []);

  // === KEYBOARD PROTECTION ===
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Block copy, print, save, select-all
      if (
        (e.ctrlKey || e.metaKey) &&
        (key === "c" || key === "p" || key === "s" || key === "a")
      ) {
        e.preventDefault();
        showProtectionMessage();
        return;
      }

      // Block DevTools: F12, Ctrl+Shift+I/J/C, Ctrl+U
      if (e.key === "F12") {
        e.preventDefault();
        showProtectionMessage();
        return;
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (key === "i" || key === "j" || key === "c")
      ) {
        e.preventDefault();
        showProtectionMessage();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && key === "u") {
        e.preventDefault();
        showProtectionMessage();
        return;
      }

      // === SCREENSHOT KEY DETECTION ===

      // PrintScreen (Windows/Linux — browser receives this event)
      if (e.key === "PrintScreen") {
        e.preventDefault();
        blurContent(1500);
        showProtectionMessage();
        return;
      }

      // Windows: Win+Shift+S (Snipping Tool)
      if (e.metaKey && e.shiftKey && key === "s") {
        e.preventDefault();
        blurContent(1500);
        showProtectionMessage();
        return;
      }

      // === macOS SCREENSHOT DETECTION ===
      // On macOS, Cmd+Shift+3/4/5 are intercepted by the OS before the browser
      // gets the "3"/"4"/"5" keydown event. The browser DOES receive the keydown
      // for Meta and Shift individually. So we detect when both Meta and Shift
      // are held simultaneously and preemptively blur the content.
      // This catches all three macOS screenshot combos.
      if (e.metaKey && e.shiftKey && !metaShiftHeldRef.current) {
        metaShiftHeldRef.current = true;
        blurContent(2000);
        showProtectionMessage();
        return;
      }

      // Also catch any Cmd+Shift+3/4/5 that DO arrive (some browser versions)
      if (
        e.metaKey &&
        e.shiftKey &&
        (e.key === "3" || e.key === "4" || e.key === "5")
      ) {
        e.preventDefault();
        blurContent(1500);
        showProtectionMessage();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Reset meta+shift tracking when either key is released
      if (e.key === "Meta" || e.key === "Shift") {
        metaShiftHeldRef.current = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [showProtectionMessage, blurContent]);

  // === CONTEXT MENU BLOCK ===
  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      showProtectionMessage();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [showProtectionMessage]);

  // === VISIBILITY CHANGE DETECTION ===
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setContentBlurred(true);
      } else {
        setTimeout(() => setContentBlurred(false), 300);
      }
    };

    const handleWindowBlur = () => {
      setContentBlurred(true);
    };

    const handleWindowFocus = () => {
      setTimeout(() => setContentBlurred(false), 300);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  // === DRAG PREVENTION ===
  useEffect(() => {
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => e.preventDefault();

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  // === DEVTOOLS DETECTION (size-based heuristic) ===
  useEffect(() => {
    let devtoolsOpen = false;

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      const isOpen = widthThreshold || heightThreshold;

      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        setContentBlurred(true);
        showProtectionMessage();
      } else if (!isOpen && devtoolsOpen) {
        devtoolsOpen = false;
        setContentBlurred(false);
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, [showProtectionMessage]);

  const truncated = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <div
      className="relative"
      style={{
        WebkitTouchCallout: "none",
      }}
      onCopy={(e) => {
        e.preventDefault();
        showProtectionMessage();
      }}
      onCut={(e) => {
        e.preventDefault();
        showProtectionMessage();
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Content blur overlay */}
      {contentBlurred && (
        <div
          className="fixed inset-0 z-[90] pointer-events-none"
          style={{
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            backgroundColor: "rgba(10, 10, 8, 0.85)",
          }}
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted text-sm font-display">
              Content hidden for protection
            </p>
          </div>
        </div>
      )}

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

      {/* Print protection + CSS hardening */}
      <style jsx global>{`
        @media print {
          body * {
            display: none !important;
          }
          body::after {
            content: "This content is protected and cannot be printed.";
            display: block !important;
            font-size: 24px;
            text-align: center;
            padding: 100px 20px;
            color: #5A564E;
          }
        }

        img {
          -webkit-user-drag: none;
          user-drag: none;
          pointer-events: none;
        }

        ::selection {
          background: rgba(217, 169, 99, 0.3);
          color: inherit;
        }
        ::-moz-selection {
          background: rgba(217, 169, 99, 0.3);
          color: inherit;
        }
      `}</style>
    </div>
  );
}

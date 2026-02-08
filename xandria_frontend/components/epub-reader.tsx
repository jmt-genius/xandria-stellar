"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Book, Rendition } from "epubjs";

interface EpubReaderProps {
    bookUri: string;
    onPageChange?: (current: number, total: number) => void;
    onReady?: () => void;
    onError?: (error: Error) => void;
}

export default function EpubReader({
    bookUri,
    onPageChange,
    onReady,
    onError,
}: EpubReaderProps) {
    console.log("[EPUB Debug] EpubReader component mounting");
    const viewerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<Book | null>(null);
    const renditionRef = useRef<Rendition | null>(null);
    const locationsRef = useRef<string[]>([]);

    const [currentLocation, setCurrentLocation] = useState(0);
    const [totalLocations, setTotalLocations] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const [isBlackout, setIsBlackout] = useState(false);

    // Anti-screenshot protection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "PrintScreen") {
                setIsBlackout(true);
                // Reset after a delay to ensure the screenshot captures black
                setTimeout(() => setIsBlackout(false), 2000);
            }
        };

        const handleBlur = () => {
            setIsBlackout(true);
        };

        const handleFocus = () => {
            setIsBlackout(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyDown); // Catch both to be safe
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);

        // Also prevent context menu
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        window.addEventListener("contextmenu", handleContextMenu);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyDown);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    // Initialize EPUB
    useEffect(() => {
        if (!viewerRef.current || !bookUri) return;

        let mounted = true;
        const container = viewerRef.current;

        const initBook = async () => {
            try {
                setLoading(true);
                setError(null);

                // Clean up previous instance
                if (renditionRef.current) {
                    renditionRef.current.destroy();
                }
                if (bookRef.current) {
                    bookRef.current.destroy();
                }

                console.log(`[EPUB Debug] Fetching book from: ${bookUri}`);

                // Fetch the file as an ArrayBuffer to bypass potential MIME type issues/downloads
                const response = await fetch(bookUri);
                console.log(`[EPUB Debug] Fetch response status: ${response.status} ${response.statusText}`);
                console.log(`[EPUB Debug] Content-Type: ${response.headers.get("content-type")}`);
                console.log(`[EPUB Debug] Content-Length: ${response.headers.get("content-length")}`);

                if (!response.ok) throw new Error(`Failed to fetch book: ${response.statusText}`);

                const arrayBuffer = await response.arrayBuffer();
                console.log(`[EPUB Debug] ArrayBuffer received. Size: ${arrayBuffer.byteLength} bytes`);

                // Dynamically import libraries
                const [JSZip, customEpub] = await Promise.all([
                    import("jszip").then(m => m.default),
                    import("epubjs").then(m => m.default)
                ]);

                // Verify ZIP structure
                try {
                    const zip = await JSZip.loadAsync(arrayBuffer);
                    const files = Object.keys(zip.files);
                    console.log("[EPUB Debug] Valid ZIP structure detected. File count:", files.length);
                    console.log("[EPUB Debug] First 5 files:", files.slice(0, 5));

                    if (zip.file("mimetype")) {
                        const mimetype = await zip.file("mimetype")?.async("string");
                        console.log("[EPUB Debug] 'mimetype' file content:", mimetype);
                    } else {
                        console.warn("[EPUB Debug] No 'mimetype' file found in ZIP (non-standard EPUB?)");
                    }
                } catch (e) {
                    console.warn("[EPUB Debug] File check failed - might not be a valid ZIP:", e);
                }

                if (!mounted) return;

                // Pass the ArrayBuffer directly to ePub.js
                // Note: customEpub is the default export
                const book = customEpub(arrayBuffer);
                bookRef.current = book;

                await book.ready;

                if (!mounted) return;

                const rendition = book.renderTo(container, {
                    width: "100%",
                    height: "100%",
                    spread: "none",
                    flow: "paginated",
                });

                renditionRef.current = rendition;

                // Apply reader styles
                rendition.themes.default({
                    body: {
                        fontFamily: "Georgia, serif !important",
                        fontSize: "19px !important",
                        lineHeight: "1.8 !important",
                        color: "#E8E0D4 !important",
                        background: "transparent !important",
                        padding: "0 20px !important",
                    },
                    p: {
                        marginBottom: "1em !important",
                    },
                    "*": {
                        color: "#E8E0D4 !important",
                    },
                });

                // Display first page
                await rendition.display();

                // Generate locations with smaller chunk size for more accurate page count
                const locations = await book.locations.generate(600);
                locationsRef.current = locations;

                if (mounted) {
                    const total = locations.length || 1;
                    setTotalLocations(total);
                    setCurrentLocation(1);
                    setLoading(false);
                    setAtStart(true);
                    setAtEnd(total <= 1);
                    onReady?.();
                    onPageChange?.(1, total);
                }

                // Listen for location changes
                rendition.on("relocated", (location: any) => {
                    if (!mounted) return;

                    // Update start/end flags
                    setAtStart(location.atStart ?? false);
                    setAtEnd(location.atEnd ?? false);

                    // Calculate current page from location
                    const total = locationsRef.current.length || 1;
                    if (location.start?.cfi) {
                        const currentLocationIndex = book.locations.locationFromCfi(location.start.cfi) as unknown as number;
                        const pageNum = Math.max(1, Math.min(currentLocationIndex + 1, total));
                        setCurrentLocation(pageNum);
                        onPageChange?.(pageNum, total);
                    }
                });
            } catch (err) {
                console.error("EPUB loading error:", err);
                if (mounted) {
                    const errorMsg = err instanceof Error ? err.message : "Failed to load EPUB";
                    setError(errorMsg);
                    setLoading(false);
                    onError?.(err instanceof Error ? err : new Error(errorMsg));
                }
            }
        };

        initBook();

        return () => {
            mounted = false;
            if (renditionRef.current) {
                renditionRef.current.destroy();
            }
            if (bookRef.current) {
                bookRef.current.destroy();
            }
        };
    }, [bookUri, onPageChange, onReady, onError]);

    const goNext = useCallback(() => {
        if (renditionRef.current && !atEnd) {
            renditionRef.current.next();
        }
    }, [atEnd]);

    const goPrev = useCallback(() => {
        if (renditionRef.current && !atStart) {
            renditionRef.current.prev();
        }
    }, [atStart]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault();
                goNext();
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goNext, goPrev]);

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary mb-2">Failed to load book</p>
                    <p className="text-text-muted text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex relative overflow-hidden">
            {/* Left click zone */}
            <div
                className="absolute left-0 top-0 bottom-0 w-[15%] z-10 cursor-pointer group"
                onClick={goPrev}
            >
                {!atStart && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted/15 text-2xl group-hover:text-text-muted/30 transition-colors">
                        &#8249;
                    </span>
                )}
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A08] z-20">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* EPUB Container - always rendered so ref is available */}
            <div
                ref={viewerRef}
                className="flex-1 mx-[15%] overflow-hidden"
                style={{ minHeight: "500px" }}
            />

            {/* Right click zone */}
            <div
                className="absolute right-0 top-0 bottom-0 w-[15%] z-10 cursor-pointer group"
                onClick={goNext}
            >
                {!atEnd && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted/15 text-2xl group-hover:text-text-muted/30 transition-colors">
                        &#8250;
                    </span>
                )}
            </div>
            {/* Blackout Overlay */}
            {isBlackout && (
                <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
                    <p className="text-white/50 text-sm">Protected Content</p>
                </div>
            )}
        </div>
    );
}

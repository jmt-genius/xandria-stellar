"use client";

import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfReaderProps {
    bookUri: string;
    onPageChange?: (current: number, total: number) => void;
    onReady?: () => void;
    onError?: (error: Error) => void;
}

export default function PdfReader({
    bookUri,
    onPageChange,
    onReady,
    onError,
}: PdfReaderProps) {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [direction, setDirection] = useState(1);

    const onDocumentLoadSuccess = useCallback(
        ({ numPages }: { numPages: number }) => {
            setNumPages(numPages);
            setPageNumber(1);
            setLoading(false);
            onReady?.();
            onPageChange?.(1, numPages);
        },
        [onReady, onPageChange]
    );

    const onDocumentLoadError = useCallback(
        (err: Error) => {
            console.error("PDF loading error:", err);
            setError(err.message);
            setLoading(false);
            onError?.(err);
        },
        [onError]
    );

    const goNext = useCallback(() => {
        if (pageNumber < numPages) {
            setDirection(1);
            const newPage = pageNumber + 1;
            setPageNumber(newPage);
            onPageChange?.(newPage, numPages);
        }
    }, [pageNumber, numPages, onPageChange]);

    const goPrev = useCallback(() => {
        if (pageNumber > 1) {
            setDirection(-1);
            const newPage = pageNumber - 1;
            setPageNumber(newPage);
            onPageChange?.(newPage, numPages);
        }
    }, [pageNumber, numPages, onPageChange]);

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

    const [pdfData, setPdfData] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        const fetchPdf = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log(`[PDF Debug] Fetching PDF from: ${bookUri}`);

                const response = await fetch(bookUri);
                console.log(`[PDF Debug] Fetch response status: ${response.status} ${response.statusText}`);
                console.log(`[PDF Debug] Content-Type: ${response.headers.get("content-type")}`);
                console.log(`[PDF Debug] Content-Length: ${response.headers.get("content-length")}`);

                if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);

                const blob = await response.blob();
                console.log(`[PDF Debug] Blob created. Size: ${blob.size} bytes, Type: ${blob.type}`);

                if (!active) return;

                const url = URL.createObjectURL(blob);
                console.log(`[PDF Debug] Object URL created: ${url}`);
                setPdfData(url);
            } catch (err) {
                console.error("PDF fetch error:", err);
                if (active) {
                    setError(err instanceof Error ? err.message : "Failed to load PDF");
                    setLoading(false);
                    onError?.(err instanceof Error ? err : new Error("Failed to load PDF"));
                }
            }
        };

        fetchPdf();

        return () => {
            active = false;
            if (pdfData) {
                console.log(`[PDF Debug] Revoking Object URL: ${pdfData}`);
                URL.revokeObjectURL(pdfData);
            }
        };
    }, [bookUri]);

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary mb-2">Failed to load PDF</p>
                    <p className="text-text-muted text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!pdfData && loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
                {pageNumber > 1 && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted/15 text-2xl group-hover:text-text-muted/30 transition-colors">
                        &#8249;
                    </span>
                )}
            </div>

            {/* PDF Container */}
            <div className="flex-1 flex items-center justify-center mx-[15%] overflow-auto">
                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {pdfData && (
                    <Document
                        file={pdfData}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading=""
                        className="flex items-center justify-center"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={pageNumber}
                                initial={{ opacity: 0, x: direction * 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: direction * -30 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                    className="shadow-lg"
                                    width={600}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </Document>
                )}
            </div>

            {/* Right click zone */}
            <div
                className="absolute right-0 top-0 bottom-0 w-[15%] z-10 cursor-pointer group"
                onClick={goNext}
            >
                {pageNumber < numPages && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted/15 text-2xl group-hover:text-text-muted/30 transition-colors">
                        &#8250;
                    </span>
                )}
            </div>
        </div>
    );
}

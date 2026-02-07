"use client";

import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path ? "text-blue-400" : "text-gray-300 hover:text-white";

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Xandria Marketplace
            </Link>
            <div className="flex gap-6 items-center">
                <Link href="/" className={`${isActive("/")} transition-colors`}>
                    Browse Books
                </Link>
                <Link href="/published-books" className={`${isActive("/published-books")} transition-colors`}>
                    Published Books
                </Link>
                <Link href="/book-library" className={`${isActive("/book-library")} transition-colors`}>
                    My Library
                </Link>
                <Link href="/upload-book" className={`${isActive("/upload-book")} transition-colors`}>
                    Publish
                </Link>
                <WalletConnect />
            </div>
        </nav>
    );
}

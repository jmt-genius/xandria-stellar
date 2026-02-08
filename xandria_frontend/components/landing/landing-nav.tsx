"use client";

import Link from "next/link";

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 backdrop-blur-md bg-[#0A0A08]/80 border-b border-border/50">
      <span className="font-display text-2xl text-text-primary tracking-wide">
        Xandria
      </span>
      <Link
        href="/marketplace"
        className="font-body text-sm text-accent hover:text-accent/80 transition-colors"
      >
        Enter Library &rarr;
      </Link>
    </nav>
  );
}

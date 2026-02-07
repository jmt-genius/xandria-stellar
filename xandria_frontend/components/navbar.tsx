"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletIndicator from "./wallet-indicator";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/marketplace", label: "MARKETPLACE" },
    { href: "/library", label: "LIBRARY" },
    { href: "/upload-book", label: "PUBLISH" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 backdrop-blur-md bg-[#0A0A08]/80">
      <div className="flex items-center gap-12">
        <Link href="/marketplace" className="font-display text-2xl text-text-primary tracking-wide">
          Xandria
        </Link>
        <div className="flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-xs tracking-[0.08em] uppercase transition-colors relative pb-1 ${
                  isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <WalletIndicator />
    </nav>
  );
}

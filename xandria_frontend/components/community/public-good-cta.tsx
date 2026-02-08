"use client";

import Link from "next/link";

export default function PublicGoodCta() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Request a Book */}
      <div className="rounded-xl border border-border bg-surface p-8">
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <h3 className="font-display text-xl text-text-primary">Request a Book</h3>
        </div>
        <p className="font-body text-text-secondary text-sm leading-relaxed mb-6">
          Can&apos;t find what you&apos;re looking for? Submit a request and the community
          will vote on which books get added next. The most requested titles
          get prioritized for on-chain publishing.
        </p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Book title"
            className="w-full bg-surface-hover border border-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 font-body"
          />
          <input
            type="text"
            placeholder="Author (optional)"
            className="w-full bg-surface-hover border border-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 font-body"
          />
          <button className="w-full px-4 py-2.5 bg-surface-hover border border-border text-text-secondary text-sm font-body rounded-md hover:border-accent/30 hover:text-text-primary transition-colors">
            Submit Request
          </button>
        </div>
        <p className="text-[11px] text-text-muted mt-3 font-body">
          12 requests submitted this week &middot; 3 being reviewed
        </p>
      </div>

      {/* Register as Public Good Worker */}
      <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/[0.04] to-surface p-8">
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h3 className="font-display text-xl text-text-primary">Become a Public Good Worker</h3>
        </div>
        <p className="font-body text-text-secondary text-sm leading-relaxed mb-5">
          Help build the library of the future. Public good workers curate collections,
          review submissions, verify metadata, and help maintain quality across the platform.
          Contributors earn on-chain reputation and a share of platform fees.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[9px] text-accent font-body">1</span>
            </div>
            <div>
              <p className="text-sm text-text-primary font-body">Curate &amp; Organize</p>
              <p className="text-xs text-text-muted font-body">Create collections, tag books, write editorial content</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[9px] text-accent font-body">2</span>
            </div>
            <div>
              <p className="text-sm text-text-primary font-body">Review &amp; Verify</p>
              <p className="text-xs text-text-muted font-body">Validate book quality, check metadata, flag issues</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[9px] text-accent font-body">3</span>
            </div>
            <div>
              <p className="text-sm text-text-primary font-body">Earn Reputation</p>
              <p className="text-xs text-text-muted font-body">On-chain badges, fee share, governance weight</p>
            </div>
          </div>
        </div>

        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background text-sm font-body font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Apply to join
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        <p className="text-[11px] text-text-muted mt-4 font-body">
          18 active workers &middot; 4 spots open this month
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import type { Book } from "@/types";

type ReviewWithBook = {
  id: string;
  bookId: number;
  reviewerName: string;
  content: string;
  conceptTags: string[];
  timestamp: string;
  bookTitle: string;
  bookCover?: string;
};

type CommunityReviewsProps = {
  reviews: ReviewWithBook[];
};

export default function CommunityReviews({ reviews }: CommunityReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-text-primary">Community Voices</h2>
        <p className="text-text-muted text-sm mt-1 font-body">
          What readers are saying across the library
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.slice(0, 6).map((review) => (
          <div
            key={review.id}
            className="p-5 rounded-lg border border-border bg-surface group hover:border-border/80 transition-colors"
          >
            {/* Review content */}
            <p className="font-body text-text-secondary text-[14px] leading-relaxed italic">
              &ldquo;{review.content}&rdquo;
            </p>

            {/* Concept tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {review.conceptTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] bg-accent/[0.06] text-accent/70 border border-accent/10 rounded font-body"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Attribution */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-6 h-6 rounded-full bg-surface-hover flex items-center justify-center">
                  <span className="text-[10px] font-body text-text-muted">
                    {review.reviewerName.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-body text-text-muted">
                  {review.reviewerName}
                </span>
              </div>

              <Link
                href={`/marketplace/${review.bookId}`}
                className="flex items-center gap-2 text-xs text-text-muted hover:text-accent transition-colors font-body"
              >
                {review.bookCover && (
                  <div className="w-5 h-7 rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={review.bookCover}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="truncate max-w-[140px]">{review.bookTitle}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

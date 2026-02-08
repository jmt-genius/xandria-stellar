"use client";

import { useState } from "react";
import type { BookReview } from "@/types";

export default function ReviewThread({ reviews }: { reviews: BookReview[] }) {
  const [expanded, setExpanded] = useState(false);

  if (reviews.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="font-body text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        {expanded ? "Hide" : `${reviews.length}`} reflection{reviews.length !== 1 ? "s" : ""}
        <span className="ml-1">{expanded ? "\u2191" : "\u2193"}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="border-l border-border pl-4">
              <p className="font-body text-xs text-text-muted mb-1">
                {review.reviewerName}
              </p>
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                {review.content}
              </p>
              <div className="flex gap-2 mt-2">
                {review.conceptTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] bg-accent-subtle text-accent rounded-full border border-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="font-mono text-[10px] text-text-muted mt-1">
                {new Date(review.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

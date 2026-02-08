"use client";

import type { BookMetadata } from "@/types";

export default function MetadataBar({ metadata }: { metadata: BookMetadata }) {
  const hours = Math.floor(metadata.readingTimeMinutes / 60);
  const mins = metadata.readingTimeMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m read` : `${mins}m read`;

  return (
    <p className="font-mono text-xs text-text-muted">
      {metadata.wordCount.toLocaleString()} words &middot; {timeStr} &middot; {metadata.tone} &middot; {metadata.difficulty}
    </p>
  );
}

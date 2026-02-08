import type { BookMetadata } from "@/types";
import { formatReadingTime } from "@/lib/format";

export default function MetadataPills({ metadata }: { metadata: BookMetadata }) {
  const pills = [
    `${formatReadingTime(metadata.readingTimeMinutes)} read`,
    metadata.difficulty,
  ];

  if (metadata.commonHighlights.length > 0) {
    pills.push("Frequently cited");
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {pills.map((pill) => (
        <span
          key={pill}
          className="px-2 py-0.5 text-[10px] bg-surface-hover text-text-muted rounded-full"
        >
          {pill}
        </span>
      ))}
    </div>
  );
}

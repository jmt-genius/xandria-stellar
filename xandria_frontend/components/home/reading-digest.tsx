import type { ReadingProfile } from "@/types";
import { formatReadingTime } from "@/lib/format";

export default function ReadingDigest({ profile }: { profile: ReadingProfile }) {
  const timeStr = formatReadingTime(profile.weeklyReadingTimeMinutes);

  const genreLabel = profile.topGenres.length > 0
    ? `Mostly ${profile.topGenres[0].toLowerCase()}`
    : "Exploring";

  const conceptCount = profile.topConcepts.length;

  const cards = [
    { value: timeStr, label: "Reading time this week" },
    { value: genreLabel, label: "Primary genre" },
    { value: `${conceptCount} ideas`, label: "Concepts absorbed" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-surface border border-border rounded-lg p-5"
        >
          <p className="font-display text-2xl text-text-primary">{card.value}</p>
          <p className="font-body text-xs text-text-muted mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

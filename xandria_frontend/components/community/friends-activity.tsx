"use client";

import Link from "next/link";
import type { Book } from "@/types";

type ActivityItem = {
  id: string;
  userName: string;
  action: "purchased" | "finished" | "highlighted" | "reviewed" | "tipped";
  bookTitle: string;
  bookId: number;
  bookCover?: string;
  timeAgo: string;
  snippet?: string;
};

type FriendsActivityProps = {
  books: Book[];
};

// Generate mock activity from available books
function generateActivity(books: Book[]): ActivityItem[] {
  const names = [
    "A. Morales", "K. Lindqvist", "S. Okafor", "D. Petrova", "M. Chen",
    "J. Dubois", "L. Bergman", "H. Schmidt", "Q. Fischer", "R. Thompson",
    "P. Johansson", "E. Andersson", "T. Nakamura", "B. Nguyen", "C. Rivera",
  ];
  const actions: ActivityItem["action"][] = ["purchased", "finished", "highlighted", "reviewed", "tipped"];
  const timeAgos = [
    "2m ago", "8m ago", "15m ago", "23m ago", "41m ago",
    "1h ago", "1h ago", "2h ago", "3h ago", "4h ago",
    "5h ago", "7h ago", "9h ago", "12h ago", "1d ago",
  ];
  const snippets = [
    "The feedback loop concept changed how I see everything",
    "This passage on quality has stayed with me all week",
    "Finally — someone who explains risk without jargon",
    "The patience of Monte Cristo is a masterclass",
    "Every chapter reads like a separate revelation",
    "Sent 2 XLM to the author — earned it",
  ];

  const booksWithCovers = books.filter((b) => b.coverUri);
  if (booksWithCovers.length === 0) return [];

  return Array.from({ length: 12 }, (_, i) => {
    const book = booksWithCovers[i % booksWithCovers.length];
    const action = actions[i % actions.length];
    return {
      id: `activity-${i}`,
      userName: names[i % names.length],
      action,
      bookTitle: book.title,
      bookId: book.id,
      bookCover: book.coverUri,
      timeAgo: timeAgos[i % timeAgos.length],
      snippet: action === "highlighted" || action === "reviewed" ? snippets[i % snippets.length] : undefined,
    };
  });
}

const actionLabels: Record<ActivityItem["action"], string> = {
  purchased: "purchased",
  finished: "finished reading",
  highlighted: "highlighted in",
  reviewed: "reviewed",
  tipped: "tipped the author of",
};

const actionColors: Record<ActivityItem["action"], string> = {
  purchased: "text-accent",
  finished: "text-green-400/80",
  highlighted: "text-blue-400/80",
  reviewed: "text-purple-400/80",
  tipped: "text-accent",
};

export default function FriendsActivity({ books }: FriendsActivityProps) {
  const activity = generateActivity(books);

  if (activity.length === 0) return null;

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-text-primary">What Readers Are Doing</h2>
        <p className="text-text-muted text-sm mt-1 font-body">
          Live from the Xandria community
        </p>
      </div>

      <div className="space-y-1 rounded-lg border border-border overflow-hidden">
        {activity.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 bg-surface hover:bg-surface-hover transition-colors"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-surface-hover border border-border flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-body text-text-muted">
                {item.userName.charAt(0)}
              </span>
            </div>

            {/* Activity text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body">
                <span className="text-text-primary">{item.userName}</span>
                {" "}
                <span className={actionColors[item.action]}>{actionLabels[item.action]}</span>
                {" "}
                <Link
                  href={`/marketplace/${item.bookId}`}
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  {item.bookTitle}
                </Link>
              </p>
              {item.snippet && (
                <p className="text-xs text-text-muted mt-0.5 truncate italic font-body">
                  &ldquo;{item.snippet}&rdquo;
                </p>
              )}
            </div>

            {/* Book cover */}
            {item.bookCover && (
              <div className="w-6 h-8 rounded-sm overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={item.bookCover}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Time */}
            <span className="text-[10px] text-text-muted font-body flex-shrink-0 w-12 text-right">
              {item.timeAgo}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

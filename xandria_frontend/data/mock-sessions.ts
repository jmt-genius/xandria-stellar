import type { ReadingSession } from "@/types";

export const mockSessions: ReadingSession[] = [
  {
    id: "session-1",
    bookId: 6,
    startedAt: "2026-02-05T08:00:00Z",
    endedAt: "2026-02-05T08:42:00Z",
    pagesRead: 4,
    durationMinutes: 42,
    ideasExtracted: ["stoicism", "self-discipline", "impermanence"],
  },
  {
    id: "session-2",
    bookId: 2,
    startedAt: "2026-02-04T21:00:00Z",
    endedAt: "2026-02-04T22:15:00Z",
    pagesRead: 6,
    durationMinutes: 75,
    ideasExtracted: ["surveillance", "truth", "language"],
  },
  {
    id: "session-3",
    bookId: 1,
    startedAt: "2026-02-03T14:00:00Z",
    endedAt: "2026-02-03T15:30:00Z",
    pagesRead: 8,
    durationMinutes: 90,
    ideasExtracted: ["american dream", "wealth", "disillusionment"],
  },
  {
    id: "session-4",
    bookId: 4,
    startedAt: "2026-02-02T10:00:00Z",
    endedAt: "2026-02-02T10:35:00Z",
    pagesRead: 3,
    durationMinutes: 35,
    ideasExtracted: ["strategy", "adaptability"],
  },
  {
    id: "session-5",
    bookId: 6,
    startedAt: "2026-02-01T07:00:00Z",
    endedAt: "2026-02-01T07:20:00Z",
    pagesRead: 2,
    durationMinutes: 20,
    ideasExtracted: ["duty", "virtue"],
  },
];

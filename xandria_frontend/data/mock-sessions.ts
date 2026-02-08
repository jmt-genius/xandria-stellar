import type { ReadingSession } from "@/types";

// Mock sessions are only used as initial data before any real reading happens.
// Since book IDs come from the contract at runtime, these will match only
// if the IDs happen to correspond. Once a user reads any book, real sessions
// are created and persisted, and these become irrelevant.
export const mockSessions: ReadingSession[] = [];

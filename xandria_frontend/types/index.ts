export type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  coverUri: string;
  bookUri: string;
  isSpecial: boolean;
  totalSupply: number;
  remainingSupply: number;
  authorAddress: string;
  description: string;
  rating: number;
  votes: number;
  genre: string;
  chapters: Chapter[];
  aiSummary: string;
};

export type Chapter = {
  id: string;
  title: string;
  content: string[];
};

export type OwnedBook = {
  bookId: number;
  ownerAddress: string;
  mintNumber: number;
  editionCover: string;
  purchasedAt: string;
  txHash: string;
  currentPage: number;
};

export type WalletState = {
  connected: boolean;
  publicKey: string | null;
  balance: number;
};

export type AiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type Notification = {
  id: string;
  title: string;
  subtitle: string;
  type: "purchase" | "info" | "error";
};

export type BookMetadata = {
  wordCount: number;
  readingTimeMinutes: number;
  tone: string;
  difficulty: "Accessible" | "Moderate" | "Challenging";
  concepts: string[];
  whyPeopleRead: string[];
  commonHighlights: { quote: string; count: number }[];
  socialProof: string;
  editorialTags: string[];
};

export type BookReview = {
  id: string;
  bookId: number;
  reviewerName: string;
  content: string;
  conceptTags: string[];
  timestamp: string;
};

export type ReadingSession = {
  id: string;
  bookId: number;
  startedAt: string;
  endedAt: string | null;
  pagesRead: number;
  durationMinutes: number;
  ideasExtracted: string[];
};

export type AuthorProfile = {
  id: string;
  address: string;
  name: string;
  bio: string;
  fields: string[];
  publishedBookIds: number[];
};

export type CuratedCollection = {
  id: string;
  title: string;
  subtitle: string;
  curatorName: string;
  description: string;
  bookIds: number[];
};

export type ShelfMode = "chronological" | "theme" | "emotional";
export type AiPaneMode = "explain" | "summarize" | "argue" | "counterpoints";
export type InfoModalType = "drm" | "ownership" | "kindle-comparison";

export type ReadingProfile = {
  totalReadingTimeMinutes: number;
  weeklyReadingTimeMinutes: number;
  topGenres: string[];
  topConcepts: string[];
  recentIdeas: string[];
};

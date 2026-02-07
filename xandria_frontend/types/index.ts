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

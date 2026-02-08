import type { BookReview } from "@/types";

export const reviews: BookReview[] = [
  // The Great Gatsby (book 1)
  {
    id: "r1",
    bookId: 1,
    reviewerName: "A. Morales",
    content: "This reframed how I think about ambition. Gatsby isn't chasing Daisy — he's chasing the idea that the past can be rewritten.",
    conceptTags: ["american dream", "disillusionment"],
    timestamp: "2025-11-12T14:30:00Z",
  },
  {
    id: "r2",
    bookId: 1,
    reviewerName: "K. Lindqvist",
    content: "Fitzgerald shows that wealth doesn't corrupt — it reveals. Every character was already who they were.",
    conceptTags: ["wealth", "class"],
    timestamp: "2025-12-03T09:15:00Z",
  },
  {
    id: "r3",
    bookId: 1,
    reviewerName: "S. Okafor",
    content: "The green light is the most efficient symbol in literature. Five words, infinite meaning.",
    conceptTags: ["love", "american dream"],
    timestamp: "2026-01-08T18:45:00Z",
  },

  // 1984 (book 2)
  {
    id: "r4",
    bookId: 2,
    reviewerName: "D. Petrova",
    content: "I read this every few years. Each time, a different passage feels like it was written yesterday.",
    conceptTags: ["surveillance", "truth"],
    timestamp: "2025-10-22T11:00:00Z",
  },
  {
    id: "r5",
    bookId: 2,
    reviewerName: "M. Chen",
    content: "Orwell understood that controlling language is more effective than controlling people. The appendix on Newspeak is the most important part.",
    conceptTags: ["language", "power"],
    timestamp: "2025-11-15T16:20:00Z",
  },

  // Pride and Prejudice (book 3)
  {
    id: "r6",
    bookId: 3,
    reviewerName: "R. Agarwal",
    content: "Austen invented the modern social novel. Everything about relationships in fiction traces back here.",
    conceptTags: ["marriage", "class"],
    timestamp: "2025-09-18T08:30:00Z",
  },
  {
    id: "r7",
    bookId: 3,
    reviewerName: "J. Dubois",
    content: "Elizabeth Bennet is the first character in English literature who is smarter than everyone around her and knows it — without being the villain.",
    conceptTags: ["pride", "self-knowledge"],
    timestamp: "2025-12-28T13:45:00Z",
  },

  // The Art of War (book 4)
  {
    id: "r8",
    bookId: 4,
    reviewerName: "T. Nakamura",
    content: "I keep a copy on my desk. Not for warfare — for thinking clearly under pressure.",
    conceptTags: ["strategy", "leadership"],
    timestamp: "2025-10-05T10:00:00Z",
  },
  {
    id: "r9",
    bookId: 4,
    reviewerName: "L. Bergman",
    content: "The brevity is the message. Every sentence does work. No filler. The form matches the philosophy.",
    conceptTags: ["strategy", "adaptability"],
    timestamp: "2026-01-14T15:30:00Z",
  },

  // Frankenstein (book 5)
  {
    id: "r10",
    bookId: 5,
    reviewerName: "C. Rivera",
    content: "Mary Shelley was 18 when she wrote this. That fact alone is a kind of horror.",
    conceptTags: ["creation", "ambition"],
    timestamp: "2025-11-30T20:15:00Z",
  },
  {
    id: "r11",
    bookId: 5,
    reviewerName: "P. Johansson",
    content: "The creature's eloquence is the most devastating part. He can articulate his suffering perfectly — and it changes nothing.",
    conceptTags: ["isolation", "monstrosity"],
    timestamp: "2026-01-02T12:00:00Z",
  },

  // Meditations (book 6)
  {
    id: "r12",
    bookId: 6,
    reviewerName: "N. Kapoor",
    content: "These are notes an emperor wrote to himself. The honesty is staggering because it was never meant to persuade.",
    conceptTags: ["stoicism", "duty"],
    timestamp: "2025-10-18T07:30:00Z",
  },
  {
    id: "r13",
    bookId: 6,
    reviewerName: "E. Andersson",
    content: "I highlight something new every time. The ideas aren't complex — but they demand practice, not understanding.",
    conceptTags: ["virtue", "self-discipline"],
    timestamp: "2025-12-11T14:00:00Z",
  },
  {
    id: "r14",
    bookId: 6,
    reviewerName: "W. Torres",
    content: "The most powerful man in the world reminding himself to be humble. That tension is the whole book.",
    conceptTags: ["impermanence", "stoicism"],
    timestamp: "2026-01-20T09:45:00Z",
  },
];

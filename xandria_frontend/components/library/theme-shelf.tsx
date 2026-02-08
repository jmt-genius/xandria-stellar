"use client";

import { useMemo } from "react";
import type { Book, OwnedBook } from "@/types";
import { getBookMetadata } from "@/data/book-metadata";
import GroupedShelf from "./grouped-shelf";

type ThemeShelfProps = {
  books: Book[];
  ownedBooks: OwnedBook[];
};

const themeGroups: Record<string, string[]> = {
  "Systems & Complexity": ["systems", "feedback loops", "uncertainty", "rare events", "antifragility", "volatility", "complexity"],
  "Craft & Creation": ["creativity", "craft", "process", "routine", "discipline", "awareness", "creative process"],
  "Strategy & Execution": ["strategy", "leadership", "execution", "goals", "lateral thinking", "simplicity", "innovation"],
  "Philosophy & Self": ["quality", "freedom", "morality", "faith", "identity", "play", "boundaries", "doubt"],
  "Human Nature": ["body language", "social behavior", "guilt", "memory", "alienation", "suffering", "human nature"],
};

export default function ThemeShelf({ books, ownedBooks }: ThemeShelfProps) {
  const groups = useMemo(() => {
    const result: Record<string, { book: Book; owned: OwnedBook }[]> = {};

    for (const [group, concepts] of Object.entries(themeGroups)) {
      const matched = books.filter((book) => {
        const meta = getBookMetadata(book);
        if (!meta) return false;
        return meta.concepts.some((c) => concepts.includes(c));
      });

      if (matched.length > 0) {
        result[group] = matched
          .map((book) => {
            const owned = ownedBooks.find((o) => o.bookId === book.id);
            return owned ? { book, owned } : null;
          })
          .filter(Boolean) as { book: Book; owned: OwnedBook }[];
      }
    }

    return result;
  }, [books, ownedBooks]);

  return <GroupedShelf groups={groups} />;
}

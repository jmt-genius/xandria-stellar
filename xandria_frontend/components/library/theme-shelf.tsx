"use client";

import { useMemo } from "react";
import type { Book, OwnedBook } from "@/types";
import { bookMetadata } from "@/data/book-metadata";
import GroupedShelf from "./grouped-shelf";

type ThemeShelfProps = {
  books: Book[];
  ownedBooks: OwnedBook[];
};

const themeGroups: Record<string, string[]> = {
  "Power & Strategy": ["strategy", "leadership", "power", "surveillance", "totalitarianism"],
  "Love & Society": ["love", "marriage", "class", "pride", "prejudice"],
  "Philosophy & Self": ["stoicism", "duty", "virtue", "impermanence", "self-discipline", "self-knowledge"],
  "Creation & Ambition": ["creation", "ambition", "american dream", "wealth", "disillusionment"],
};

export default function ThemeShelf({ books, ownedBooks }: ThemeShelfProps) {
  const groups = useMemo(() => {
    const result: Record<string, { book: Book; owned: OwnedBook }[]> = {};

    for (const [group, concepts] of Object.entries(themeGroups)) {
      const matched = books.filter((book) => {
        const meta = bookMetadata[book.id];
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

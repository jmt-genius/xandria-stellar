"use client";

import { useMemo } from "react";
import type { Book, OwnedBook } from "@/types";
import { getBookMetadata } from "@/data/book-metadata";
import GroupedShelf from "./grouped-shelf";

type EmotionalShelfProps = {
  books: Book[];
  ownedBooks: OwnedBook[];
};

export default function EmotionalShelf({ books, ownedBooks }: EmotionalShelfProps) {
  const groups = useMemo(() => {
    const toneGroups: Record<string, { book: Book; owned: OwnedBook }[]> = {};

    for (const book of books) {
      const meta = getBookMetadata(book);
      if (!meta) continue;
      const owned = ownedBooks.find((o) => o.bookId === book.id);
      if (!owned) continue;

      const tone = meta.tone;
      if (!toneGroups[tone]) toneGroups[tone] = [];
      toneGroups[tone].push({ book, owned });
    }

    return toneGroups;
  }, [books, ownedBooks]);

  return <GroupedShelf groups={groups} />;
}

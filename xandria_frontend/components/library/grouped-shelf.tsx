"use client";

import type { Book, OwnedBook } from "@/types";
import OwnedBookCard from "@/components/owned-book-card";

type GroupedShelfProps = {
  groups: Record<string, { book: Book; owned: OwnedBook }[]>;
};

export default function GroupedShelf({ groups }: GroupedShelfProps) {
  return (
    <div className="space-y-10">
      {Object.entries(groups).map(([groupName, items]) => {
        if (items.length === 0) return null;
        return (
          <div key={groupName}>
            <h3 className="font-display text-lg text-text-primary mb-4">{groupName}</h3>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {items.map(({ book, owned }) => (
                <div key={book.id} className="flex-shrink-0 w-[200px]">
                  <OwnedBookCard book={book} ownedBook={owned} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

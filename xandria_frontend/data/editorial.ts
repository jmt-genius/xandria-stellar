import { normalizeTitle } from "@/lib/book-helpers";
import type { Book } from "@/types";

export type EditorialRow = {
  id: string;
  title: string;
  subtitle: string;
  bookTitles: string[];
};

export const editorialRows: EditorialRow[] = [
  {
    id: "ed-1",
    title: "Books That Rewire How You Think",
    subtitle: "Mental models that change everything downstream",
    bookTitles: [
      "thinking in systems",
      "finite and infinite games",
      "the black swan",
      "antifragile: things that gain from disorder",
      "the art of doing science and engineering",
      "zen and the art of motorcycle maintenance",
    ],
  },
  {
    id: "ed-2",
    title: "Crafted by Practitioners",
    subtitle: "Written by people who built things, not just described them",
    bookTitles: [
      "the nvidia way: jensen huang and the making of a tech giant",
      "the creative act: a way of being",
      "predatory thinking",
      "the art of doing science and engineering",
      "daily rituals: how artists work",
      "peoplewatching",
    ],
  },
  {
    id: "ed-3",
    title: "Under 300 Pages, Maximum Impact",
    subtitle: "Brevity as a virtue — read in a sitting, think about for years",
    bookTitles: [
      "finite and infinite games",
      "predatory thinking",
      "the 12 week year",
      "chop wood carry water",
      "the creative act: a way of being",
      "daily rituals: how artists work",
      "there is no antimemetics division",
    ],
  },
  {
    id: "ed-4",
    title: "The Russian & European Canon",
    subtitle: "Literature that maps the human soul",
    bookTitles: [
      "crime and punishment",
      "the brothers karamazov",
      "the count of monte cristo",
    ],
  },
];

/** Resolve editorial row book titles to actual Book objects. */
export function resolveEditorialBooks(
  row: EditorialRow,
  books: Book[],
): Book[] {
  return row.bookTitles
    .map((title) =>
      books.find(
        (b) =>
          normalizeTitle(b.title) === normalizeTitle(title) ||
          normalizeTitle(b.title).startsWith(normalizeTitle(title)) ||
          normalizeTitle(title).startsWith(normalizeTitle(b.title)),
      ),
    )
    .filter(Boolean) as Book[];
}

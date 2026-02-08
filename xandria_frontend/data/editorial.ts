export type EditorialRow = {
  id: string;
  title: string;
  subtitle: string;
  bookIds: number[];
};

export const editorialRows: EditorialRow[] = [
  {
    id: "ed-1",
    title: "Books That Changed How People Think",
    subtitle: "Ideas that rewired culture",
    bookIds: [2, 4, 6, 1, 5, 3],
  },
  {
    id: "ed-2",
    title: "Written by Builders",
    subtitle: "By people who made things, not just described them",
    bookIds: [4, 6],
  },
  {
    id: "ed-3",
    title: "Short Reads, Big Ideas",
    subtitle: "Under 200 pages, infinite resonance",
    bookIds: [4, 1],
  },
];

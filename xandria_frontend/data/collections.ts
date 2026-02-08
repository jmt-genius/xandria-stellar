import type { CuratedCollection } from "@/types";

export const collections: CuratedCollection[] = [
  {
    id: "col-1",
    title: "Books That Changed How People Think",
    subtitle: "Ideas that rewired culture",
    curatorName: "Xandria Editorial",
    description: "These books didn't just reflect their times — they altered the trajectory of thought itself. From Orwell's warning about language as a tool of control to Marcus Aurelius writing philosophy as a daily discipline, each work here shifted how entire generations understood the world.",
    bookIds: [2, 4, 6, 1],
  },
  {
    id: "col-2",
    title: "Written by Builders",
    subtitle: "By people who made things, not just described them",
    curatorName: "Xandria Editorial",
    description: "Sun Tzu commanded armies. Marcus Aurelius governed an empire. These aren't theorists — they're practitioners who wrote down what they learned. The ideas here were tested in the field before they reached the page.",
    bookIds: [4, 6],
  },
  {
    id: "col-3",
    title: "Short Reads, Big Ideas",
    subtitle: "Under 200 pages, infinite resonance",
    curatorName: "Xandria Editorial",
    description: "Brevity as a virtue. These books prove that the most powerful ideas don't need 500 pages. Each can be read in a sitting but will occupy your thinking for weeks.",
    bookIds: [4, 1],
  },
];

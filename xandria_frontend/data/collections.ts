import { normalizeTitle } from "@/lib/book-helpers";
import type { Book } from "@/types";

export type CuratedCollection = {
  id: string;
  title: string;
  subtitle: string;
  curatorName: string;
  description: string;
  bookTitles: string[];
};

export const collections: CuratedCollection[] = [
  {
    id: "col-1",
    title: "Books That Rewire How You Think",
    subtitle: "Mental models that change everything downstream",
    curatorName: "Xandria Editorial",
    description:
      "These books don't add information — they change the operating system you use to process information. Systems thinking, antifragility, infinite games, Black Swans — each one installs a mental model that, once absorbed, makes the previous way of seeing feel incomplete. Start anywhere. The order doesn't matter.",
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
    id: "col-2",
    title: "Crafted by Practitioners",
    subtitle: "Written by people who built things, not just described them",
    curatorName: "Xandria Editorial",
    description:
      "Jensen Huang built a $3 trillion company. Rick Rubin produced albums that defined genres. Dave Trott created ad campaigns that moved markets. Richard Hamming invented error-correcting codes. These aren't theorists — they're practitioners who wrote down what they learned. The ideas here were tested in the real world before they reached the page.",
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
    id: "col-3",
    title: "Under 300 Pages, Maximum Impact",
    subtitle: "Brevity as a virtue",
    curatorName: "Xandria Editorial",
    description:
      "Proof that the most powerful ideas don't need 500 pages. Finite and Infinite Games is 150 pages that rewire how you see every human activity. Predatory Thinking delivers a complete creative strategy education in under 200 pages. Each book here can be read in a sitting but will occupy your thinking for months.",
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
    id: "col-4",
    title: "The Russian & European Canon",
    subtitle: "Literature that maps the human soul",
    curatorName: "Xandria Editorial",
    description:
      "Dostoevsky explored guilt, faith, and the limits of rationality in ways no writer has matched since. Dumas wrote the most patient revenge narrative in literary history. Together, these novels form a map of what it means to be human — in extremis, under pressure, at the boundary of morality. Not light reading. But reading that changes you.",
    bookTitles: [
      "crime and punishment",
      "the brothers karamazov",
      "the count of monte cristo",
    ],
  },
  {
    id: "col-5",
    title: "The Taleb Shelf",
    subtitle: "Uncertainty, risk, and the art of not being a sucker",
    curatorName: "Xandria Editorial",
    description:
      "Nassim Nicholas Taleb's Incerto series is a single, sustained argument about how to live in a world we don't understand. The Black Swan shows why we can't predict what matters. Antifragile shows how to benefit from the chaos we can't control. Read them together — the second book answers the first.",
    bookTitles: [
      "the black swan",
      "antifragile: things that gain from disorder",
    ],
  },
  {
    id: "col-6",
    title: "The Builder's Reading List",
    subtitle: "For people making things, not just consuming things",
    curatorName: "Xandria Editorial",
    description:
      "If you're building a company, a creative practice, or a career — this is your shelf. The Nvidia Way for conviction. The Creative Act for process. The 12 Week Year for execution. Predatory Thinking for strategy. Chop Wood Carry Water for patience. Together they cover every phase of building something that matters.",
    bookTitles: [
      "the nvidia way: jensen huang and the making of a tech giant",
      "the creative act: a way of being",
      "the 12 week year",
      "predatory thinking",
      "chop wood carry water",
      "the art of doing science and engineering",
    ],
  },
  {
    id: "col-7",
    title: "Start Here",
    subtitle: "Five books if you're new to Xandria",
    curatorName: "Xandria Editorial",
    description:
      "No prerequisites, no required reading order. These five books represent the breadth of what Xandria offers — from philosophy to strategy to fiction — and each one can be finished in a focused weekend. Think of it as a sampler platter for your mind.",
    bookTitles: [
      "finite and infinite games",
      "the creative act: a way of being",
      "predatory thinking",
      "chop wood carry water",
      "there is no antimemetics division",
    ],
  },
  {
    id: "col-8",
    title: "Fiction That Haunts",
    subtitle: "Stories that move in after you finish them",
    curatorName: "Xandria Editorial",
    description:
      "These aren't books you read — they're books that read you. Raskolnikov's guilt becomes yours. Dantès' patience tests yours. The Antimemetics Division makes you question your own memory. Every one of these leaves a residue that changes how you see the world.",
    bookTitles: [
      "crime and punishment",
      "the count of monte cristo",
      "the brothers karamazov",
      "there is no antimemetics division",
      "zen and the art of motorcycle maintenance",
    ],
  },
  {
    id: "col-9",
    title: "The Process Collection",
    subtitle: "How the best in the world actually work",
    curatorName: "Xandria Editorial",
    description:
      "Forget productivity hacks. These books are about the deep structure of how remarkable work gets done. Rubin's creative process, Currey's catalog of 161 daily routines, Moran's execution framework, Medcalf's philosophy of patience, Hamming's approach to doing science that matters. Process is the only thing you can control.",
    bookTitles: [
      "the creative act: a way of being",
      "daily rituals: how artists work",
      "the 12 week year",
      "chop wood carry water",
      "the art of doing science and engineering",
    ],
  },
  {
    id: "col-10",
    title: "For the Contrarian",
    subtitle: "Books that make you distrust everything you were taught",
    curatorName: "Xandria Editorial",
    description:
      "If you've ever suspected that experts are wrong, that stability is dangerous, that the conventional path is a trap — these books will arm you with the arguments. Taleb on prediction, Pirsig on quality, Carse on rules, Trott on conventional thinking. Not comfortable reads. But honest ones.",
    bookTitles: [
      "the black swan",
      "antifragile: things that gain from disorder",
      "zen and the art of motorcycle maintenance",
      "finite and infinite games",
      "predatory thinking",
      "peoplewatching",
    ],
  },
];

/** Resolve collection book titles to actual Book objects. */
export function resolveCollectionBooks(
  collection: CuratedCollection,
  books: Book[],
): Book[] {
  return collection.bookTitles
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

import type { Chapter } from "@/types";
import { matchTitle } from "@/lib/book-helpers";

type BookEnrichment = {
  description: string;
  rating: number;
  votes: number;
  genre: string;
  chapters: Chapter[];
  aiSummary: string;
};

const enrichmentByTitle: Record<string, BookEnrichment> = {
  "thinking in systems": {
    description:
      "A primer on systems thinking that shows how interconnected elements create complex behaviors, from ecosystems to economies.",
    rating: 4.6,
    votes: 1847,
    genre: "Science",
    aiSummary:
      "Meadows reveals the hidden dynamics behind everything from market crashes to environmental collapse, teaching readers to see the world in terms of stocks, flows, and feedback loops.",
    chapters: [],
  },
  "zen and the art of motorcycle maintenance": {
    description:
      "A philosophical odyssey disguised as a cross-country motorcycle trip, exploring the nature of quality and the tension between science and art.",
    rating: 4.4,
    votes: 2341,
    genre: "Philosophy",
    aiSummary:
      "Pirsig weaves a father-son motorcycle journey with deep inquiry into what 'Quality' means, challenging the divide between technical and romantic understanding.",
    chapters: [],
  },
  "there is no antimemetics division": {
    description:
      "A mind-bending narrative about ideas that resist being known, and the people fighting to remember threats that erase themselves from memory.",
    rating: 4.7,
    votes: 1456,
    genre: "Science Fiction",
    aiSummary:
      "What happens when the enemy is an idea that makes you forget it exists? This SCP-inspired novel follows the Antimemetics Division as they wage war against threats designed to be unthinkable.",
    chapters: [],
  },
  "the nvidia way: jensen huang and the making of a tech giant": {
    description:
      "The inside story of how Jensen Huang built Nvidia from a struggling chipmaker into the most important company of the AI era.",
    rating: 4.5,
    votes: 987,
    genre: "Business",
    aiSummary:
      "A detailed account of Jensen Huang's relentless, unconventional leadership and the strategic bets that transformed Nvidia from a graphics card company into the backbone of artificial intelligence.",
    chapters: [],
  },
  "the creative act: a way of being": {
    description:
      "A legendary music producer's guide to the creative process — not about making art, but about being the kind of person who notices the art that wants to be made.",
    rating: 4.6,
    votes: 2156,
    genre: "Creativity",
    aiSummary:
      "Rick Rubin distills decades of working with artists into a philosophy of creativity that applies to everyone — arguing that the creative act is fundamentally about paying attention.",
    chapters: [],
  },
  "the count of monte cristo": {
    description:
      "The ultimate tale of betrayal and revenge, following Edmond Dantès from wrongful imprisonment to elaborate, patient vengeance.",
    rating: 4.8,
    votes: 3241,
    genre: "Classic Fiction",
    aiSummary:
      "Dumas crafted the definitive revenge narrative: a young man betrayed by friends, imprisoned for fourteen years, who emerges with a fortune and a plan to systematically destroy those who ruined him.",
    chapters: [],
  },
  "the brothers karamazov": {
    description:
      "Dostoevsky's final masterpiece, a murder mystery wrapped around the deepest questions of faith, doubt, and the nature of God.",
    rating: 4.7,
    votes: 2847,
    genre: "Classic Fiction",
    aiSummary:
      "Through the Karamazov family — a sensualist father and three very different sons — Dostoevsky stages the ultimate debate between faith and reason, freedom and responsibility.",
    chapters: [],
  },
  "the black swan": {
    description:
      "A demolition of our confidence in predicting the future, arguing that the most important events are precisely the ones we never see coming.",
    rating: 4.5,
    votes: 1987,
    genre: "Philosophy",
    aiSummary:
      "Taleb argues that rare, high-impact events — Black Swans — dominate history, markets, and personal lives, yet we consistently underestimate them due to cognitive biases and flawed models.",
    chapters: [],
  },
  "the art of doing science and engineering": {
    description:
      "Richard Hamming's course on how to think about thinking — how to recognize important problems, develop good taste in research, and do work that matters.",
    rating: 4.6,
    votes: 1234,
    genre: "Science",
    aiSummary:
      "Hamming's legendary course distills decades at Bell Labs into principles for doing first-rate work: choosing the right problems, maintaining courage in research, and never settling for trivial results.",
    chapters: [],
  },
  "the 12 week year": {
    description:
      "A productivity framework that compresses annual goals into 12-week cycles, creating urgency and focus that annual planning never achieves.",
    rating: 4.3,
    votes: 1567,
    genre: "Self-Development",
    aiSummary:
      "Moran and Lennington argue that annual planning fails because it creates an illusion of time. By treating every 12 weeks as a 'year,' you eliminate procrastination and force consistent execution.",
    chapters: [],
  },
  "predatory thinking": {
    description:
      "A collection of short, punchy stories about outthinking the competition — from advertising wars to military strategy to street-level hustle.",
    rating: 4.4,
    votes: 876,
    genre: "Strategy",
    aiSummary:
      "Dave Trott uses rapid-fire anecdotes from advertising, war, and everyday life to teach a single principle: the best strategy is the one your competitor doesn't expect.",
    chapters: [],
  },
  peoplewatching: {
    description:
      "A zoologist's guide to the human animal — decoding gestures, postures, and rituals we perform every day without realizing.",
    rating: 4.3,
    votes: 1123,
    genre: "Psychology",
    aiSummary:
      "Morris approaches human behavior the way a field biologist observes animals: cataloging our gestures, territorial instincts, and social displays with scientific precision and genuine warmth.",
    chapters: [],
  },
  "finite and infinite games": {
    description:
      "A short, radical philosophical work that divides all human activity into two types: games played to win, and games played to keep playing.",
    rating: 4.5,
    votes: 1678,
    genre: "Philosophy",
    aiSummary:
      "Carse proposes a single distinction — finite games played for victory, infinite games played for continuation — and uses it to reinterpret war, culture, society, and the meaning of life itself.",
    chapters: [],
  },
  "daily rituals: how artists work": {
    description:
      "A catalog of the daily routines of 161 great minds — writers, composers, painters, scientists — revealing how creative work actually gets done.",
    rating: 4.2,
    votes: 1345,
    genre: "Creativity",
    aiSummary:
      "Currey documents how Beethoven counted exactly 60 coffee beans per cup, how Kafka wrote from 11pm to 3am, and how hundreds of other creators structured their days — proving there is no single right way to work.",
    chapters: [],
  },
  "crime and punishment": {
    description:
      "The story of a young man who commits murder to prove a philosophical theory — and discovers that the mind has its own form of justice.",
    rating: 4.7,
    votes: 2567,
    genre: "Classic Fiction",
    aiSummary:
      "Raskolnikov murders a pawnbroker to test whether he stands above conventional morality. What follows is the most psychologically devastating examination of guilt ever written.",
    chapters: [],
  },
  "chop wood carry water": {
    description:
      "A parable about a young man who travels to Japan to become a samurai archer — and learns that mastery is about falling in love with the boring fundamentals.",
    rating: 4.4,
    votes: 1432,
    genre: "Self-Development",
    aiSummary:
      "Through the story of John, who expects glory but finds years of chopping wood and carrying water, Medcalf teaches that greatness is built through embracing the mundane process, not chasing the dramatic result.",
    chapters: [],
  },
  "antifragile: things that gain from disorder": {
    description:
      "Taleb's central work, introducing the concept of antifragility — things that don't merely resist shock but actually benefit from stress, disorder, and volatility.",
    rating: 4.6,
    votes: 2234,
    genre: "Philosophy",
    aiSummary:
      "Beyond robust, beyond resilient: Taleb names and explores the property of systems that gain from disorder, arguing that our obsessive desire for stability is itself the greatest source of fragility.",
    chapters: [],
  },
};

/** Look up enrichment data by book title (case-insensitive, fuzzy). */
export function getEnrichmentByTitle(
  title: string,
): Partial<BookEnrichment> {
  return matchTitle(title, enrichmentByTitle) ?? {};
}

export const allGenres = [
  "All",
  "Classic Fiction",
  "Science Fiction",
  "Philosophy",
  "Business",
  "Creativity",
  "Psychology",
  "Science",
  "Strategy",
  "Self-Development",
];

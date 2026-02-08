import { normalizeTitle } from "@/lib/book-helpers";

type ReviewData = {
  id: string;
  reviewerName: string;
  content: string;
  conceptTags: string[];
  timestamp: string;
};

const reviewsByTitle: Record<string, ReviewData[]> = {
  "thinking in systems": [
    { id: "r1", reviewerName: "A. Morales", content: "After this book, I couldn't stop seeing feedback loops everywhere — in my team, in traffic patterns, in my own habits. It's like getting a new pair of eyes.", conceptTags: ["systems", "feedback loops"], timestamp: "2025-11-12T14:30:00Z" },
    { id: "r2", reviewerName: "K. Lindqvist", content: "Meadows writes about complexity the way good teachers speak: clearly, without dumbing it down. This should be required reading for anyone making decisions.", conceptTags: ["complexity", "leverage points"], timestamp: "2025-12-03T09:15:00Z" },
  ],
  "zen and the art of motorcycle maintenance": [
    { id: "r3", reviewerName: "S. Okafor", content: "I read this at 22 and didn't understand it. Read it again at 35 and it broke me open. The motorcycle is the metaphor, but the real journey is internal.", conceptTags: ["quality", "identity"], timestamp: "2026-01-08T18:45:00Z" },
    { id: "r4", reviewerName: "D. Petrova", content: "Pirsig managed to write a philosophy book that reads like a road trip, and a road trip that reads like a philosophy book. Neither would work without the other.", conceptTags: ["rationality", "craftsmanship"], timestamp: "2025-10-22T11:00:00Z" },
  ],
  "there is no antimemetics division": [
    { id: "r5", reviewerName: "M. Chen", content: "The most genuinely scary thing I've read in years. Not because of gore or jump scares, but because the central premise — ideas that you can't remember — is logically airtight.", conceptTags: ["memory", "information hazards"], timestamp: "2025-11-15T16:20:00Z" },
    { id: "r6", reviewerName: "R. Agarwal", content: "This started as web fiction and it's better than 95% of published sci-fi. The antimeme concept is the kind of idea that haunts you.", conceptTags: ["existential threat", "identity"], timestamp: "2025-09-18T08:30:00Z" },
  ],
  "the nvidia way: jensen huang and the making of a tech giant": [
    { id: "r7", reviewerName: "J. Dubois", content: "Jensen's 'thirty days from going out of business' mindset explains everything about Nvidia's culture. This book is a masterclass in long-term conviction.", conceptTags: ["leadership", "innovation"], timestamp: "2025-12-28T13:45:00Z" },
    { id: "r8", reviewerName: "T. Nakamura", content: "As someone in semiconductors, the technical details are right. As someone who studies leadership, the culture details are remarkable. No 1:1s, flat hierarchy, pure speed.", conceptTags: ["corporate culture", "semiconductor industry"], timestamp: "2025-10-05T10:00:00Z" },
  ],
  "the creative act: a way of being": [
    { id: "r9", reviewerName: "L. Bergman", content: "Rick Rubin wrote a book about creativity that contains zero tips, zero hacks, and zero productivity advice. It's entirely about presence. And it's the best creativity book I've ever read.", conceptTags: ["creativity", "awareness"], timestamp: "2026-01-14T15:30:00Z" },
    { id: "r10", reviewerName: "C. Rivera", content: "Every chapter is a paragraph. Every paragraph is a meditation. I keep this on my desk and read one page every morning.", conceptTags: ["process", "craft"], timestamp: "2025-11-30T20:15:00Z" },
  ],
  "the count of monte cristo": [
    { id: "r11", reviewerName: "P. Johansson", content: "I've never read a book where I felt the protagonist's patience so deeply. When the revenge finally comes, it doesn't feel satisfying — it feels earned. That distinction is everything.", conceptTags: ["revenge", "patience"], timestamp: "2026-01-02T12:00:00Z" },
    { id: "r12", reviewerName: "N. Kapoor", content: "At 1,200 pages, it never drags. Dumas understood pacing better than any modern thriller writer. The wait IS the story.", conceptTags: ["justice", "transformation"], timestamp: "2025-10-18T07:30:00Z" },
  ],
  "the brothers karamazov": [
    { id: "r13", reviewerName: "E. Andersson", content: "The Grand Inquisitor chapter is the single greatest piece of prose I have ever read. Everything else in the book exists to earn those pages.", conceptTags: ["faith", "doubt"], timestamp: "2025-12-11T14:00:00Z" },
    { id: "r14", reviewerName: "W. Torres", content: "Dostoevsky makes you love all three brothers — the sensualist, the intellectual, the saint. Then he makes you realize you're all three.", conceptTags: ["morality", "free will"], timestamp: "2026-01-20T09:45:00Z" },
  ],
  "the black swan": [
    { id: "r15", reviewerName: "H. Schmidt", content: "Taleb made me distrust every model, every forecast, every expert prediction. I'm grateful for it. The world is far more random than we're comfortable admitting.", conceptTags: ["uncertainty", "prediction"], timestamp: "2025-11-05T08:00:00Z" },
    { id: "r16", reviewerName: "Y. Park", content: "The central idea is devastating: the events that matter most are the ones we never see coming. Your entire risk model is wrong — and Taleb explains exactly why.", conceptTags: ["rare events", "fragility"], timestamp: "2025-12-19T17:00:00Z" },
  ],
  "the art of doing science and engineering": [
    { id: "r17", reviewerName: "B. Nguyen", content: "'What are the important problems in your field, and why aren't you working on them?' That question alone was worth reading the entire book. It changed my career.", conceptTags: ["thinking clearly", "problem solving"], timestamp: "2025-10-28T12:00:00Z" },
    { id: "r18", reviewerName: "F. Weber", content: "Hamming doesn't give you answers — he gives you a way of thinking about questions. The distinction matters more than I can say.", conceptTags: ["scientific method", "engineering judgment"], timestamp: "2026-01-06T10:30:00Z" },
  ],
  "the 12 week year": [
    { id: "r19", reviewerName: "I. Larsen", content: "Simple idea, massive impact. Treating 12 weeks as a 'year' creates real urgency. I accomplished more in my first 12-week cycle than in the previous six months.", conceptTags: ["execution", "planning"], timestamp: "2025-11-22T09:00:00Z" },
    { id: "r20", reviewerName: "O. Sato", content: "The framework is less important than the insight: annual planning fails because it gives you permission to procrastinate. Remove the cushion and everything changes.", conceptTags: ["goals", "accountability"], timestamp: "2025-12-15T14:00:00Z" },
  ],
  "predatory thinking": [
    { id: "r21", reviewerName: "G. Mitchell", content: "Every chapter is two pages. Every page has an idea you can steal. I've bought this book for every creative I've ever managed.", conceptTags: ["strategy", "lateral thinking"], timestamp: "2025-10-12T11:00:00Z" },
    { id: "r22", reviewerName: "V. Petrov", content: "Trott writes like the best ad copy — no wasted words, every sentence does work. The stories are from advertising but the principles apply everywhere.", conceptTags: ["creativity", "simplicity"], timestamp: "2025-12-01T16:00:00Z" },
  ],
  "peoplewatching": [
    { id: "r23", reviewerName: "A. Rossi", content: "After reading this, I watched people at a coffee shop for an hour and noticed more about human behavior than I had in the previous decade. Morris gives you the vocabulary.", conceptTags: ["body language", "social behavior"], timestamp: "2025-11-08T13:00:00Z" },
    { id: "r24", reviewerName: "Z. Ahmed", content: "Morris approaches humans the way David Attenborough approaches wildlife: with genuine curiosity, zero judgment, and a gift for making the mundane fascinating.", conceptTags: ["human nature", "nonverbal communication"], timestamp: "2025-12-22T10:00:00Z" },
  ],
  "finite and infinite games": [
    { id: "r25", reviewerName: "Q. Fischer", content: "I finished this book in two hours. I've been thinking about it for two years. The finite/infinite distinction is the most useful mental model I've ever encountered.", conceptTags: ["play", "freedom"], timestamp: "2025-10-30T15:00:00Z" },
    { id: "r26", reviewerName: "X. Liu", content: "Carse writes in aphorisms. Some land immediately. Others take weeks to unfold. This book rewards re-reading more than anything I've encountered.", conceptTags: ["boundaries", "society"], timestamp: "2026-01-18T08:00:00Z" },
  ],
  "daily rituals: how artists work": [
    { id: "r27", reviewerName: "U. Bakker", content: "The most comforting creative book I've ever read. Beethoven counted 60 coffee beans. Kafka wrote from 11pm to 3am. Everyone's process is weird. That's the point.", conceptTags: ["routine", "creative process"], timestamp: "2025-11-25T09:00:00Z" },
    { id: "r28", reviewerName: "J. Kim", content: "I bought this thinking it would give me the 'right' routine. Instead it taught me that there is no right routine — only the one you'll actually show up for.", conceptTags: ["discipline", "habits"], timestamp: "2025-12-08T12:00:00Z" },
  ],
  "crime and punishment": [
    { id: "r29", reviewerName: "T. Andersen", content: "Raskolnikov's internal monologue is the most realistic depiction of a mind destroying itself that I've ever read. You feel his guilt physically.", conceptTags: ["guilt", "morality"], timestamp: "2025-10-15T14:00:00Z" },
    { id: "r30", reviewerName: "S. Patel", content: "The genius is that Raskolnikov's theory makes sense. You understand why he did it. And then you watch understanding fail to protect him from the consequences.", conceptTags: ["redemption", "alienation"], timestamp: "2025-12-28T11:00:00Z" },
  ],
  "chop wood carry water": [
    { id: "r31", reviewerName: "D. Costa", content: "I gave this to a 16-year-old athlete and she said it changed how she approaches practice. That's all you need to know about this book.", conceptTags: ["process", "mastery"], timestamp: "2025-11-18T08:00:00Z" },
    { id: "r32", reviewerName: "M. Hassan", content: "In a world of optimization hacks, this book says: love the boring parts. The boring parts are the point. Revolutionary in its simplicity.", conceptTags: ["patience", "discipline"], timestamp: "2025-12-10T15:00:00Z" },
  ],
  "antifragile: things that gain from disorder": [
    { id: "r33", reviewerName: "R. Thompson", content: "Taleb didn't just identify a concept — he named something we all felt but couldn't articulate. 'Antifragile' is now in my vocabulary permanently.", conceptTags: ["antifragility", "volatility"], timestamp: "2025-10-25T09:00:00Z" },
    { id: "r34", reviewerName: "L. Nakamura", content: "The argument that stability creates fragility is counterintuitive and absolutely correct. Read this, then look at every system you depend on.", conceptTags: ["optionality", "via negativa"], timestamp: "2026-01-12T13:00:00Z" },
  ],
};

/** Get reviews for a book by title, injecting the runtime bookId. */
export function getReviewsForBook(
  book: { id: number; title: string },
): { id: string; bookId: number; reviewerName: string; content: string; conceptTags: string[]; timestamp: string }[] {
  const normalized = normalizeTitle(book.title);

  // Exact match first
  let reviews = reviewsByTitle[normalized];

  // Fuzzy fallback
  if (!reviews) {
    for (const [key, value] of Object.entries(reviewsByTitle)) {
      if (normalized.startsWith(key) || key.startsWith(normalized)) {
        reviews = value;
        break;
      }
    }
  }

  return reviews
    ? reviews.map((r) => ({ ...r, bookId: book.id }))
    : [];
}

const chapterSummaries: Record<number, Record<string, string>> = {
  1: {
    ch1: "In Chapter I, Nick Carraway introduces himself as the narrator and establishes his background. He moves to West Egg, Long Island, and visits his cousin Daisy Buchanan and her husband Tom. The chapter introduces the mysterious Jay Gatsby, Nick's neighbor, who is seen reaching toward a green light across the bay.",
    ch2: "Chapter II introduces the Valley of Ashes, a desolate wasteland between West Egg and New York City, watched over by the eyes of Doctor T.J. Eckleburg. Tom takes Nick to meet his mistress, Myrtle Wilson, and they spend a raucous afternoon in a New York apartment.",
    ch3: "Chapter III describes one of Gatsby's legendary parties. Nick attends and observes the extravagance and rumors surrounding his mysterious host. He finally meets Gatsby himself, who is surprisingly young and has an enigmatic smile.",
  },
  2: {
    ch1: "Part One, Chapter 1 introduces Winston Smith and the dystopian world of Oceania. We learn about Big Brother, the Thought Police, and the oppressive surveillance state. Winston begins his secret diary, committing his first act of rebellion against the Party.",
    ch2: "Winston visits his neighbor Parsons and encounters the fanatical children of the Party. The chapter reveals how deeply the Party's ideology has penetrated family life, with children serving as informants against their own parents.",
    ch3: "Winston dreams of his mother and sister, remembering their sacrifice. He also dreams of a pastoral landscape called the Golden Country. The chapter explores memory, guilt, and the Party's systematic destruction of the past.",
  },
  3: {
    ch1: "The novel opens with one of literature's most famous lines about wealthy men and marriage. Mrs. Bennet is eager to introduce her daughters to Mr. Bingley, the new tenant of Netherfield Park, and pressures Mr. Bennet to visit him.",
    ch2: "Mr. Bennet reveals he has already visited Bingley, delighting his family. The chapter showcases the Bennet family dynamics and the social customs of Regency-era England regarding courtship and introductions.",
  },
  4: {
    ch1: "Sun Tzu establishes the five fundamental factors of warfare: moral influence, weather, terrain, command, and doctrine. He argues that war is a matter of vital importance that must be studied thoroughly, and that victory can be predicted through careful calculation.",
    ch2: "This chapter addresses the economic costs of warfare, arguing that prolonged campaigns drain a nation's resources. Sun Tzu advocates for swift, decisive action and the importance of living off the enemy's resources.",
  },
};

const themeResponses: Record<number, string> = {
  1: "The Great Gatsby explores several interconnected themes: the corruption of the American Dream, the hollowness of the upper class, the impossibility of recapturing the past, and the moral decay hidden beneath surface glamour. Gatsby's relentless pursuit of Daisy represents the broader American obsession with wealth and status as proxies for happiness.",
  2: "1984's central themes include the dangers of totalitarianism, the manipulation of truth and history, the destruction of individual identity, and the power of language to shape thought. Orwell warns that unchecked political power, combined with technology, can create a society where even private thought becomes impossible.",
  3: "Pride and Prejudice explores themes of love versus social expectation, the danger of first impressions, class consciousness, and the growth that comes from self-reflection. Both Elizabeth and Darcy must overcome their titular flaws to find genuine connection.",
  4: "The Art of War's key themes include the importance of strategic thinking over brute force, the value of intelligence and deception, adaptability in the face of changing circumstances, and the understanding that the supreme art of war is to subdue the enemy without fighting.",
};

const argueResponses: Record<number, string[]> = {
  1: [
    "Gatsby isn't a romantic hero — he's a stalker with resources. His obsession with Daisy isn't love; it's a refusal to accept reality. The book romanticizes what is essentially a man who cannot let go.",
    "The American Dream critique is overstated. Gatsby's failure isn't because the Dream is hollow — it's because he pursued a person instead of a purpose. The Dream works for those who don't confuse it with nostalgia.",
  ],
  2: [
    "Orwell's vision is too neat. Real authoritarianism doesn't announce itself with telescreens and Thought Police. It arrives as convenience, entertainment, and algorithmic curation. Huxley was closer to the mark.",
    "Winston is a weak protagonist by design, but this undercuts the book's message. If resistance is always futile, why resist? The book offers no path forward — only despair.",
  ],
  3: [
    "Austen's world is hermetically sealed. The Bennet family's problems exist only because of their class position, and the solutions are all marriages. This isn't social criticism — it's social reproduction.",
    "Elizabeth's 'independence' is overstated. She rejects Collins and initially rejects Darcy, but ultimately she chooses the wealthiest man available. Her rebellion has very clear limits.",
  ],
  4: [
    "The Art of War is dangerously reductive. Reducing all conflict to strategy ignores the moral dimension of warfare. Sun Tzu treats people as pieces on a board — there's no ethics here.",
    "Much of this book is common sense dressed in aphorism. 'Know your enemy' isn't profound — it's obvious. The book's reputation exceeds its actual content.",
  ],
  5: [
    "Victor Frankenstein is sympathetic in ways the modern reading ignores. He was a young man who made a mistake and spent the rest of his life paying for it. The creature's violence is not justified by his suffering.",
    "The novel's structure — letters within letters within stories — creates so much distance from events that the emotional impact is dulled. Shelley tells us about horror rather than showing it.",
  ],
  6: [
    "Marcus Aurelius had the luxury of philosophical detachment because he was emperor. Stoicism is easy when you have absolute power. Try practicing acceptance when you have no agency at all.",
    "The Meditations are repetitive by nature — he's working through the same problems repeatedly. This is honest but makes for a book that says the same thing in slightly different ways for 200 pages.",
  ],
};

const counterpointResponses: Record<number, string[]> = {
  1: [
    "A Marxist reading would say Gatsby isn't about the American Dream at all — it's about how capital creates and destroys identity. Gatsby is a commodity who doesn't realize he's been consumed by the system that produced him.",
    "Some scholars argue Nick is the unreliable narrator, and Gatsby is actually less extraordinary than Nick's telling suggests. The real story is Nick's seduction by wealth, not Gatsby's.",
  ],
  2: [
    "Postcolonial critics note that Orwell's anti-totalitarian stance coexists uneasily with his own imperial background. 1984 critiques state power but doesn't interrogate the British Empire that shaped Orwell's worldview.",
    "Neil Postman argued in 'Amusing Ourselves to Death' that Huxley's Brave New World is more prophetic — we weren't conquered by what we fear but by what we desire. Surveillance is voluntary now.",
  ],
  3: [
    "Feminist critics have long debated whether Austen reinforces or subverts patriarchal marriage. The ending seems conservative, but Austen's irony makes it unclear whether she endorses or merely depicts the system.",
    "A modern economist might note that the Bennets' situation is really about inheritance law and primogeniture. The 'romance' is a veneer over a property transaction.",
  ],
  4: [
    "Clausewitz would counter that Sun Tzu ignores the fog of war — the chaos and friction that make strategic planning insufficient. Real warfare is messier than any treatise allows.",
    "Some scholars question whether Sun Tzu was a single historical person at all. The text may be a compilation of military wisdom from multiple strategists over centuries.",
  ],
  5: [
    "Feminist readings emphasize that Shelley — a woman in the early 19th century — wrote about male ambition and its consequences. The novel is as much about patriarchal science as it is about creation.",
    "Disability studies scholars read the creature's rejection as a metaphor for how society treats bodies that don't conform. His eloquence is irrelevant because his appearance determines his fate.",
  ],
  6: [
    "Buddhist scholars note that Stoicism and Buddhism arrived at similar conclusions about impermanence independently. The difference: Stoicism emphasizes duty while Buddhism emphasizes compassion. Is Marcus missing something?",
    "Some historians argue the Meditations should be read alongside Aurelius's actual policies — including persecution of Christians. Philosophy and practice diverged in ways he may not have acknowledged.",
  ],
};

const sessionSummaryTemplates = [
  "You spent {duration} minutes reading and encountered ideas about {concepts}. The pages you covered touched on themes that connect to your broader reading pattern.",
  "This session covered {pages} pages in {duration} minutes. Key concepts: {concepts}. These ideas build on themes you've been exploring across your library.",
  "A {duration}-minute session yielding {pages} pages of material. The dominant ideas — {concepts} — suggest a deepening engagement with this text's core arguments.",
];

export function getSessionSummary(durationMinutes: number, pagesRead: number, concepts: string[]): string {
  const template = sessionSummaryTemplates[Math.floor(Math.random() * sessionSummaryTemplates.length)];
  return template
    .replace("{duration}", String(durationMinutes))
    .replace("{pages}", String(pagesRead))
    .replace(/\{concepts\}/g, concepts.join(", "));
}

const fallbackResponses = [
  "That's an interesting question about this text. The author's approach here reflects broader themes of the work — the tension between individual desire and societal expectation, and how characters navigate moral complexity.",
  "Looking at this passage in context, we can see how the author builds meaning through careful word choice and structure. The narrative voice shapes our understanding of events in subtle ways.",
  "This is a thought-provoking question. The text operates on multiple levels — the surface narrative, the symbolic undertones, and the historical context in which it was written all contribute to its meaning.",
];

export function getAiResponse(bookId: number, message: string, mode?: string): string {
  const lowerMessage = message.toLowerCase();

  // Mode-specific responses
  if (mode === "argue" || lowerMessage.includes("devil") || lowerMessage.includes("challenge")) {
    const responses = argueResponses[bookId];
    if (responses) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  if (mode === "counterpoints" || lowerMessage.includes("critic") || lowerMessage.includes("alternative")) {
    const responses = counterpointResponses[bookId];
    if (responses) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Check for chapter summary requests
  if (lowerMessage.includes("summarize") || lowerMessage.includes("takeaway") || lowerMessage.includes("key")) {
    const summaries = chapterSummaries[bookId];
    if (summaries) {
      for (const [chId, summary] of Object.entries(summaries)) {
        if (lowerMessage.includes(chId)) {
          return summary;
        }
      }
      const firstKey = Object.keys(summaries)[0];
      return summaries[firstKey];
    }
  }

  // Check for theme requests
  if (
    lowerMessage.includes("theme") ||
    lowerMessage.includes("meaning") ||
    lowerMessage.includes("about") ||
    lowerMessage.includes("explain")
  ) {
    if (themeResponses[bookId]) {
      return themeResponses[bookId];
    }
  }

  // Define key terms
  if (lowerMessage.includes("define") || lowerMessage.includes("term")) {
    return "Key terms in this passage reflect the author's broader philosophical framework. The vocabulary choices aren't accidental — they signal membership in a specific intellectual tradition and invite readers to engage with that tradition's assumptions.";
  }

  // Fallback
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

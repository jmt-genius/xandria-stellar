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

const fallbackResponses = [
  "That's an interesting question about this text. The author's approach here reflects broader themes of the work — the tension between individual desire and societal expectation, and how characters navigate moral complexity.",
  "Looking at this passage in context, we can see how the author builds meaning through careful word choice and structure. The narrative voice shapes our understanding of events in subtle ways.",
  "This is a thought-provoking question. The text operates on multiple levels — the surface narrative, the symbolic undertones, and the historical context in which it was written all contribute to its meaning.",
];

export function getAiResponse(bookId: number, message: string): string {
  const lowerMessage = message.toLowerCase();

  // Check for chapter summary requests
  if (lowerMessage.includes("summarize")) {
    const summaries = chapterSummaries[bookId];
    if (summaries) {
      // Try to match chapter
      for (const [chId, summary] of Object.entries(summaries)) {
        if (lowerMessage.includes(chId)) {
          return summary;
        }
      }
      // Return first chapter summary as default
      const firstKey = Object.keys(summaries)[0];
      return summaries[firstKey];
    }
  }

  // Check for theme requests
  if (
    lowerMessage.includes("theme") ||
    lowerMessage.includes("meaning") ||
    lowerMessage.includes("about")
  ) {
    if (themeResponses[bookId]) {
      return themeResponses[bookId];
    }
  }

  // Fallback
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

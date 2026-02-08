import { normalizeTitle } from "@/lib/book-helpers";

export type AuthorData = {
  id: string;
  address: string;
  name: string;
  bio: string;
  fields: string[];
  bookTitles: string[];
};

export const authors: AuthorData[] = [
  {
    id: "author-meadows",
    address: "GCXG2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Donella H. Meadows",
    bio: "Environmental scientist, educator, and lead author of The Limits to Growth. Meadows spent her career making systems thinking accessible to policy makers and ordinary people, teaching at Dartmouth and founding the Sustainability Institute. She saw the world in feedback loops — and taught others to do the same.",
    fields: ["Systems Thinking", "Environmental Science", "Policy"],
    bookTitles: ["thinking in systems"],
  },
  {
    id: "author-pirsig",
    address: "GBXH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Robert M. Pirsig",
    bio: "American writer and philosopher whose Zen and the Art of Motorcycle Maintenance was rejected by 121 publishers before becoming one of the best-selling philosophy books ever written. Pirsig spent the rest of his life exploring the 'Metaphysics of Quality' — the idea that quality is not subjective, not objective, but the foundation of both.",
    fields: ["Philosophy", "American Literature", "Motorcycle Maintenance"],
    bookTitles: ["zen and the art of motorcycle maintenance"],
  },
  {
    id: "author-qntm",
    address: "GCYH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "qntm",
    bio: "Sam Hughes, writing as qntm, is a British author and software developer known for experimental fiction published online. His work on the SCP Foundation wiki — particularly the Antimemetics Division series — became a cult phenomenon, exploring the terrifying idea of information that resists being known.",
    fields: ["Science Fiction", "Web Fiction", "Information Theory"],
    bookTitles: ["there is no antimemetics division"],
  },
  {
    id: "author-kim",
    address: "GDZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Tae Kim",
    bio: "Technology journalist and author who spent years reporting on Nvidia and the semiconductor industry. Kim's meticulous reporting on Jensen Huang's leadership style and Nvidia's strategic evolution produced the definitive account of how a graphics card company became the most important technology company of the AI era.",
    fields: ["Technology Journalism", "Business", "Semiconductors"],
    bookTitles: ["the nvidia way: jensen huang and the making of a tech giant"],
  },
  {
    id: "author-rubin",
    address: "GEZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Rick Rubin",
    bio: "Legendary music producer who co-founded Def Jam Recordings and has worked with artists from the Beastie Boys to Johnny Cash to Adele. Rubin is known for his minimalist production philosophy and his ability to draw out an artist's most authentic work. His approach to creativity — presence, attention, letting go — is itself a form of art.",
    fields: ["Music Production", "Creativity", "Philosophy"],
    bookTitles: ["the creative act: a way of being"],
  },
  {
    id: "author-dumas",
    address: "GFZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Alexandre Dumas",
    bio: "French author of historical adventure novels, including The Three Musketeers and The Count of Monte Cristo. Dumas was one of the most widely read French authors and one of the most prolific, producing over 100,000 pages in his lifetime. His grandmother was a Haitian slave — a fact he never hid in an era that demanded it.",
    fields: ["Historical Fiction", "Adventure", "Drama"],
    bookTitles: ["the count of monte cristo"],
  },
  {
    id: "author-dostoevsky",
    address: "GGZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Fyodor Dostoevsky",
    bio: "Russian novelist, philosopher, and journalist. Sentenced to death for revolutionary activities, his sentence was commuted at the last moment to hard labor in Siberia. That experience of facing death — and the years of suffering that followed — shaped the most psychologically penetrating fiction ever written. Dostoevsky understood guilt, faith, and madness from the inside.",
    fields: ["Russian Literature", "Philosophy", "Psychology"],
    bookTitles: ["the brothers karamazov", "crime and punishment"],
  },
  {
    id: "author-taleb",
    address: "GHZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Nassim Nicholas Taleb",
    bio: "Lebanese-American essayist, mathematical statistician, former options trader, and risk analyst. Taleb's Incerto series — The Black Swan, Antifragile, Skin in the Game — is a multi-volume investigation of uncertainty, randomness, and what it means to live in a world we fundamentally do not understand. He writes like he trades: with conviction and contempt for the conventional.",
    fields: ["Risk", "Epistemology", "Mathematical Finance"],
    bookTitles: ["the black swan", "antifragile: things that gain from disorder"],
  },
  {
    id: "author-hamming",
    address: "GJZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Richard Hamming",
    bio: "American mathematician and computer scientist who spent three decades at Bell Labs. Inventor of Hamming codes, contributor to the Manhattan Project, and Turing Award recipient. But his most lasting contribution may be a simple question he asked colleagues over lunch: 'What are the important problems in your field, and why aren't you working on them?'",
    fields: ["Computer Science", "Mathematics", "Engineering"],
    bookTitles: ["the art of doing science and engineering"],
  },
  {
    id: "author-moran",
    address: "GKZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Brian P. Moran",
    bio: "Executive coach, consultant, and founder of The Execution Company. Moran spent decades studying why smart people with clear goals still fail to execute — and built a system around the insight that annual planning is the enemy of consistent action. His 12 Week Year framework is used by Fortune 500 companies and solo entrepreneurs alike.",
    fields: ["Productivity", "Executive Coaching", "Business Strategy"],
    bookTitles: ["the 12 week year"],
  },
  {
    id: "author-trott",
    address: "GLZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Dave Trott",
    bio: "One of the most awarded advertising creatives in the UK, founder of agencies GGT and CST. Trott's approach to advertising — and to thinking in general — is ruthlessly simple: get upstream of the problem, then find the angle no one else sees. His books read like the best kind of pub conversation: fast, funny, and immediately useful.",
    fields: ["Advertising", "Creative Strategy", "Copywriting"],
    bookTitles: ["predatory thinking"],
  },
  {
    id: "author-morris",
    address: "GMZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Desmond Morris",
    bio: "British zoologist, ethologist, and surrealist painter. Morris became famous for The Naked Ape, which applied animal behavior research to humans. His approach was radical: study humans the way you'd study any other primate — with a clipboard, patience, and no sentimentality. The results were both humbling and illuminating.",
    fields: ["Zoology", "Human Behavior", "Ethology"],
    bookTitles: ["peoplewatching"],
  },
  {
    id: "author-carse",
    address: "GNZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "James P. Carse",
    bio: "Professor of religion at New York University for thirty years. Carse wrote Finite and Infinite Games in 1986 as a philosophical meditation on human activity. The book defies genre — it's philosophy, game theory, theology, and poetry compressed into 150 pages. It went on to influence thinkers from Simon Sinek to Kevin Kelly.",
    fields: ["Philosophy", "Religion", "Game Theory"],
    bookTitles: ["finite and infinite games"],
  },
  {
    id: "author-currey",
    address: "GPZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Mason Currey",
    bio: "American journalist and author who spent years researching the daily routines of creative people. What began as a blog became Daily Rituals — a catalog of 161 artists, writers, composers, and scientists and how they structured their days. Currey found that there is no single right way to work, but that routine itself is the common thread.",
    fields: ["Journalism", "Creative Process", "Biography"],
    bookTitles: ["daily rituals: how artists work"],
  },
  {
    id: "author-medcalf",
    address: "GQZH2FZFQNP3RVISN7IRDS5MQXPZ6XWBKZFQKH7SNFQWEV3JC7DIAZU",
    name: "Joshua Medcalf",
    bio: "Performance coach, speaker, and author who works with professional athletes, Fortune 500 executives, and military leaders. Medcalf's philosophy is simple but countercultural: stop chasing results, fall in love with the process. His parable-style writing makes ancient wisdom feel urgent and personal.",
    fields: ["Performance Coaching", "Mindset", "Leadership"],
    bookTitles: ["chop wood carry water"],
  },
];

/** Find the author who wrote a given book (by title). */
export function getAuthorForBook(
  book: { title: string },
): AuthorData | undefined {
  const normalized = normalizeTitle(book.title);
  return authors.find((a) =>
    a.bookTitles.some(
      (t) =>
        normalizeTitle(t) === normalized ||
        normalized.startsWith(normalizeTitle(t)) ||
        normalizeTitle(t).startsWith(normalized),
    ),
  );
}

/** Find an author by their ID (for the author profile page). */
export function getAuthorById(id: string): AuthorData | undefined {
  return authors.find((a) => a.id === id);
}

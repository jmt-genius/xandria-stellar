import type { Chapter } from "@/types";

type BookEnrichment = {
  description: string;
  rating: number;
  votes: number;
  genre: string;
  chapters: Chapter[];
  aiSummary: string;
};

export const bookEnrichment: Record<number, BookEnrichment> = {
  // Hardcoded books commented out to prioritize blockchain data
  /*
  1: {
    description:
      "A portrait of the Jazz Age in all of its decadence and excess, Gatsby captured a moment in American history.",
    rating: 4.5,
    votes: 1247,
    genre: "Classic Fiction",
    aiSummary:
      "A cautionary tale about the American Dream, exploring themes of wealth, class, love, and idealism through the tragic figure of Jay Gatsby.",
    chapters: [
      {
        id: "ch1",
        title: "Chapter I",
        content: [
          "<p>In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.</p><p>\"Whenever you feel like criticizing anyone,\" he told me, \"just remember that all the people in this world haven't had the advantages that you've had.\"</p><p>He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.</p>",
          "<p>And, after boasting this way of my tolerance, I come to the admission that it has a limit. Conduct may be founded on the hard rock or the wet marshes, but after a certain point I don't care what it's founded on.</p><p>When I came back from the East last autumn I felt that I wanted the world to be in uniform and at a sort of moral attention forever; I wanted no more riotous excursions with privileged glimpses into the human heart.</p>",
          "<p>My family have been prominent, well-to-do people in this Middle Western city for three generations. The Carraways are something of a clan, and we have a tradition that we're descended from the Dukes of Buccleuch, but the actual founder of my line was my grandfather's brother, who came here in fifty-one.</p>",
        ],
      },
      {
        id: "ch2",
        title: "Chapter II",
        content: [
          "<p>About half way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land.</p><p>This is a valley of ashes — a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens.</p>",
          "<p>The valley of ashes is bounded on one side by a small foul river, and, when the drawbridge is up to let barges through, the passengers on waiting trains can stare at the dismal scene for as long as half an hour.</p>",
        ],
      },
      {
        id: "ch3",
        title: "Chapter III",
        content: [
          "<p>There was music from my neighbor's house through the summer nights. In his blue gardens men and girls came and went like moths among the whisperings and the champagne and the stars.</p><p>At high tide in the afternoon I watched his guests diving from the tower of his raft, or taking the sun on the hot sand of his beach while his two motor-boats slit the waters of the Sound.</p>",
          "<p>I believe that on the first night I went to Gatsby's house I was one of the few guests who had actually been invited. People were not invited — they went there.</p>",
        ],
      },
    ],
  },
  2: {
    description:
      "A dystopian social science fiction novel that has become one of the most influential books ever written.",
    rating: 4.8,
    votes: 2341,
    genre: "Dystopian",
    aiSummary:
      "Orwell's masterpiece explores totalitarianism, mass surveillance, and the manipulation of truth in a society where Big Brother watches all.",
    chapters: [
      {
        id: "ch1",
        title: "Part One: Chapter 1",
        content: [
          "<p>It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.</p>",
          "<p>The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features.</p><p>BIG BROTHER IS WATCHING YOU, the caption beneath it ran.</p>",
          "<p>Inside the flat a fruity voice was reading out a list of figures which had something to do with the production of pig-iron. The voice came from an oblong metal plaque like a dulled mirror which formed part of the surface of the right-hand wall. The instrument (the telescreen, it was called) could be dimmed, but there was no way of shutting it off completely.</p>",
        ],
      },
      {
        id: "ch2",
        title: "Part One: Chapter 2",
        content: [
          "<p>As he put his hand to the door-knob Winston saw that he had left the diary open on the table. DOWN WITH BIG BROTHER was written all over it, in letters almost big enough to be legible across the room.</p><p>It was an inconceivably stupid thing to have done. But, he realized, even though he had written it, he had not abandoned the idea of tearing out the spoiled pages and abandoning the enterprise.</p>",
          "<p>There was a trampling of boots and another blast on the comb as the children charged into the living-room. Mrs Parsons brought the spanner. Winston let the water out of the pipe and removed the clot of human hair that had blocked it; he cleaned his fingers and went back across the hall.</p>",
        ],
      },
      {
        id: "ch3",
        title: "Part One: Chapter 3",
        content: [
          "<p>Winston was dreaming of his mother. He must, he thought, have been ten or eleven years old when his mother had disappeared. She was a tall, statuesque, rather silent woman with slow movements and magnificent fair hair.</p>",
          "<p>He could not remember what had happened, but he knew in his dream that in some way the lives of his mother and his sister had been sacrificed to his own. It was one of those dreams which, while retaining the characteristic dream scenery, are a continuation of one's intellectual life.</p>",
        ],
      },
    ],
  },
  3: {
    description:
      "A witty comedy of manners that explores love, reputation, and class in Regency-era England.",
    rating: 4.6,
    votes: 1893,
    genre: "Romance",
    aiSummary:
      "Austen's beloved novel follows Elizabeth Bennet and Mr. Darcy through misunderstandings and social barriers toward mutual understanding and love.",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1",
        content: [
          "<p>It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p><p>However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.</p>",
          "<p>\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"</p><p>Mr. Bennet replied that he had not.</p><p>\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\"</p>",
        ],
      },
      {
        id: "ch2",
        title: "Chapter 2",
        content: [
          "<p>Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go.</p>",
          "<p>\"I do not believe Mrs. Long will do any such thing. She has two nieces of her own. She is a selfish, hypocritical woman, and I have no opinion of her.\"</p>",
        ],
      },
    ],
  },
  4: {
    description:
      "The most influential treatise on military strategy ever written, still studied by leaders worldwide.",
    rating: 4.3,
    votes: 967,
    genre: "Philosophy",
    aiSummary:
      "Sun Tzu's ancient masterwork on military strategy reveals timeless principles of leadership, deception, and the nature of conflict.",
    chapters: [
      {
        id: "ch1",
        title: "Laying Plans",
        content: [
          "<p>Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.</p>",
          "<p>The art of war, then, is governed by five constant factors, to be taken into account in one's deliberations. These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.</p>",
        ],
      },
      {
        id: "ch2",
        title: "Waging War",
        content: [
          "<p>Sun Tzu said: In the operations of war, where there are in the field a thousand swift chariots, as many heavy chariots, and a hundred thousand mail-clad soldiers, with provisions enough to carry them a thousand li, the expenditure at home and at the front will reach the total of a thousand ounces of silver per day.</p>",
        ],
      },
    ],
  },
  5: {
    description:
      "The story of Victor Frankenstein and his creation explores ambition, isolation, and what it means to be human.",
    rating: 4.4,
    votes: 1156,
    genre: "Horror",
    aiSummary:
      "Shelley's gothic masterpiece questions the ethics of creation, the consequences of unchecked ambition, and the nature of monstrosity.",
    chapters: [
      {
        id: "ch1",
        title: "Letter I",
        content: [
          "<p>You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.</p>",
          "<p>I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight.</p>",
        ],
      },
      {
        id: "ch2",
        title: "Chapter 1",
        content: [
          "<p>I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation.</p>",
        ],
      },
    ],
  },
  6: {
    description:
      "A series of personal writings by the Roman Emperor, offering profound Stoic wisdom on life, death, and duty.",
    rating: 4.7,
    votes: 1432,
    genre: "Philosophy",
    aiSummary:
      "Marcus Aurelius' private journal reveals the inner thoughts of a philosopher-king, teaching acceptance, duty, and the impermanence of all things.",
    chapters: [
      {
        id: "ch1",
        title: "Book One",
        content: [
          "<p>From my grandfather Verus I learned good morals and the government of my temper. From the reputation and remembrance of my father, modesty and a manly character.</p>",
          "<p>From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.</p>",
        ],
      },
      {
        id: "ch2",
        title: "Book Two",
        content: [
          "<p>Begin the morning by saying to thyself, I shall meet with the busybody, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil.</p>",
        ],
      },
    ],
  },
  */
};

export const allGenres = [
  "All",
  "Classic Fiction",
  "Dystopian",
  "Romance",
  "Philosophy",
  "Horror",
  "Adventure",
  "Fantasy",
  "Political Philosophy",
];

export type Comment = {
  author: string;
  initials: string;
  when: string;
  text: string;
};

export const currentUser = {
  name: "Your Name",
  username: "yourname",
  bio: "Add a short bio so readers know who you are.",
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  role: string;
  date: string;
  readMinutes: number;
  tags: string[];
  votes: number;
  body: string[];
  comments: Comment[];
};

export const articles: Article[] = [
  {
    slug: "row-level-security-refactor",
    title: "Row-level security policies that survive a refactor",
    excerpt:
      "How to name, test and review policies so a schema change doesn't quietly open a hole.",
    author: "Nadia Perera",
    initials: "NP",
    role: "Backend engineer",
    date: "Oct 16",
    readMinutes: 9,
    tags: ["Postgres", "Security"],
    votes: 214,
    body: [
      "Policies are code that lives in your database, and they deserve the same care as any other code: clear names, tests and review.",
      "Name each policy after the rule it enforces, not the table it sits on. When a table is renamed or split, the rule still reads correctly.",
      "Write one test per policy that connects as a normal user and tries to read or change someone else's row. If that test passes, the policy is wrong.",
    ],
    comments: [
      {
        author: "Kavindu Silva",
        initials: "KS",
        when: "Yesterday",
        text: "The naming tip alone saved us a long review. Would love a follow-up on testing with seed data.",
      },
    ],
  },
  {
    slug: "full-text-search-postgres",
    title: "Full-text search without running a search cluster",
    excerpt:
      "A generated tsvector column and a GIN index cover most small platforms.",
    author: "Kavindu Silva",
    initials: "KS",
    role: "Full-stack developer",
    date: "Oct 14",
    readMinutes: 7,
    tags: ["Search", "Supabase"],
    votes: 168,
    body: [
      "Most small platforms don't need a dedicated search service. Postgres ships with a capable text search engine that can live in the same table as your content.",
      "Add a generated column that combines the title and body, then index it with GIN. The database keeps it in sync, so there is no job to run.",
      "Typo tolerance and heavy faceting are where this strains. Until readers ask for them, the simple version is faster to build and easier to run.",
    ],
    comments: [
      {
        author: "Nadia Perera",
        initials: "NP",
        when: "2 days ago",
        text: "A weighted vector lets titles outrank body matches. Small change, much better results.",
      },
      {
        author: "Ishara Fernando",
        initials: "IF",
        when: "Yesterday",
        text: "Does this hold up at a few hundred thousand rows? I'd like to see index size next to table size.",
      },
    ],
  },
  {
    slug: "esp32-sensor-node-lessons",
    title: "Lessons from shipping a battery-powered ESP32 sensor node",
    excerpt:
      "Deep sleep budgets, brown-out resets and over-the-air updates.",
    author: "Ishara Fernando",
    initials: "IF",
    role: "Embedded engineer",
    date: "Oct 12",
    readMinutes: 11,
    tags: ["Embedded", "Hardware"],
    votes: 131,
    body: [
      "Battery life is decided long before the firmware is finished. Measure the sleep current on real hardware early, with the radio and sensors attached.",
      "Brown-out resets look like random crashes. Log the reset reason on every boot and the pattern shows up quickly.",
      "Plan over-the-air updates from the first prototype. A node you can't update is a node you'll eventually have to drive to.",
    ],
    comments: [],
  },
  {
    slug: "streaming-ai-nextjs",
    title: "Streaming model output in Next.js without dropping tokens",
    excerpt:
      "A small pattern that keeps long responses smooth and recovers when the connection drops.",
    author: "Tharindu Jayasinghe",
    initials: "TJ",
    role: "ML engineer",
    date: "Oct 9",
    readMinutes: 8,
    tags: ["Next.js", "AI"],
    votes: 97,
    body: [
      "Return a streaming response from a route handler and read it on the client chunk by chunk. Keep the parsing separate from the rendering.",
      "Buffer partial lines before parsing, because a chunk boundary can land in the middle of a message.",
      "On a dropped connection, keep what you have and offer to continue instead of starting over.",
    ],
    comments: [],
  },
  {
    slug: "documentation-people-read",
    title: "Writing documentation people actually read",
    excerpt:
      "Lead with the task, show the shortest working example, then explain.",
    author: "Maya Dissanayake",
    initials: "MD",
    role: "Technical writer",
    date: "Oct 6",
    readMinutes: 6,
    tags: ["Writing", "Docs"],
    votes: 76,
    body: [
      "Readers arrive with a task, not a curiosity. Put the task in the title and the shortest working example directly under it.",
      "Explain after the example, not before. People who need the explanation will keep reading; everyone else is already done.",
      "Add a short checklist to your pull request template: does it start with the task, does it run, does it link onward?",
    ],
    comments: [],
  },
];

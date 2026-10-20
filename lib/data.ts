export type Comment = {
  id?: string;
  authorId?: string;
  author: string;
  initials: string;
  when: string;
  text: string;
};

export type Article = {
  id?: string;
  slug: string;
  authorId?: string;
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
  commentCount?: number;
};
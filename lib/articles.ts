import { supabase } from "@/lib/supabase";
import type { Article, Comment } from "@/lib/data";
import { initialsOf } from "@/lib/utils";

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  author_id: string | null;
  author_name: string;
  votes: number;
  created_at: string;
};

type CommentRow = {
  id: string;
  author_id: string | null;
  author_name: string;
  body: string;
  created_at: string;
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en", { month: "short", day: "numeric" });

function commentFromRow(c: CommentRow): Comment {
  return {
    id: c.id,
    authorId: c.author_id ?? undefined,
    author: c.author_name,
    initials: initialsOf(c.author_name),
    when: shortDate(c.created_at),
    text: c.body,
  };
}

function fromRow(
  r: Row,
  extra: { position?: string; comments?: Comment[]; commentCount?: number } = {}
): Article {
  const words = r.body.split(/\s+/).filter(Boolean).length;
  const comments = extra.comments ?? [];
  return {
    id: r.id,
    slug: r.slug,
    authorId: r.author_id ?? undefined,
    title: r.title,
    excerpt: r.excerpt,
    author: r.author_name,
    initials: initialsOf(r.author_name),
    role: extra.position || "Contributor",
    date: shortDate(r.created_at),
    readMinutes: Math.max(1, Math.round(words / 200)),
    tags: r.tags ?? [],
    votes: r.votes,
    body: r.body.split(/\n{2,}/).filter(Boolean),
    comments,
    commentCount: extra.commentCount ?? comments.length,
  };
}

// Current position of each author, from the profiles table (one query).
async function positionsFor(authorIds: (string | null)[]) {
  const positions = new Map<string, string>();
  const ids = [...new Set(authorIds.filter((id): id is string => !!id))];
  if (!supabase || ids.length === 0) return positions;

  const { data } = await supabase.from("profiles").select("id,position").in("id", ids);
  for (const p of data ?? []) positions.set(p.id, p.position ?? "");
  return positions;
}

// Number of comments per article (one query).
async function commentCountsFor(articleIds: string[]) {
  const counts = new Map<string, number>();
  if (!supabase || articleIds.length === 0) return counts;

  const { data } = await supabase.from("comments").select("article_id").in("article_id", articleIds);
  for (const c of data ?? []) counts.set(c.article_id, (counts.get(c.article_id) ?? 0) + 1);
  return counts;
}

export async function getArticles(): Promise<Article[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];

    const rows = data as Row[];
    const [positions, counts] = await Promise.all([
      positionsFor(rows.map((r) => r.author_id)),
      commentCountsFor(rows.map((r) => r.id)),
    ]);
    return rows.map((r) =>
      fromRow(r, {
        position: positions.get(r.author_id ?? "") ?? "",
        commentCount: counts.get(r.id) ?? 0,
      })
    );
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  if (!supabase) return undefined;
  try {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return undefined;

    const row = data as Row;
    const [positions, { data: commentRows }] = await Promise.all([
      positionsFor([row.author_id]),
      supabase
        .from("comments")
        .select("*")
        .eq("article_id", row.id)
        .order("created_at", { ascending: true }),
    ]);
    return fromRow(row, {
      position: positions.get(row.author_id ?? "") ?? "",
      comments: ((commentRows ?? []) as CommentRow[]).map(commentFromRow),
    });
  } catch {
    return undefined;
  }
}
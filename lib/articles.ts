import { supabase } from "@/lib/supabase";
import { articles as sample, type Article } from "@/lib/data";

type Row = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  author_name: string;
  votes: number;
  created_at: string;
};

function fromRow(r: Row): Article {
  const words = r.body.split(/\s+/).filter(Boolean).length;
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    author: r.author_name,
    initials:
      r.author_name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("") || "?",
    role: "Contributor",
    date: new Date(r.created_at).toLocaleDateString("en", { month: "short", day: "numeric" }),
    readMinutes: Math.max(1, Math.round(words / 200)),
    tags: r.tags ?? [],
    votes: r.votes,
    body: r.body.split(/\n{2,}/).filter(Boolean),
    comments: [],
  };
}

// Database articles first, then the sample articles.
export async function getArticles(): Promise<Article[]> {
  if (!supabase) return sample;
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return sample;
    return [...(data as Row[]).map(fromRow), ...sample];
  } catch {
    return sample;
  }
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  if (supabase) {
    try {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (data) return fromRow(data as Row);
    } catch {
      // fall through to sample data
    }
  }
  return sample.find((a) => a.slug === slug);
}
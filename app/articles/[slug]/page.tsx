import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VoteButton } from "@/components/vote-button";
import { articles } from "@/lib/data";
import { getArticle } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default function ArticlePage(props: PageProps<"/articles/[slug]">) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-8">
          <div className="h-8 w-2/3 animate-pulse rounded-md bg-muted" />
        </main>
      }
    >
      <ArticleContent params={props.params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <h1 className="font-serif text-3xl font-semibold">Article not found</h1>
        <Button asChild variant="outline">
          <Link href="/">Back to articles</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/">
          <ArrowLeft /> All articles
        </Link>
      </Button>

      <article className="space-y-6">
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <Badge key={t} variant="tag">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Avatar>
              <AvatarFallback>{article.initials}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{article.author}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {article.role} · {article.date} · <Clock className="size-3.5" aria-hidden="true" />
                {article.readMinutes} min
              </div>
            </div>
            <div className="ml-auto">
              <VoteButton initial={article.votes} />
            </div>
          </div>
        </header>

        <div className="space-y-4 text-lg leading-8">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      <section aria-labelledby="discussion" className="space-y-4 border-t pt-8">
        <h2 id="discussion" className="font-serif text-2xl font-semibold">
          Discussion
        </h2>
        {article.comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
        {article.comments.map((c, i) => (
          <Card key={i} className="py-4">
            <CardContent className="flex gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="text-xs">{c.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium">{c.author}</span>{" "}
                  <span className="text-muted-foreground">· {c.when}</span>
                </div>
                <p>{c.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
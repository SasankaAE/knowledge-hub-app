import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

import { Discussion } from "@/components/discussion";
import { EditArticleButton } from "@/components/edit-article-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoteButton } from "@/components/vote-button";
import { getArticle } from "@/lib/articles";



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
            <div className="ml-auto flex items-center gap-2">
              <EditArticleButton slug={article.slug} authorId={article.authorId} />
              <VoteButton initial={article.votes} articleId={article.id} />
            </div>
          </div>
        </header>

        <div className="space-y-4 text-lg leading-8">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      <Discussion articleId={article.id} initial={article.comments} />
    </main>
  );
}
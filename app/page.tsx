import { Suspense } from "react";

import { ArticleList } from "@/components/article-list";
import { getArticles } from "@/lib/articles";

async function Feed() {
  const articles = await getArticles();
  return <ArticleList articles={articles} />;
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <section className="space-y-3">
        <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight">
          Write down what you know. Find what you need.
        </h1>
        <p className="text-lg text-muted-foreground">
          A shared library of articles and field notes from people who build things.
        </p>
      </section>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
        <Feed />
      </Suspense>
    </main>
  );
}
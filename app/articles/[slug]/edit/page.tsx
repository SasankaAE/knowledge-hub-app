import { Suspense } from "react";

import { WriteForm } from "@/components/write-form";
import { getArticle } from "@/lib/articles";

export const metadata = { title: "Edit article | Knowledge Hub" };

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight">
        Edit article
      </h1>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
        <EditContent params={params} />
      </Suspense>
    </main>
  );
}

async function EditContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return <p className="text-muted-foreground">Article not found.</p>;
  }

  return <WriteForm article={article} />;
}
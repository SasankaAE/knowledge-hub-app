"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, MessageSquare, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VoteButton } from "@/components/vote-button";
import type { Article } from "@/lib/data";

export function ArticleList({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const visible = articles.filter((a) =>
    `${a.title} ${a.excerpt} ${a.tags.join(" ")} ${a.author}`.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label="Search articles"
          placeholder="Search articles, tags or people"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {visible.map((a) => (
          <Card key={a.slug}>
            <CardHeader>
              <CardDescription>
                {a.author} · {a.role} · {a.date}
              </CardDescription>
              <CardTitle className="font-serif text-2xl">
                <Link href={`/articles/${a.slug}`} className="hover:text-primary">
                  {a.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-base">{a.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <Badge key={t} variant="tag">
                  {t}
                </Badge>
              ))}
            </CardContent>
            <CardFooter className="flex-wrap gap-4">
              <VoteButton initial={a.votes} />
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MessageSquare className="size-4" aria-hidden="true" />
                {a.comments.length}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-4" aria-hidden="true" />
                {a.readMinutes} min read
              </span>
            </CardFooter>
          </Card>
        ))}
        {visible.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No articles found.
          </p>
        )}
      </div>
    </div>
  );
}

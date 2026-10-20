"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Article } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle, useUser } from "@/lib/use-user";

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "article"
  );
}

// No `article` prop: write a new article. With `article`: edit it.
export function WriteForm({ article }: { article?: Article }) {
  const editing = !!article;
  const [title, setTitle] = useState(article?.title ?? "");
  const [tags, setTags] = useState(article?.tags.join(", ") ?? "");
  const [body, setBody] = useState(article?.body.join("\n\n") ?? "");
  const [published, setPublished] = useState(false);
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { user, name, loading } = useUser();

  const tagList = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const ready = title.trim() !== "" && body.trim() !== "";
  const canEdit = !editing || (!!user && user.id === article?.authorId);

  function reset() {
    setTitle("");
    setTags("");
    setBody("");
    setSlug("");
    setError("");
    setPublished(false);
  }

  async function publish(e: FormEvent) {
    e.preventDefault();
    if (!ready || saving) return;
    if (!supabase) {
      setError("Supabase isn't configured. Add your keys to .env.local and restart.");
      return;
    }
    if (!user) {
      setError("Sign in with Google to publish.");
      return;
    }
    setSaving(true);
    setError("");

    const fields = {
      title: title.trim(),
      excerpt: body.trim().slice(0, 160),
      body: body.trim(),
      tags: tagList,
    };

    if (article) {
      const { data, error: dbError } = await supabase
        .from("articles")
        .update(fields)
        .eq("slug", article.slug)
        .select("slug");
      setSaving(false);
      if (dbError) {
        setError(dbError.message);
        return;
      }
      if (!data || data.length === 0) {
        setError("You can only edit your own articles.");
        return;
      }
      setPublished(true);
      return;
    }

    const newSlug = `${slugify(title)}-${crypto.randomUUID().slice(0, 5)}`;
    const { error: dbError } = await supabase.from("articles").insert({
      slug: newSlug,
      ...fields,
      author_id: user.id,
      author_name: name || "Anonymous",
    });
    setSaving(false);
    if (dbError) {
      setError(
        dbError.code === "42501"
          ? "Not allowed. Sign in again, and make sure the latest schema.sql has been run."
          : dbError.message
      );
      return;
    }
    setSlug(newSlug);
    setPublished(true);
  }

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3">
          <p className="text-muted-foreground">
            {editing ? "Sign in to edit this article." : "Sign in to write and publish articles."}
          </p>
          <Button onClick={signInWithGoogle} disabled={!supabase}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!canEdit) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3">
          <p className="text-muted-foreground">You can only edit your own articles.</p>
          <Button asChild variant="outline">
            <Link href={`/articles/${article?.slug}`}>Back to article</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (published) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-4">
          <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-semibold">
              {editing ? "Article updated" : "Article published"}
            </h2>
            <p className="text-muted-foreground">
              &ldquo;{title}&rdquo; {editing ? "has been saved." : "is live."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/articles/${slug}`}>View article</Link>
            </Button>
            {!editing && (
              <Button variant="outline" onClick={reset}>
                Write another
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/">Back to articles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form className="space-y-5" onSubmit={publish}>
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          placeholder="What is this article about?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags
        </label>
        <Input
          id="tags"
          placeholder="Postgres, Security"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagList.map((t) => (
              <Badge key={t} variant="tag">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium">
          Article
        </label>
        <Textarea
          id="body"
          rows={14}
          placeholder="Write in plain text or Markdown"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={!ready || saving}>
          {saving ? "Saving..." : editing ? "Save changes" : "Publish"}
        </Button>
        <Button asChild variant="ghost">
          <Link href={editing ? `/articles/${article?.slug}` : "/"}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
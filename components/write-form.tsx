"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/data";
import { supabase } from "@/lib/supabase";

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "article"
  );
}

export function WriteForm() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(false);
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tagList = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const ready = title.trim() !== "" && body.trim() !== "";

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
    setSaving(true);
    setError("");
    const newSlug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;
    const { error: dbError } = await supabase.from("articles").insert({
      slug: newSlug,
      title: title.trim(),
      excerpt: body.trim().slice(0, 160),
      body: body.trim(),
      tags: tagList,
      author_name: currentUser.name,
    });
    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setSlug(newSlug);
    setPublished(true);
  }

  if (published) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-4">
          <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-semibold">Article published</h2>
            <p className="text-muted-foreground">&ldquo;{title}&rdquo; is live.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/articles/${slug}`}>View article</Link>
            </Button>
            <Button variant="outline" onClick={reset}>
              Write another
            </Button>
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
          {saving ? "Publishing..." : "Publish"}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
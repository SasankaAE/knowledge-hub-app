"use client";

import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Comment } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle, useUser } from "@/lib/use-user";
import { initialsOf } from "@/lib/utils";

// articleId set: comments are saved. No articleId (sample articles): read-only.
export function Discussion({
  articleId,
  initial,
}: {
  articleId?: string;
  initial: Comment[];
}) {
  const { user, name, loading } = useUser();
  const [comments, setComments] = useState(initial);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function post(e: FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || saving || !articleId || !supabase || !user) return;

    setSaving(true);
    setError("");
    const author = name || "Anonymous";
    const { data, error: dbError } = await supabase
      .from("comments")
      .insert({ article_id: articleId, author_id: user.id, author_name: author, body })
      .select("id")
      .single();
    setSaving(false);

    if (dbError) {
      setError(
        dbError.code === "42501"
          ? "Not allowed. Sign in again, and make sure the latest schema.sql has been run."
          : dbError.message
      );
      return;
    }
    setComments([
      ...comments,
      {
        id: data.id,
        authorId: user.id,
        author,
        initials: initialsOf(author),
        when: "Just now",
        text: body,
      },
    ]);
    setText("");
  }

  async function remove(id: string) {
    if (!supabase) return;
    const { error: dbError } = await supabase.from("comments").delete().eq("id", id);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setComments((list) => list.filter((c) => c.id !== id));
  }

  return (
    <section aria-labelledby="discussion" className="space-y-4 border-t pt-8">
      <h2 id="discussion" className="font-serif text-2xl font-semibold">
        Discussion{comments.length > 0 && ` (${comments.length})`}
      </h2>

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      {comments.map((c, i) => (
        <Card key={c.id ?? i} className="py-4">
          <CardContent className="flex gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">{c.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-sm">
                <span className="font-medium">{c.author}</span>{" "}
                <span className="text-muted-foreground">· {c.when}</span>
              </div>
              <p className="whitespace-pre-line">{c.text}</p>
            </div>
            {c.id && user?.id === c.authorId && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete comment"
                onClick={() => remove(c.id!)}
              >
                <Trash2 />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {!articleId ? (
        <p className="text-sm text-muted-foreground">
          Comments are open on articles saved in the database.
        </p>
      ) : loading ? null : !user ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3">
            <p className="text-muted-foreground">Sign in to join the discussion.</p>
            <Button onClick={signInWithGoogle} disabled={!supabase}>
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form className="space-y-3" onSubmit={post}>
          <label htmlFor="new-comment" className="text-sm font-medium">
            Add a comment
          </label>
          <Textarea
            id="new-comment"
            rows={3}
            placeholder="Share a question or a correction"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={!text.trim() || saving}>
            {saving ? "Posting..." : "Post comment"}
          </Button>
        </form>
      )}
    </section>
  );
}
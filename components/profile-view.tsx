"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { LogOut, Pencil, PenLine } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle, signOut, useUser } from "@/lib/use-user";

type Mine = { slug: string; title: string };
type Profile = { position: string; bio: string };

const EMPTY: Profile = { position: "", bio: "" };

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

export function ProfileView() {
  const { user, name, loading } = useUser();
  const uid = user?.id;
  const [mine, setMine] = useState<Mine[] | null>(null);
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [draft, setDraft] = useState<Profile>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid || !supabase) return;
    let cancelled = false;

    supabase
      .from("profiles")
      .select("position,bio")
      .eq("id", uid)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) {
          setProfile({ position: data.position ?? "", bio: data.bio ?? "" });
        }
      });

    supabase
      .from("articles")
      .select("slug,title")
      .eq("author_id", uid)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setMine((data as Mine[] | null) ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!uid || !supabase || saving) return;
    setSaving(true);
    setError("");
    const next = { position: draft.position.trim(), bio: draft.bio.trim() };
    const { error: dbError } = await supabase.from("profiles").upsert({ id: uid, ...next });
    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setProfile(next);
    setEditing(false);
  }

  if (loading) {
    return <div className="h-32 animate-pulse rounded-xl bg-muted" />;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3">
          <h1 className="font-serif text-3xl font-semibold">Your profile</h1>
          <p className="text-muted-foreground">Sign in to see your profile and articles.</p>
          <Button onClick={signInWithGoogle} disabled={!supabase}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent>
          {editing ? (
            <form className="space-y-4" onSubmit={save}>
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">
                  Current position
                </label>
                <Input
                  id="position"
                  placeholder="Full-stack engineer at Acme"
                  value={draft.position}
                  onChange={(e) => setDraft({ ...draft, position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  rows={5}
                  placeholder="A few lines about you"
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-start gap-5">
              <Avatar className="size-16">
                <AvatarFallback className="text-xl">{initialsOf(name ?? "")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <h1 className="font-serif text-3xl leading-tight font-semibold">{name}</h1>
                  {profile.position && (
                    <p className="text-muted-foreground">{profile.position}</p>
                  )}
                </div>
                {profile.bio ? (
                  <p className="whitespace-pre-line">{profile.bio}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add your current position and a short bio.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDraft(profile);
                    setError("");
                    setEditing(true);
                  }}
                >
                  <Pencil /> Edit profile
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut /> Sign out
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <section aria-labelledby="my-articles" className="space-y-4">
        <h2 id="my-articles" className="font-serif text-2xl font-semibold">
          Your articles
        </h2>
        {mine === null ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : mine.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-start gap-3">
              <p className="text-muted-foreground">You haven&apos;t published anything yet.</p>
              <Button asChild>
                <Link href="/write">
                  <PenLine /> Write your first article
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          mine.map((a) => (
            <Card key={a.slug}>
              <CardContent className="flex items-center justify-between gap-3">
                <Link href={`/articles/${a.slug}`} className="font-medium hover:text-primary">
                  {a.title}
                </Link>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/articles/${a.slug}/edit`}>
                    <Pencil /> Edit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
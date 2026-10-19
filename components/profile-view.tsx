"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, PenLine } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle, signOut, useUser } from "@/lib/use-user";

type Mine = { slug: string; title: string };

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
  const [mine, setMine] = useState<Mine[] | null>(null);
  const uid = user?.id;

  useEffect(() => {
    if (!uid || !supabase) return;
    let cancelled = false;
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

  if (loading) {
    return <div className="h-32 animate-pulse rounded-xl bg-muted" />;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3">
          <h1 className="font-serif text-3xl font-semibold">Your profile</h1>
          <p className="text-muted-foreground">Sign in to see your name and articles.</p>
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
        <CardContent className="flex flex-wrap items-center gap-5">
          <Avatar className="size-16">
            <AvatarFallback className="text-xl">{initialsOf(name ?? "")}</AvatarFallback>
          </Avatar>
          <h1 className="min-w-0 flex-1 font-serif text-3xl leading-tight font-semibold">
            {name}
          </h1>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
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
              <CardContent>
                <Link href={`/articles/${a.slug}`} className="font-medium hover:text-primary">
                  {a.title}
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
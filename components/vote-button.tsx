"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle, useUser } from "@/lib/use-user";

// With articleId the vote is saved (one per user, click again to remove it).
// Without it (sample articles) the vote only lives in the page.
export function VoteButton({
  initial,
  articleId,
}: {
  initial: number;
  articleId?: string;
}) {
  const { user } = useUser();
  const uid = user?.id;
  const [count, setCount] = useState(initial);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);

  // Did this user already vote? (the saved count already includes that vote)
  useEffect(() => {
    if (!articleId || !uid || !supabase) return;
    let cancelled = false;
    supabase
      .from("votes")
      .select("article_id")
      .eq("article_id", articleId)
      .eq("user_id", uid)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setOn(true);
      });
    return () => {
      cancelled = true;
    };
  }, [articleId, uid]);

  async function toggle() {
    if (!articleId) {
      setCount((c) => c + (on ? -1 : 1));
      setOn(!on);
      return;
    }
    if (!uid || !supabase) {
      void signInWithGoogle();
      return;
    }
    if (busy) return;

    setBusy(true);
    const next = !on;
    setOn(next);
    setCount((c) => c + (next ? 1 : -1));

    const { error } = next
      ? await supabase.from("votes").insert({ article_id: articleId, user_id: uid })
      : await supabase.from("votes").delete().eq("article_id", articleId).eq("user_id", uid);

    if (error) {
      setOn(!next);
      setCount((c) => c + (next ? -1 : 1));
    }
    setBusy(false);
  }

  return (
    <Button
      size="sm"
      variant={on ? "default" : "outline"}
      aria-pressed={on}
      aria-label="Upvote"
      onClick={toggle}
    >
      <ArrowUp /> {count}
    </Button>
  );
}
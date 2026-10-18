"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VoteButton({ initial }: { initial: number }) {
  const [on, setOn] = useState(false);

  return (
    <Button
      size="sm"
      variant={on ? "default" : "outline"}
      aria-pressed={on}
      aria-label="Upvote"
      onClick={() => setOn((v) => !v)}
    >
      <ArrowUp /> {initial + (on ? 1 : 0)}
    </Button>
  );
}

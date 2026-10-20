"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/use-user";

// Only shown to the author. The database policy enforces this too.
export function EditArticleButton({
  slug,
  authorId,
}: {
  slug: string;
  authorId?: string;
}) {
  const { user } = useUser();
  if (!authorId || user?.id !== authorId) return null;

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`/articles/${slug}/edit`}>
        <Pencil /> Edit
      </Link>
    </Button>
  );
}
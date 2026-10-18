import Link from "next/link";
import { PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard } from "@/components/profile-card";
import { articles, currentUser } from "@/lib/data";

export const metadata = { title: "Profile | Knowledge Hub" };

export default function ProfilePage() {
  const mine = articles.filter((a) => a.author === currentUser.name);

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <ProfileCard initial={currentUser} />

      <section aria-labelledby="my-articles" className="space-y-4">
        <h2 id="my-articles" className="font-serif text-2xl font-semibold">
          Your articles
        </h2>
        {mine.length === 0 ? (
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
    </main>
  );
}
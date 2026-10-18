import Link from "next/link";
import { BookOpen, PenLine, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="size-5 text-primary" aria-hidden="true" />
          Knowledge Hub
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/write">
              <PenLine /> Write
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link href="/profile" aria-label="Profile">
              <User />
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

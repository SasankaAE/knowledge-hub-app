import Link from "next/link";
import { BookOpen, PenLine } from "lucide-react";

import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="size-5 text-primary" aria-hidden="true" />
          <span className="hidden sm:inline">Knowledge Hub</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/write">
              <PenLine /> Write
            </Link>
          </Button>
          <AuthButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
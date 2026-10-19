"use client";

import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle, signOut, useUser } from "@/lib/use-user";

export function AuthButton() {
  const { user, name, loading } = useUser();

  if (!supabase) return null;

  if (loading) {
    return <div className="h-10 w-24 animate-pulse rounded-md bg-muted" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={signInWithGoogle}>
        <LogIn /> Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="max-w-40">
          <User />
          <span className="truncate">{name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Profile = { name: string; username: string; bio: string };

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

export function ProfileCard({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <Card>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setProfile({
                ...draft,
                name: draft.name.trim() || profile.name,
                username: draft.username.trim() || profile.username,
              });
              setEditing(false);
            }}
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                value={draft.username}
                onChange={(e) => setDraft({ ...draft, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Textarea
                id="bio"
                rows={4}
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setDraft(profile);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-start gap-5">
        <Avatar className="size-20">
          <AvatarFallback className="text-2xl">{initialsOf(profile.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h1 className="font-serif text-3xl leading-tight font-semibold">
              {profile.name}
            </h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>
          <p className="text-muted-foreground">{profile.bio}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDraft(profile);
            setEditing(true);
          }}
        >
          <Pencil /> Edit profile
        </Button>
      </CardContent>
    </Card>
  );
}
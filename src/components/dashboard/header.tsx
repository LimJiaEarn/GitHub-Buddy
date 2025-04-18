"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LightDarkToggle from "@/components/utils/LightDarkToggle";

interface HeaderProps {
  onSubmit: (username: string, repo: string) => void;
  isLoading?: boolean;
}

export function Header({ onSubmit, isLoading = false }: HeaderProps) {
  const [repo, setRepo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get username from local storage (set in settings)
    const username = localStorage.getItem("github_username") || "";

    if (username && repo.trim()) {
      onSubmit(username, repo.trim());
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background border-b p-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">GitHub Buddy</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="repo" className="sr-only">
              Repository Name
            </Label>
            <Input
              id="repo"
              placeholder="Repository name (e.g. next.js)"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Fetch"}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <LightDarkToggle />
        </div>
      </div>
    </header>
  );
}

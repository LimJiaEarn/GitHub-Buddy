"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DirectSearchProps {
  onSubmit: (username: string, repoName: string) => void;
  isLoading: boolean;
}

export function DirectSearch({ onSubmit, isLoading }: DirectSearchProps) {
  const [repo, setRepo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repo.trim()) {
      const parts = repo.trim().split("/");

      const [username, repoName] = parts;

      onSubmit(username, repoName);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Repository Explorer</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 ">
          <div className="space-y-2">
            <Label htmlFor="repo">Repository Name</Label>
            <Input
              id="repo"
              placeholder="<username>/<repo name>"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Fetch Repository"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

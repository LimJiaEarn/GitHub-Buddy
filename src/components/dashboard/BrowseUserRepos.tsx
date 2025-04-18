"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, CodeIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RepoCard } from "@/components/dashboard/RepoCard";
import { GitHubRepoInfo } from "@/types/github";
import { fetchUserRepos_SA } from "@/app/actions/github";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface BrowseUserReposProps {
  onRepoSelect: (username: string, repoName: string) => void;
}

export function BrowseUserRepos({ onRepoSelect }: BrowseUserReposProps) {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<GitHubRepoInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadUserRepos = async (user: string) => {
    if (!user.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    setIsLoading(true);
    try {
      const userRepos = await fetchUserRepos_SA(user);
      setRepos(userRepos);

      if (userRepos.length === 0) {
        toast.info("No repositories found for this user");
      } else {
        toast.success(`Found ${userRepos.length} repositories for ${user}`);
      }
    } catch (error) {
      console.error("Error loading repositories:", error);
      toast.error("Failed to load repositories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUserRepos(username);
  };

  // Filter repos based on search query
  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort repos by last updated
  const sortedRepos = [...filteredRepos].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search User Repositories</CardTitle>
        <CardDescription>Find repositories by GitHub username</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            placeholder="GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              "Search"
            )}
          </Button>
        </form>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {repos.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  Found {repos.length} repositories for {username}
                </div>
                <Input
                  placeholder="Filter repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            )}

            <div className="space-y-4">
              {sortedRepos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  onSelect={() => onRepoSelect(username, repo.name)}
                  showFullName={false}
                />
              ))}
            </div>

            {sortedRepos.length === 0 && searchQuery && repos.length > 0 && (
              <p className="text-center text-muted-foreground py-8">
                No repositories matching "{searchQuery}"
              </p>
            )}

            {repos.length > 0 && (
              <div className="mt-6 flex justify-center">
                <div className="text-xs text-muted-foreground flex items-center">
                  <CodeIcon className="h-3 w-3 mr-1" />
                  Showing {sortedRepos.length} repositories sorted by last
                  updated
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

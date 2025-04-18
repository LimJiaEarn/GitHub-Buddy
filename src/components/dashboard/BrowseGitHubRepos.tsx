"use client";

import { useState } from "react";
import { searchRepositories } from "@/app/actions/github-client";
import { GitHubSearchItem, GitHubRepoInfo } from "@/types/github";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { RepoCard } from "@/components/dashboard/RepoCard";

interface BrowseGitHubReposProps {
  onRepoSelect: (username: string, repoName: string) => void;
}

export function BrowseGitHubRepos({ onRepoSelect }: BrowseGitHubReposProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GitHubSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchRepositories(searchQuery.trim());
      setSearchResults(results.items);
      setTotalCount(results.total_count);

      if (results.items.length === 0) {
        toast.info("No repositories found matching your query");
      }
    } catch (error) {
      console.error("Error searching repositories:", error);
      toast.error("Failed to search repositories");
    } finally {
      setIsSearching(false);
    }
  };

  const convertToRepoInfo = (item: GitHubSearchItem): GitHubRepoInfo => {
    return {
      id: item.id,
      name: item.name,
      full_name: item.full_name,
      owner: {
        login: item.owner.login,
        id: item.owner.id,
        avatar_url: item.owner.avatar_url,
        html_url: item.owner.html_url,
        url: item.owner.html_url,
      },
      html_url: item.html_url,
      description: item.description,
      fork: item.fork,
      url: item.url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      pushed_at: item.pushed_at,
      homepage: item.homepage,
      size: item.size,
      stargazers_count: item.stargazers_count,
      watchers_count: item.watchers_count,
      language: item.language,
      forks_count: item.forks_count,
      open_issues_count: item.open_issues_count,
      default_branch: item.default_branch,
      private: false,
      git_url: `git://github.com/${item.full_name}.git`,
      ssh_url: `git@github.com:${item.full_name}.git`,
      clone_url: `https://github.com/${item.full_name}.git`,
      archived: false,
      disabled: false,
      license: null,
      topics: [],
      visibility: item.visibility || "public",
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search GitHub Repositories</CardTitle>
        <CardDescription>
          Search for public repositories on GitHub
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Search repositories... (e.g., code camp)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        {isSearching ? (
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
            {searchResults.length > 0 && (
              <div className="mb-4 text-sm text-muted-foreground">
                Found {totalCount.toLocaleString()} repositories (showing top{" "}
                {searchResults.length})
              </div>
            )}

            <div className="space-y-4">
              {searchResults.map((repo) => {
                const [username, repoName] = repo.full_name.split("/");
                return (
                  <RepoCard
                    key={repo.id}
                    repo={convertToRepoInfo(repo)}
                    onSelect={() => onRepoSelect(username, repoName)}
                    showFullName={true}
                  />
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

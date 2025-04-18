"use client";

import { useGitHubContext } from "@/contexts/GitHubContext";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { GitHubSearchItem } from "@/types/github";
import { searchRepositories } from "@/app/actions/github-client";

export const useGithub = () => {
  const {
    loadRepo,
    loadDirectory,
    loadFile,
    isLoading,
    repo,
    directoryContents,
    currentFile,
    currentPath,
  } = useGitHubContext();

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<GitHubSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleRepoLinkSubmit = useCallback(
    async (repoLink: string) => {
      try {
        const parts = repoLink.split("/");

        const [username, repoName] = parts;

        if (parts.length !== 2) {
          toast.error("Invalid repository format. Please use 'username/repo'");
          return;
        }

        // Load the repository
        await loadRepo(username, repoName);
        toast.success(`Successfully loaded ${repoName}`);
      } catch (error) {
        console.error("Error submitting repo:", error);
        toast.error("Failed to load repository");
      }
    },
    [loadRepo]
  );

  const handleRepoSubmit = async (repoName: string) => {
    try {
      const username = localStorage.getItem("github_username");
      if (!username) {
        throw new Error("No username");
      }

      await loadRepo(username, repoName);
      toast.success(`Successfully loaded ${repoName}`);
    } catch (error) {
      console.error("Error submitting repo:", error);
      toast.error("Failed to load repository");
    }
  };

  const handleDirectoryClick = async (path: string) => {
    try {
      await loadDirectory(path);
    } catch (error) {
      console.error("Error navigating to directory:", error);
      toast.error("Failed to navigate to directory");
    }
  };

  const handleFileClick = async (path: string) => {
    try {
      await loadFile(path);
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Failed to open file");
    }
  };

  // Helper function to go up one directory
  const navigateUp = () => {
    if (!currentPath) return; // Already at root

    const pathParts = currentPath.split("/");
    pathParts.pop(); // Remove the last part
    const newPath = pathParts.join("/");

    handleDirectoryClick(newPath);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchRepositories(query.trim());
      setSearchResults(results.items);

      if (results.items.length === 0) {
        toast.info("No repositories found matching your query");
      }

      return results;
    } catch (error) {
      console.error("Error searching repositories:", error);
      toast.error("Failed to search repositories");
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  return {
    // State
    isLoading,
    repo,
    directoryContents,
    currentFile,
    currentPath,
    searchInput,
    searchResults,
    isSearching,

    // Actions
    setSearchInput,
    handleRepoSubmit,
    handleRepoLinkSubmit,
    handleDirectoryClick,
    handleFileClick,
    navigateUp,
    handleSearch,
  };
};
